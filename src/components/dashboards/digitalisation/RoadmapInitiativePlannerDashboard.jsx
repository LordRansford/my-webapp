"use client";

import { useState } from "react";

export default function RoadmapInitiativePlannerDashboard() {
  const [items, setItems] = useState([
    { name: "Event stream MVP", start: "Q1", end: "Q2", outcome: "Faster onboarding" },
    { name: "API gateway uplift", start: "Q2", end: "Q3", outcome: "Reliability" },
  ]);

  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <span className="text-xs text-slate-600">
                {item.start} → {item.end}
              </span>
            </div>
            <p className="text-xs text-slate-700">Outcome: {item.outcome}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex flex-col gap-1">
                Start
                <select
                  value={item.start}
                  onChange={(e) => setItems((prev) => prev.map((p, i) => (i === idx ? { ...p, start: e.target.value } : p)))}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {quarters.map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                End
                <select
                  value={item.end}
                  onChange={(e) => setItems((prev) => prev.map((p, i) => (i === idx ? { ...p, end: e.target.value } : p)))}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {quarters.map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-slate-700">
        {quarters.map((q) => (
          <div key={q} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 shadow-sm">
            <p className="font-semibold text-slate-900">{q}</p>
            <ul className="mt-1 space-y-1">
              {items
                .filter((i) => i.start === q || i.end === q)
                .map((i, idx) => (
                  <li key={idx} className="rounded bg-white px-2 py-1 shadow-sm">
                    {i.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
