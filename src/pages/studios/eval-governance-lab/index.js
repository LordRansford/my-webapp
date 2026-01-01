"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import StudioNavigation from "@/components/studios/StudioNavigation";
import { StudioBreadcrumbs } from "@/components/studios/StudioBreadcrumbs";

const studioFilters = [
  { id: "all", label: "All studios" },
  { id: "model-forge", label: "Model Forge" },
  { id: "vision-lab", label: "Vision Lab" },
  { id: "speech-lab", label: "Speech & Sound Lab" },
  { id: "docs-data-lab", label: "Docs & Data Lab" },
  { id: "llm-agent-lab", label: "LLM & Agent Lab" },
];

const timeFilters = [
  { id: "all", label: "All" },
  { id: "day", label: "Last day", ms: 24 * 60 * 60 * 1000 },
  { id: "hour", label: "Last hour", ms: 60 * 60 * 1000 },
];

const toyScenarios = {
  loan: {
    name: "Loan approval toy dataset",
    data: [
      { group: "A", score: 0.82, label: 1 },
      { group: "A", score: 0.71, label: 1 },
      { group: "A", score: 0.34, label: 0 },
      { group: "B", score: 0.63, label: 1 },
      { group: "B", score: 0.28, label: 0 },
      { group: "B", score: 0.21, label: 0 },
    ],
  },
  hiring: {
    name: "Hiring shortlist toy dataset",
    data: [
      { group: "A", score: 0.76, label: 1 },
      { group: "A", score: 0.62, label: 1 },
      { group: "A", score: 0.41, label: 0 },
      { group: "B", score: 0.55, label: 1 },
      { group: "B", score: 0.33, label: 0 },
      { group: "B", score: 0.18, label: 0 },
    ],
  },
};

const driftScenarios = [
  { id: "baseline", label: "Baseline", accuracy: 0.91, rmse: 0.42, shift: 0.05 },
  { id: "mild", label: "Mild drift", accuracy: 0.82, rmse: 0.55, shift: 0.25 },
  { id: "severe", label: "Severe drift", accuracy: 0.68, rmse: 0.73, shift: 0.55 },
];

const checklistThemes = [
  {
    id: "purpose",
    title: "Purpose and context",
    questions: [
      "Who is affected if this model is wrong?",
      "Is the intended use clearly documented?",
      "Is there a human in the loop for critical decisions?",
    ],
  },
  {
    id: "data",
    title: "Data and consent",
    questions: [
      "Do you have permission to use the data?",
      "Are sensitive attributes handled appropriately?",
      "Is data retention limited and documented?",
    ],
  },
  {
    id: "performance",
    title: "Performance and limitations",
    questions: [
      "Are the main metrics acceptable for the use case?",
      "Do you know where the model fails?",
      "Is there a rollback plan if performance drops?",
    ],
  },
  {
    id: "fairness",
    title: "Fairness and harm",
    questions: [
      "Have you checked for group disparities?",
      "Is there a mitigation plan for observed bias?",
      "Could misuse of this model cause harm?",
    ],
  },
  {
    id: "monitoring",
    title: "Monitoring and rollback",
    questions: [
      "Are drift and uptime monitors defined?",
      "Are alerts routed to responsible owners?",
      "Is there a tested rollback or disable switch?",
    ],
  },
];

const answerOptions = [
  { id: "yes", label: "Yes", weight: 0 },
  { id: "not-sure", label: "Not sure", weight: 0.5 },
  { id: "no", label: "No", weight: 1 },
];

function humanDuration(ms) {
  if (!ms || Number.isNaN(ms)) return "N/A";
  if (ms < 1000) return `${ms.toFixed(0)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function safeDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString();
}

function average(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function metricsFromJobs(jobs) {
  const stats = {
    total: jobs.length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
    durations: [],
    classification: [],
    regression: [],
    llm: [],
  };
  jobs.forEach((job) => {
    const { metrics } = job;
    if (job.startedAt && job.finishedAt) {
      const dur = new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime();
      if (!Number.isNaN(dur)) stats.durations.push(dur);
    }
    if (metrics) {
      if ("f1" in metrics || "accuracy" in metrics) {
        stats.classification.push(metrics);
      }
      if ("rmse" in metrics || "mae" in metrics || "r2" in metrics || metrics.taskType === "regression") {
        stats.regression.push(metrics);
      }
      if ("tokensIn" in metrics || "tokensOut" in metrics || "toolCallCount" in metrics) {
        stats.llm.push(metrics);
      }
    }
  });
  return stats;
}

function computeFairnessMetrics(data, threshold) {
  const groups = {};
  data.forEach((row) => {
    const g = row.group || "Unknown";
    if (!groups[g]) groups[g] = { tp: 0, tn: 0, fp: 0, fn: 0, total: 0 };
    const pred = row.score >= threshold ? 1 : 0;
    const label = row.label;
    if (pred === 1 && label === 1) groups[g].tp += 1;
    if (pred === 0 && label === 0) groups[g].tn += 1;
    if (pred === 1 && label === 0) groups[g].fp += 1;
    if (pred === 0 && label === 1) groups[g].fn += 1;
    groups[g].total += 1;
  });
  return Object.entries(groups).map(([group, m]) => {
    const acc = (m.tp + m.tn) / Math.max(1, m.total);
    return {
      group,
      accuracy: acc,
      fpr: m.fp / Math.max(1, m.fp + m.tn),
      fnr: m.fn / Math.max(1, m.fn + m.tp),
    };
  });
}

function driftData() {
  return driftScenarios.map((s) => ({
    scenario: s.label,
    accuracy: s.accuracy,
    rmse: s.rmse,
  }));
}

export default function EvalGovernanceLabPage() {
  const jobs = useStudiosStore((s) => s.jobs);

  const [studioFilter, setStudioFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const [fairnessScenario, setFairnessScenario] = useState("loan");
  const [fairnessThreshold, setFairnessThreshold] = useState(0.5);

  const [driftSelected, setDriftSelected] = useState("baseline");

  const [checklistJobId, setChecklistJobId] = useState("");
  const [checklistAnswers, setChecklistAnswers] = useState({});
  const [inspectionJobId, setInspectionJobId] = useState("");

  useEffect(() => {
    if (!checklistJobId && jobs.length) setChecklistJobId(jobs[jobs.length - 1].id);
    if (!inspectionJobId && jobs.length) setInspectionJobId(jobs[jobs.length - 1].id);
  }, [jobs, checklistJobId, inspectionJobId]);

  const filteredJobs = useMemo(() => {
    const now = Date.now();
    return jobs.filter((job) => {
      if (studioFilter !== "all" && job.studio !== studioFilter) return false;
      if (timeFilter === "all") return true;
      const tf = timeFilters.find((t) => t.id === timeFilter);
      if (!tf?.ms) return true;
      const start = job.startedAt ? new Date(job.startedAt).getTime() : null;
      if (!start || Number.isNaN(start)) return false;
      return now - start <= tf.ms;
    });
  }, [jobs, studioFilter, timeFilter]);

  const stats = useMemo(() => metricsFromJobs(filteredJobs), [filteredJobs]);

  const fairnessData = useMemo(() => computeFairnessMetrics(toyScenarios[fairnessScenario].data, fairnessThreshold), [
    fairnessScenario,
    fairnessThreshold,
  ]);

  const driftChart = useMemo(() => driftData(), []);

  const runOptions = useMemo(() => jobs.slice().reverse(), [jobs]);

  const selectedInspectionJob = useMemo(() => runOptions.find((j) => j.id === inspectionJobId), [runOptions, inspectionJobId]);

  const riskScore = useMemo(() => {
    if (!checklistJobId) return 0;
    const answersForJob = checklistAnswers[checklistJobId] || {};
    const weights = [];
    checklistThemes.forEach((theme) => {
      theme.questions.forEach((q) => {
        const choice = answersForJob[q] || "not-sure";
        const opt = answerOptions.find((o) => o.id === choice) || answerOptions[1];
        weights.push(opt.weight);
      });
    });
    return weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : 0;
  }, [checklistJobId, checklistAnswers]);

  const riskLabel = riskScore > 0.66 ? "High" : riskScore > 0.33 ? "Medium" : "Low";
  const riskColor = riskScore > 0.66 ? "bg-rose-100 text-rose-800 ring-rose-200" : riskScore > 0.33 ? "bg-amber-100 text-amber-800 ring-amber-200" : "bg-emerald-100 text-emerald-800 ring-emerald-200";

  const updateAnswer = (question, value) => {
    if (!checklistJobId) return;
    setChecklistAnswers((prev) => ({
      ...prev,
      [checklistJobId]: {
        ...(prev[checklistJobId] || {}),
        [question]: value,
      },
    }));
  };

  const renderMetricCard = (label, value, suffix = "", helper = "") => (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <p className="text-xl font-semibold text-slate-900">
        {value ?? "-"}
        {suffix}
      </p>
      {helper && <p className="text-xs text-slate-600 mt-1">{helper}</p>}
    </div>
  );

  const currentDrift = driftScenarios.find((s) => s.id === driftSelected) || driftScenarios[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
      {/* Navigation */}
      <div className="space-y-3">
        <StudioBreadcrumbs
          items={[
            { label: "Studios Hub", href: "/studios/hub" },
            { label: "Evaluation & Governance Lab" }
          ]}
        />
        <StudioNavigation
          studioType="lab"
          showHome={true}
          showHub={true}
          currentStudio="Evaluation & Governance Lab"
          currentStudioHref="/studios/eval-governance-lab"
        />
      </div>

      <div className="rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 ring-1 ring-rose-100">
          Evaluation &amp; Governance Lab
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">Evaluation &amp; Governance Lab</h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          This is the oversight room. It does not train models, it keeps score. Review how runs behaved, explore bias and drift with safe
          examples, and walk a governance checklist before trusting anything in the real world.
        </p>
      </div>

      <SecurityBanner />

      {/* 1. Metrics board */}
      <section
        id="metrics-board"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">1. Metrics board</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            <select
              value={studioFilter}
              onChange={(e) => setStudioFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {studioFilters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              {timeFilters.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeFilter(t.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-200 ${
                    timeFilter === t.id ? "bg-slate-900 text-white" : "bg-white text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {renderMetricCard("Total runs", stats.total)}
          {renderMetricCard("Completed", stats.completed)}
          {renderMetricCard("Failed", stats.failed)}
          {renderMetricCard("Avg duration", humanDuration(average(stats.durations) || 0))}
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {renderMetricCard(
            "Avg accuracy (cls)",
            stats.classification.length ? average(stats.classification.map((m) => Number(m.accuracy) || 0)).toFixed(2) : "-"
          )}
          {renderMetricCard(
            "Avg F1 (cls)",
            stats.classification.length ? average(stats.classification.map((m) => Number(m.f1) || 0)).toFixed(2) : "-"
          )}
          {renderMetricCard(
            "Worst F1",
            stats.classification.length
              ? Math.min(...stats.classification.map((m) => Number(m.f1) || Number.POSITIVE_INFINITY)).toFixed(2)
              : "-"
          )}
          {renderMetricCard(
            "Avg R² (reg)",
            stats.regression.length ? average(stats.regression.map((m) => Number(m.r2) || 0)).toFixed(2) : "-"
          )}
          {renderMetricCard(
            "Avg RMSE (reg)",
            stats.regression.length ? average(stats.regression.map((m) => Number(m.rmse) || 0)).toFixed(3) : "-"
          )}
          {renderMetricCard(
            "Avg tokens in (LLM)",
            stats.llm.length ? average(stats.llm.map((m) => Number(m.tokensIn) || 0)).toFixed(0) : "-"
          )}
          {renderMetricCard(
            "Avg tokens out (LLM)",
            stats.llm.length ? average(stats.llm.map((m) => Number(m.tokensOut) || 0)).toFixed(0) : "-"
          )}
          {renderMetricCard(
            "Avg tool calls",
            stats.llm.length ? average(stats.llm.map((m) => Number(m.toolCallCount) || 0)).toFixed(2) : "-"
          )}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-3">
          <p className="text-xs font-semibold text-slate-900 mb-2">Runs per studio</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={studioFilters
                  .filter((s) => s.id !== "all")
                  .map((s) => ({ studio: s.label, runs: filteredJobs.filter((j) => j.studio === s.id).length }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="studio" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="runs" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 2. Bias and fairness explorer */}
      <section
        id="fairness"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">2. Bias and fairness explorer</h2>
          <select
            value={fairnessScenario}
            onChange={(e) => setFairnessScenario(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="loan">Loan approval toy dataset</option>
            <option value="hiring">Hiring shortlist toy dataset</option>
          </select>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Toy examples to illustrate fairness concepts. Adjust the threshold to see how group metrics move. Real fairness work needs richer
          context and data.
        </p>
        <div className="flex items-center gap-3 text-sm text-slate-800">
          <label className="text-xs font-semibold text-slate-700">Threshold</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={fairnessThreshold}
            onChange={(e) => setFairnessThreshold(parseFloat(e.target.value))}
            className="w-64"
          />
          <span className="text-xs text-slate-600">{fairnessThreshold.toFixed(2)}</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-2xl border border-slate-100 bg-white p-3">
            <p className="text-xs font-semibold text-slate-900 mb-2">Accuracy by group</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fairnessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11 }} domain={[0, 1]} />
                  <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                  <Bar dataKey="accuracy" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-3">
            <p className="text-xs font-semibold text-slate-900 mb-2">False positive rate</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fairnessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11 }} domain={[0, 1]} />
                  <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                  <Bar dataKey="fpr" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-3">
            <p className="text-xs font-semibold text-slate-900 mb-2">False negative rate</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fairnessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11 }} domain={[0, 1]} />
                  <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                  <Bar dataKey="fnr" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-600">
          Accuracy treats all outcomes equally; false positives and false negatives capture where errors land. Shifts between groups can
          hint at fairness gaps.
        </p>
      </section>

      {/* 3. Drift and robustness simulator */}
      <section
        id="drift"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">3. Drift and robustness simulator</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Slide through scenarios to see how metrics degrade when data drifts. Monitoring and retraining plans keep you ready.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {driftScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setDriftSelected(s.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-200 ${
                driftSelected === s.id ? "bg-slate-900 text-white" : "bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {renderMetricCard("Accuracy", currentDrift ? `${(currentDrift.accuracy * 100).toFixed(1)}%` : "-")}
          {renderMetricCard("RMSE", currentDrift ? currentDrift.rmse.toFixed(2) : "-")}
          {renderMetricCard(
            "Shift intensity",
            `${Math.round((currentDrift?.shift ?? 0) * 100)}%`,
            "",
            "Higher shift → distribution moved further from baseline"
          )}
          {renderMetricCard("Monitoring needed", driftSelected === "severe" ? "Immediate" : driftSelected === "mild" ? "Soon" : "Low")}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-3">
          <p className="text-xs font-semibold text-slate-900 mb-2">Metric trend</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driftChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="scenario" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="rmse" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 4. Governance checklist and risk view */}
      <section
        id="governance"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">4. Governance checklist and risk view</h2>
          <select
            value={checklistJobId}
            onChange={(e) => setChecklistJobId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {runOptions.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-xs font-semibold ring-1 ${riskColor}`}>
          Risk: {riskLabel}
          <span className="text-xs text-slate-700">(based on answers)</span>
        </div>
        <div className="space-y-4">
          {checklistThemes.map((theme) => (
            <div key={theme.id} className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">{theme.title}</p>
              {theme.questions.map((q) => (
                <div key={q} className="space-y-1">
                  <p className="text-sm text-slate-800">{q}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    {answerOptions.map((opt) => (
                      <label key={opt.id} className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name={`${theme.id}-${q}`}
                          checked={(checklistAnswers[checklistJobId] || {})[q] === opt.id}
                          onChange={() => updateAnswer(q, opt.id)}
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  <textarea
                    placeholder="Notes (optional)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={(checklistAnswers[checklistJobId] || {})[`${q}-note`] || ""}
                    onChange={(e) => updateAnswer(`${q}-note`, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Run inspection panel */}
      <section
        id="run-inspection"
        className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">5. Run inspection panel</h2>
          <select
            value={inspectionJobId}
            onChange={(e) => setInspectionJobId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {runOptions.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name}
              </option>
            ))}
          </select>
        </div>
        {!selectedInspectionJob && <p className="text-sm text-slate-600">Select a run to inspect.</p>}
        {selectedInspectionJob && (
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
            <div className="grid gap-2 sm:grid-cols-2 text-sm text-slate-800">
              <div>
                <p className="text-xs font-semibold text-slate-700">Studio</p>
                <p>{selectedInspectionJob.studio}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Status</p>
                <p>{selectedInspectionJob.status}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Started</p>
                <p>{safeDate(selectedInspectionJob.startedAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Finished</p>
                <p>{safeDate(selectedInspectionJob.finishedAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Dataset</p>
                <p>{selectedInspectionJob.datasetId || "-"}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="text-xs font-semibold text-slate-700 mb-1">Metrics</p>
              {selectedInspectionJob.metrics ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs text-slate-800">
                  {Object.entries(selectedInspectionJob.metrics).map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                      <p className="font-semibold text-slate-700">{k}</p>
                      <p className="text-slate-800">{typeof v === "number" ? v.toFixed(3) : String(v)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">No metrics recorded for this run.</p>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-600">
        Need to revisit a run? Open the Control Room for the full log of jobs across studios.{" "}
        <Link href="/studios" className="text-sky-700 font-semibold hover:underline">
          Control Room
        </Link>
      </div>
    </div>
  );
}
