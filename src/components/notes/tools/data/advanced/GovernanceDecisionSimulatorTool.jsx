"use client";

import { useMemo, useState } from "react";

export default function GovernanceDecisionSimulatorTool() {
  const [sensitivity, setSensitivity] = useState("medium");
  const [urgency, setUrgency] = useState("normal");

  const outcome = useMemo(() => {
    if (sensitivity === "high" && urgency === "fast") {
      return "Pause and add controls: involve stewardship and ensure legal review before action.";
    }
    if (sensitivity === "low" && urgency === "fast") {
      return "Move quickly with light review, but log decisions for accountability.";
    }
    if (sensitivity === "high" && urgency === "normal") {
      return "Design a controlled release with clear access policies and audit trails.";
    }
    return "Proceed with standard governance: clarity on purpose, access, and retention.";
  }, [sensitivity, urgency]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Choose data sensitivity and urgency to see how governance decisions balance compliance, innovation, and risk.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Data sensitivity</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["low", "medium", "high"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSensitivity(level)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none focus:ring ${
                  sensitivity === level
                    ? "border-indigo-500 bg-indigo-50 text-indigo-800 focus:ring-indigo-200"
                    : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Urgency</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["fast", "normal", "deliberate"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setUrgency(level)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none focus:ring ${
                  urgency === level
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 focus:ring-emerald-200"
                    : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Suggested approach</p>
        <p className="mt-1">{outcome}</p>
        <p className="mt-1 text-slate-600">
          Governance is context. Make the decision explicit, record it, and revisit when conditions change.
        </p>
      </div>
    </div>
  );
}
