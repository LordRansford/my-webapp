"use client";

import { useState } from "react";

const scenarios = [
  {
    id: 1,
    text: "A dataset used for a model is missing timestamps.",
    risk: "Decisions may be made on stale data.",
  },
  {
    id: 2,
    text: "Customer data is copied to a personal laptop to debug.",
    risk: "Privacy breach and loss of control.",
  },
  {
    id: 3,
    text: "An internal dashboard shows outliers but nobody flags them.",
    risk: "Misinterpretation and wrong actions.",
  },
  {
    id: 4,
    text: "Data is kept forever with no purpose review.",
    risk: "Storage cost, compliance risk, and trust erosion.",
  },
];

export default function DataRiskScenariosTool() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Open a scenario to see the risk. Strategic value comes from managing these calmly and early.
      </p>
      <div className="grid gap-2">
        {scenarios.map((scenario) => {
          const isOpen = openId === scenario.id;
          return (
            <div key={scenario.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-900 focus:outline-none focus:ring focus:ring-rose-200"
                onClick={() => setOpenId(isOpen ? null : scenario.id)}
                aria-expanded={isOpen ? "true" : "false"}
              >
                {scenario.text}
                <span aria-hidden="true">{isOpen ? "-" : "+"}</span>
              </button>
              {isOpen ? (
                <p className="mt-2 text-xs text-rose-700">{scenario.risk}</p>
              ) : (
                <p className="mt-2 text-xs text-slate-600">Open to view risk.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
