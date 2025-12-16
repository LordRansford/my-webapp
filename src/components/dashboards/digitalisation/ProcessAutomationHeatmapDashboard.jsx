"use client";

import { useState } from "react";

export default function ProcessAutomationHeatmapDashboard() {
  const [items, setItems] = useState([
    { name: "Invoice matching", volume: 8, complexity: 3 },
    { name: "Onboarding checks", volume: 6, complexity: 6 },
  ]);

  const update = (idx, key, val) =>
    setItems((prev) => prev.map((p, i) => (i === idx ? { ...p, [key]: Number(val) } : p)));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <span className="text-xs text-slate-600">Volume {item.volume} · Complexity {item.complexity}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex flex-col gap-1">
                Volume
                <input type="range" min="0" max="10" value={item.volume} onChange={(e) => update(idx, "volume", e.target.value)} className="accent-blue-600" />
              </label>
              <label className="flex flex-col gap-1">
                Complexity
                <input type="range" min="0" max="10" value={item.complexity} onChange={(e) => update(idx, "complexity", e.target.value)} className="accent-blue-600" />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-700">
              {item.complexity <= 4
                ? "Automation friendly—standardise inputs and proceed."
                : item.volume >= 7
                ? "High volume and high complexity—consider augmentation before full automation."
                : "Complex work—keep humans in the loop and improve guidance first."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
