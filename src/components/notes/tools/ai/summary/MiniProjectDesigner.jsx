"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Layers } from "lucide-react";

const PROBLEMS = [
  { id: "support", label: "Support ticket routing", data: "Text" },
  { id: "forecast", label: "Energy demand forecast", data: "Time series" },
  { id: "vision", label: "Visual inspection", data: "Images" },
];

const MODELS = [
  { id: "classifier", label: "Classifier", fit: "Text and images" },
  { id: "regression", label: "Regression", fit: "Numbers and time series" },
  { id: "retrieval", label: "Retrieval + LLM", fit: "Search with grounding" },
];

const SAFETY = [
  "Red team prompts before launch",
  "Guardrails on input and output",
  "PII masking in logs",
  "Rollback and human review path",
];

export default function MiniProjectDesigner() {
  const [problem, setProblem] = useState(PROBLEMS[0].id);
  const [model, setModel] = useState(MODELS[0].id);
  const [metric, setMetric] = useState("F1");
  const [riskNote, setRiskNote] = useState("Limit scope and keep humans in the loop for edge cases.");

  const summary = useMemo(() => {
    const problemLabel = PROBLEMS.find((p) => p.id === problem)?.label || "";
    const modelLabel = MODELS.find((m) => m.id === model)?.label || "";
    return `${problemLabel} with a ${modelLabel} using ${metric}. ${riskNote}`;
  }, [problem, model, metric, riskNote]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <Layers className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Design a tiny AI project</p>
          <p className="text-xs text-slate-600">Pick a problem, model, metric, and risk note.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-800">Problem</span>
          <select
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          >
            {PROBLEMS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-800">Model family</span>
          <select
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          >
            {MODELS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} ({item.fit})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <label className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-800">Metric</span>
          <input
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
          <p className="mt-1 text-[11px] text-slate-500">Pick something that maps to real cost: F1, MAE, latency, or safety pass rate.</p>
        </label>

        <label className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-800">Risk note</span>
          <textarea
            value={riskNote}
            onChange={(event) => setRiskNote(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
        </label>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          Plan summary
        </p>
        <p className="mt-1 text-slate-700">{summary}</p>
        <div className="mt-2 grid gap-1 text-[11px] text-slate-600">
          {SAFETY.map((item) => (
            <span key={item} className="rounded-full bg-white px-2 py-1 font-semibold text-slate-700">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
