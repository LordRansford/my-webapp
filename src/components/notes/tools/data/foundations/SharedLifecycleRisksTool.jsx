"use client";

import { useState } from "react";

const stages = [
  { id: "collect", label: "Collect", risks: ["Collecting more data than needed", "No consent noted"] },
  { id: "store", label: "Store", risks: ["Weak access controls", "No backups", "Mixed sensitive and public data"] },
  { id: "process", label: "Process", risks: ["No validation", "Transformations not logged"] },
  { id: "share", label: "Share", risks: ["Unclear recipients", "No masking", "Shadow copies"] },
  { id: "archive", label: "Archive/Delete", risks: ["Keeping data too long", "No deletion process"] },
];

export default function SharedLifecycleRisksTool() {
  const [open, setOpen] = useState({});

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Click a lifecycle stage to see common risks. Notice how they link to cybersecurity, AI governance, and design.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {stages.map((stage) => (
          <div key={stage.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => toggle(stage.id)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-900 focus:outline-none focus:ring focus:ring-amber-200"
              aria-expanded={open[stage.id] ? "true" : "false"}
            >
              {stage.label}
              <span aria-hidden="true">{open[stage.id] ? "−" : "+"}</span>
            </button>
            {open[stage.id] ? (
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-700">
                {stage.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-600">Expand to see typical risks.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
