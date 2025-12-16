"use client";

import { useState } from "react";

const stepsSeed = [
  { name: "Ingest data", type: "data" },
  { name: "Train model", type: "train" },
  { name: "Evaluate", type: "eval" },
  { name: "Deploy", type: "deploy" },
];

export default function PipelineOrchestrator() {
  const [steps, setSteps] = useState(stepsSeed);
  const [newStep, setNewStep] = useState("");

  const addStep = () => {
    if (!newStep.trim()) return;
    setSteps((prev) => [...prev, { name: newStep.trim(), type: "custom" }]);
    setNewStep("");
  };

  const missingMonitoring = !steps.some((s) => s.name.toLowerCase().includes("monitor"));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Add stage (e.g., Monitor, Backfill)"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 md:w-64"
        />
        <button
          onClick={addStep}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {steps.map((s, idx) => (
          <div
            key={`${s.name}-${idx}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm"
          >
            {s.name}
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Checks</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li className={missingMonitoring ? "text-amber-700" : "text-emerald-700"}>
            Monitoring step {missingMonitoring ? "missing" : "present"}.
          </li>
          <li>Ensure evaluation occurs before deploy.</li>
        </ul>
      </div>
    </div>
  );
}
