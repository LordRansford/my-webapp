"use client";

import { useMemo, useState } from "react";

const MITIGATIONS = [
  { key: "humans", label: "Human review", risk: ["safety", "fairness"], note: "Use for high impact decisions." },
  { key: "monitor", label: "Monitoring and drift alerts", risk: ["drift", "reliability"], note: "Alerts when data shifts." },
  { key: "privacy", label: "Privacy controls", risk: ["privacy"], note: "Limit logging and access to sensitive data." },
  { key: "abuse", label: "Abuse filters", risk: ["abuse"], note: "Stop prompt or output misuse." },
  { key: "docs", label: "Decision logs", risk: ["accountability"], note: "Keep evidence for audits." },
];

const RISKS = ["safety", "fairness", "drift", "reliability", "privacy", "abuse", "accountability"];

export default function ResponsibleAIPlannerTool() {
  const [selected, setSelected] = useState(["humans", "monitor", "privacy"]);

  const coverage = useMemo(() => {
    const covered = new Set();
    selected.forEach((k) => {
      const item = MITIGATIONS.find((m) => m.key === k);
      item?.risk.forEach((r) => covered.add(r));
    });
    const missing = RISKS.filter((r) => !covered.has(r));
    return { covered: Array.from(covered), missing };
  }, [selected]);

  const toggle = (key) => {
    setSelected((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));
  };

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <p className="text-sm text-gray-700">Pick mitigations and see which responsible AI risks you still miss.</p>
      <div className="grid gap-2 md:grid-cols-2">
        {MITIGATIONS.map((m) => (
          <button
            key={m.key}
            onClick={() => toggle(m.key)}
            className={`rounded-2xl border p-3 text-left transition hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200 ${
              selected.includes(m.key) ? "bg-black text-white" : "bg-white/80 text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{m.label}</span>
              <span className="text-xs">{selected.includes(m.key) ? "On" : "Off"}</span>
            </div>
            <div className="mt-1 text-xs opacity-80">{m.note}</div>
            <div className="mt-1 text-sm opacity-70">Covers: {m.risk.join(", ")}</div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-white/70 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-600">Coverage</div>
        <p className="mt-1 text-sm text-gray-900">
          Covered: {coverage.covered.length ? coverage.covered.join(", ") : "None yet"}
        </p>
        <p className="text-sm text-gray-900">
          Missing: {coverage.missing.length ? coverage.missing.join(", ") : "All risks addressed at least once"}
        </p>
        <p className="mt-1 text-xs text-gray-600">
          Responsible AI is about matching mitigations to real risks. Do not collect more data than you need.
        </p>
      </div>
    </div>
  );
}
