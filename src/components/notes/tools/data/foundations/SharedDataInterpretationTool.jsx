"use client";

import { useState } from "react";

const views = [
  {
    id: "ai",
    label: "AI lens",
    note: "Wants balanced, representative data to avoid bias and overfitting.",
  },
  {
    id: "cyber",
    label: "Cybersecurity lens",
    note: "Checks for sensitive fields, access controls, and unusual spikes that could mean abuse.",
  },
  {
    id: "business",
    label: "Business decision lens",
    note: "Looks for trends, anomalies, and clarity to support choices.",
  },
];

const sample = [
  { field: "Customer age", value: "17, 18, 19, 20..." },
  { field: "Account balance", value: "0, 120, 9,999, 48" },
  { field: "Login location", value: "UK, UK, UK, Unknown" },
];

export default function SharedDataInterpretationTool() {
  const [selected, setSelected] = useState("ai");

  const currentView = views.find((view) => view.id === selected);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Pick a lens to see how the same tiny dataset is read differently. Context changes decisions.
      </p>
      <div className="flex flex-wrap gap-2">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => setSelected(view.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-sm focus:outline-none focus:ring ${
              selected === view.id
                ? "border-sky-500 bg-sky-50 text-sky-800 focus:ring-sky-200"
                : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-2">Field</th>
              <th className="px-3 py-2">Values</th>
              <th className="px-3 py-2">What this lens notices</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((row) => (
              <tr key={row.field} className="border-t border-slate-200 text-slate-900">
                <td className="px-3 py-2 font-semibold">{row.field}</td>
                <td className="px-3 py-2">{row.value}</td>
                <td className="px-3 py-2 text-slate-700">
                  {selected === "ai" && row.field === "Customer age"
                    ? "Check class balance and fairness."
                    : selected === "cyber" && row.field === "Login location"
                    ? "Unknown location could be risk."
                    : selected === "business" && row.field === "Account balance"
                    ? "Spot outliers that may skew decisions."
                    : "Interpretation depends on the lens."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Why this matters</p>
        <p className="mt-1">{currentView?.note}</p>
      </div>
    </div>
  );
}
