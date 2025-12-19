"use client";

import { useMemo, useState } from "react";

const steps = [
  { id: "raw", label: "Raw data", detail: "Sensor reading: 21°C, timestamp 09:00" },
  { id: "clean", label: "Cleaned", detail: "Validated range, unit confirmed, missing rows handled" },
  { id: "analysis", label: "Analysis", detail: "Average temperature stable, one spike flagged" },
  { id: "decision", label: "Decision", detail: "Adjust cooling slightly, notify operator" },
];

const issues = {
  raw: "If unit is missing, the value could be Fahrenheit not Celsius.",
  clean: "If timestamps are wrong, comparisons fail.",
  analysis: "If spike detection is too strict, false alarms happen.",
  decision: "If context is missing, the action may be wrong.",
};

export default function SharedDataToDecisionTool() {
  const [selected, setSelected] = useState("raw");

  const note = useMemo(() => issues[selected] || "Quality and trust matter at every step.", [selected]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Follow how one data point becomes a decision. Select a step to see how quality and trust affect outcomes.
      </p>
      <div className="grid gap-2 sm:grid-cols-4">
        {steps.map((step) => {
          const active = selected === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setSelected(step.id)}
              className={`rounded-xl border px-3 py-2 text-left shadow-sm focus:outline-none focus:ring ${
                active
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 focus:ring-emerald-200"
                  : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
              }`}
            >
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="mt-1 text-xs text-slate-700">{step.detail}</p>
            </button>
          );
        })}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">What could go wrong</p>
        <p className="mt-1">{note}</p>
      </div>
    </div>
  );
}
