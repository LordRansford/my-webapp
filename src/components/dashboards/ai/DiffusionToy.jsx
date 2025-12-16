"use client";

import { useMemo, useState } from "react";

export default function DiffusionToy() {
  const [steps, setSteps] = useState(4);
  const [noise, setNoise] = useState(0.6);

  const grid = useMemo(() => {
    let values = Array(9).fill(0).map(() => Math.random());
    for (let i = 0; i < steps; i++) {
      values = values.map((v) => v * (1 - noise * 0.3) + 0.2);
    }
    return values;
  }, [steps, noise]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-700">
        <label>
          <span className="font-semibold text-slate-900">Steps</span>
          <input
            type="range"
            min="1"
            max="10"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="ml-2 align-middle accent-blue-600"
          />
          <span className="ml-2 text-xs text-slate-600">{steps}</span>
        </label>
        <label>
          <span className="font-semibold text-slate-900">Noise schedule</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
            className="ml-2 align-middle accent-blue-600"
          />
          <span className="ml-2 text-xs text-slate-600">{noise.toFixed(1)}</span>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {grid.map((v, idx) => (
          <div
            key={idx}
            className="flex h-12 items-center justify-center rounded-lg text-xs font-semibold text-slate-900"
            style={{ backgroundColor: `rgba(59,130,246,${v.toFixed(2)})` }}
          >
            {v.toFixed(2)}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-700">More steps and lower noise show a clearer pattern emerging.</p>
    </div>
  );
}
