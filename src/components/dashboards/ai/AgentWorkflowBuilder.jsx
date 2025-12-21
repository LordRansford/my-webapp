"use client";

import { useState } from "react";

const seed = [
  { name: "Call LLM", type: "llm" },
  { name: "Query DB", type: "data" },
  { name: "Summarise", type: "llm" },
];

export default function AgentWorkflowBuilder() {
  const [steps, setSteps] = useState(seed);
  const [newStep, setNewStep] = useState("");

  const add = () => {
    if (!newStep.trim()) return;
    setSteps((prev) => [...prev, { name: newStep.trim(), type: "custom" }]);
    setNewStep("");
  };

  const missingApproval = !steps.some((s) => /approve|review/i.test(s.name));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Add step e.g. Human approval"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 md:w-64"
        />
        <button
          onClick={add}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Add
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
          >
            <span>{s.name}</span>
            <span className="text-sm uppercase tracking-wide text-slate-500">{s.type}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Risk hints</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li className={missingApproval ? "text-amber-700" : "text-emerald-700"}>
            Human approval step {missingApproval ? "missing" : "present"}.
          </li>
          <li>Prefer retrieval or DB reads before LLM actions when possible.</li>
        </ul>
      </div>
    </div>
  );
}
