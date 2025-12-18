"use client";

import React, { useMemo, useState } from "react";
import { SecurityNotice } from "@/components/SecurityNotice";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { GitBranch, ShieldCheck, Rocket } from "lucide-react";

type StageKey =
  | "Lint and unit tests"
  | "Integration tests"
  | "Security and dependency scans"
  | "Build artefact"
  | "Deploy to staging"
  | "Smoke tests"
  | "Deploy to production";

const stageList: StageKey[] = [
  "Lint and unit tests",
  "Integration tests",
  "Security and dependency scans",
  "Build artefact",
  "Deploy to staging",
  "Smoke tests",
  "Deploy to production",
];

export default function PipelineDeployLab() {
  const [host, setHost] = useState("GitHub");
  const [build, setBuild] = useState("GitHub Actions");
  const [target, setTarget] = useState("Container platform");
  const [stages, setStages] = useState<Record<StageKey, boolean>>(
    Object.fromEntries(stageList.map((s) => [s, true])) as Record<StageKey, boolean>
  );

  const robustness = useMemo(() => {
    const total = stageList.length;
    const on = stageList.filter((s) => stages[s]).length;
    return Math.round((on / total) * 100);
  }, [stages]);

  const robustnessCopy =
    robustness < 40
      ? "This pipeline trusts everything and tests nothing. Brave."
      : robustness < 80
      ? "Decent for side projects; add staging, smoke, and scans before prod."
      : "Solid. Tests, scans and staging reduce late-night surprises.";

  const complexity = useMemo(() => {
    if (robustness >= 80) return "High";
    if (robustness >= 50) return "Medium";
    return "Low";
  }, [robustness]);

  const riskLevel = useMemo(() => {
    const missingSecurity = !stages["Security and dependency scans"];
    const missingTests = !stages["Integration tests"] || !stages["Lint and unit tests"];
    if (missingSecurity && missingTests) return "High";
    if (missingSecurity || missingTests) return "Medium";
    return "Low";
  }, [stages]);

  const comboCopy = useMemo(() => {
    const goodPractice = "Keep configs and secrets in env vars; fail builds on critical scans.";
    const mistake = "Skipping staging or smoke tests sends surprises straight to prod.";
    return `${host} with ${build} → ${target}. Ship artefacts, promote through staging, and keep prod deploys boring. Good: ${goodPractice} Common mistake: ${mistake}`;
  }, [host, build, target]);

  const toggleStage = (key: StageKey, value: boolean) => {
    setStages((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <SecurityNotice />
      <SecurityBanner />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">1. Choose your pipeline shape</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3 text-sm text-slate-800">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Repo host</span>
                <select
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {["GitHub", "GitLab", "Azure Repos", "Other"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Build system</span>
                <select
                  value={build}
                  onChange={(e) => setBuild(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {["GitHub Actions", "GitLab CI", "Azure Pipelines", "Custom"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Deployment target</span>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {["Static hosting", "Container platform", "Serverless", "On prem"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{comboCopy}</p>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-slate-900">2. Stages and gates</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-800">
              {stageList.map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={stages[s]}
                    onChange={(e) => toggleStage(s, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Pipeline robustness</span>
                <span>{robustness}/100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${
                    robustness < 40 ? "bg-rose-400" : robustness < 80 ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{ width: `${robustness}%` }}
                />
              </div>
              <p className="text-xs text-slate-600">{robustnessCopy}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-slate-900">3. Visual timeline and deployment summary</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-700">Selected stages in order:</p>
              <div className="flex flex-wrap gap-2">
                {stageList
                  .filter((s) => stages[s])
                  .map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2 text-sm text-slate-800">
              <p className="text-xs font-semibold text-slate-700">Deployment summary</p>
              <p>Estimated complexity: {complexity}</p>
              <p>Risk level: {riskLevel}</p>
              <p className="text-xs text-slate-600">
                Complexity rises with more gates; risk drops when tests and security scans stay on.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
