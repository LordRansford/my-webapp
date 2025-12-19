"use client";

import { useState } from "react";

const hops = [
  { id: "input", label: "Input app", risk: "Collects personal data" },
  { id: "api", label: "API layer", risk: "Needs auth and rate limits" },
  { id: "queue", label: "Queue", risk: "Messages could leak if not encrypted" },
  { id: "store", label: "Data store", risk: "Backups and retention matter" },
  { id: "analytics", label: "Analytics", risk: "Aggregation must protect identities" },
];

export default function DataFlowVisualizer() {
  const [highlight, setHighlight] = useState("input");

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Click each hop to see why boundaries matter. Good architecture, cyber controls, and data discipline align here.
      </p>
      <div className="flex flex-wrap gap-2">
        {hops.map((hop) => (
          <button
            key={hop.id}
            type="button"
            onClick={() => setHighlight(hop.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-sm focus:outline-none focus:ring ${
              highlight === hop.id
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 focus:ring-emerald-200"
                : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
            }`}
          >
            {hop.label}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">
          {hops.find((hop) => hop.id === highlight)?.label}
        </p>
        <p className="mt-1">{hops.find((hop) => hop.id === highlight)?.risk}</p>
      </div>
    </div>
  );
}
