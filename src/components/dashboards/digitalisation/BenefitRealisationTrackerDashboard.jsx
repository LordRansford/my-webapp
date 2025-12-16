"use client";

import { useState } from "react";

export default function BenefitRealisationTrackerDashboard() {
  const [benefits, setBenefits] = useState([
    { name: "Reduce onboarding time", indicator: "Time to activate", expected: "50% faster", status: "In progress" },
    { name: "Lower support volume", indicator: "Tickets per user", expected: "-20%", status: "At risk" },
  ]);

  const statuses = ["Not started", "In progress", "Realised", "At risk"];

  const update = (idx, key, value) => setBenefits((prev) => prev.map((b, i) => (i === idx ? { ...b, [key]: value } : b)));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {benefits.map((b, idx) => (
          <div key={b.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{b.name}</p>
                <p className="text-xs text-slate-600">Indicator: {b.indicator}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                  b.status === "Realised" ? "bg-emerald-100 text-emerald-800" : b.status === "At risk" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {b.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-700">Expected: {b.expected}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex flex-col gap-1">
                Status
                <select
                  value={b.status}
                  onChange={(e) => update(idx, "status", e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                Expected value
                <input
                  value={b.expected}
                  onChange={(e) => update(idx, "expected", e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-700">Flag benefits without clear indicators before claiming them.</div>
    </div>
  );
}
