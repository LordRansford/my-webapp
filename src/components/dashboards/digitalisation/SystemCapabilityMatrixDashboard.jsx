"use client";

import { useMemo, useState } from "react";

const levels = ["None", "Partial", "Strong"];

export default function SystemCapabilityMatrixDashboard() {
  const [capabilities, setCapabilities] = useState(["Customer onboarding", "Billing"]);
  const [systems, setSystems] = useState(["CRM", "ERP"]);
  const [matrix, setMatrix] = useState({
    "Customer onboarding": { CRM: "Strong", ERP: "Partial" },
    Billing: { CRM: "Partial", ERP: "Strong" },
  });

  const weakest = useMemo(() => {
    const scores = capabilities.map((cap) => {
      const vals = systems.map((sys) => levelScore(matrix?.[cap]?.[sys] || "None"));
      const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
      return { cap, avg };
    });
    return scores.sort((a, b) => a.avg - b.avg)[0];
  }, [capabilities, systems, matrix]);

  function levelScore(val) {
    return levels.indexOf(val) ?? 0;
  }

  const updateCell = (cap, sys, val) => {
    setMatrix((prev) => ({
      ...prev,
      [cap]: { ...(prev[cap] || {}), [sys]: val },
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Add capability</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="e.g., Identity"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const value = e.currentTarget.value.trim();
                  setCapabilities((prev) => (prev.includes(value) ? prev : [...prev, value]));
                  setMatrix((prev) => ({ ...prev, [value]: {} }));
                  e.currentTarget.value = "";
                }
              }}
            />
          </label>
          <label className="block text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Add system</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="e.g., Data hub"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const value = e.currentTarget.value.trim();
                  setSystems((prev) => (prev.includes(value) ? prev : [...prev, value]));
                  e.currentTarget.value = "";
                }
              }}
            />
          </label>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Weakest coverage</p>
            <p className="mt-1">
              {weakest ? `${weakest.cap} shows the lowest support. Consider reinforcing.` : "Add data to see insights."}
            </p>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Capability / System
                </th>
                {systems.map((sys) => (
                  <th key={sys} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {sys}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {capabilities.map((cap) => (
                <tr key={cap}>
                  <th className="px-3 py-2 text-left font-semibold text-slate-900">{cap}</th>
                  {systems.map((sys) => (
                    <td key={sys} className="px-3 py-2">
                      <select
                        value={matrix?.[cap]?.[sys] || "None"}
                        onChange={(e) => updateCell(cap, sys, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        {levels.map((level) => (
                          <option key={level}>{level}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
