"use client";

import { useMemo, useState } from "react";

const policies = [
  { id: "open", label: "Open to team", risk: 3, usability: 5, trust: 3 },
  { id: "restricted", label: "Restricted access", risk: 2, usability: 4, trust: 4 },
  { id: "sensitive", label: "Sensitive handling", risk: 1, usability: 3, trust: 5 },
];

export default function GovernancePolicySimulatorTool() {
  const [choice, setChoice] = useState("restricted");

  const score = useMemo(() => {
    const selected = policies.find((p) => p.id === choice);
    if (!selected) return { risk: 0, usability: 0, trust: 0 };
    return { risk: selected.risk, usability: selected.usability, trust: selected.trust };
  }, [choice]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Choose a policy for a sample dataset and see how risk, usability, and trust shift. Governance balances all three.
      </p>
      <div className="flex flex-wrap gap-2">
        {policies.map((policy) => (
          <button
            key={policy.id}
            type="button"
            onClick={() => setChoice(policy.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-sm focus:outline-none focus:ring ${
              choice === policy.id
                ? "border-indigo-500 bg-indigo-50 text-indigo-800 focus:ring-indigo-200"
                : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
            }`}
          >
            {policy.label}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Current balance</p>
        <p className="mt-1">Risk: {score.risk}/5 (lower is safer)</p>
        <p>Usability: {score.usability}/5</p>
        <p>Trust: {score.trust}/5</p>
        <p className="mt-1 text-slate-600">
          Extreme controls can block work. Too little control erodes trust. Stewardship keeps the middle path.
        </p>
      </div>
    </div>
  );
}
