"use client";

import { useState } from "react";

export default function OutcomeKPIDashboard() {
  const [rows, setRows] = useState([
    { outcome: "Faster onboarding", indicator: "Time to activate", current: 10, target: 5 },
    { outcome: "Higher NPS", indicator: "NPS score", current: 35, target: 50 },
  ]);

  const update = (idx, key, val) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: Number(val) || val } : r)));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {rows.map((row, idx) => {
          const progress = Math.min(100, Math.round((row.current / row.target) * 100));
          const tone = progress >= 100 ? "bg-emerald-100 text-emerald-800" : progress >= 70 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";
          return (
            <div key={row.outcome} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{row.outcome}</p>
                  <p className="text-xs text-slate-600">{row.indicator}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${tone}`}>{progress}%</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                <label className="flex flex-col gap-1">
                  Current
                  <input type="number" value={row.current} onChange={(e) => update(idx, "current", e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="flex flex-col gap-1">
                  Target
                  <input type="number" value={row.target} onChange={(e) => update(idx, "target", e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
