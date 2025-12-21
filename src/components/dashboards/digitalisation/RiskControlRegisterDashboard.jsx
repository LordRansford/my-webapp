"use client";

import { useState } from "react";

const options = [1, 2, 3, 4, 5];

export default function RiskControlRegisterDashboard() {
  const [rows, setRows] = useState([
    { risk: "Data loss via S3 misconfig", likelihood: 2, impact: 4, control: "S3 policies + backups" },
    { risk: "Integration outage", likelihood: 3, impact: 3, control: "Retries + circuit breaker" },
  ]);

  const update = (idx, key, val) => setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: Number(val) || val } : r)));

  const score = (row) => row.likelihood * row.impact;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={row.risk} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{row.risk}</p>
              <span className={`rounded-full px-2 py-1 text-sm font-semibold ${score(row) >= 12 ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                Score {score(row)}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex flex-col gap-1">
                Likelihood
                <select value={row.likelihood} onChange={(e) => update(idx, "likelihood", e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                Impact
                <select value={row.impact} onChange={(e) => update(idx, "impact", e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-2 block text-xs text-slate-700">
              Control
              <input
                value={row.control}
                onChange={(e) => update(idx, "control", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
