"use client";

import { useState } from "react";

export default function ReferenceDataStewardshipDashboard() {
  const [rows, setRows] = useState([
    { name: "Country codes", owner: "Data Gov", frequency: "Monthly", health: 85 },
    { name: "Product catalog", owner: "Commerce", frequency: "Weekly", health: 70 },
  ]);

  const updateHealth = (idx, val) => {
    setRows((prev) => prev.map((row, i) => (i === idx ? { ...row, health: Number(val) } : row)));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={row.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                <p className="text-xs text-slate-600">
                  Owner: {row.owner} · Update: {row.frequency}
                </p>
              </div>
              <span className={`rounded-full px-2 py-1 text-sm font-semibold ${row.health < 75 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                Health {row.health}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={row.health}
              onChange={(e) => updateHealth(idx, e.target.value)}
              className="mt-2 w-full accent-blue-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
