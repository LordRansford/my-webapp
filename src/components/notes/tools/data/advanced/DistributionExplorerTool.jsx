"use client";

import { useMemo, useState } from "react";

const initialValues = [2, 4, 6, 8, 10, 12, 14, 16];

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function variance(values) {
  if (!values.length) return 0;
  const m = mean(values);
  return values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / values.length;
}

export default function DistributionExplorerTool() {
  const [spread, setSpread] = useState(0);

  const adjusted = useMemo(
    () => initialValues.map((v, i) => v + (i % 2 === 0 ? spread : -spread)),
    [spread]
  );

  const stats = useMemo(() => {
    const m = mean(adjusted);
    const v = variance(adjusted);
    const sd = Math.sqrt(v);
    return {
      mean: Math.round(m * 100) / 100,
      variance: Math.round(v * 100) / 100,
      sd: Math.round(sd * 100) / 100,
    };
  }, [adjusted]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Change the spread of values and see how averages and variation respond. This mirrors how real datasets widen or tighten.
      </p>
      <label className="flex flex-col gap-2 text-sm text-slate-800">
        <span>Adjust spread</span>
        <input
          type="range"
          min="0"
          max="6"
          value={spread}
          onChange={(e) => setSpread(Number(e.target.value))}
          className="accent-indigo-500"
        />
        <span className="text-xs text-slate-600">Current spread: {spread}</span>
      </label>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Values</p>
        <p className="mt-1 font-mono">{adjusted.map((v) => Math.round(v * 100) / 100).join(", ")}</p>
        <p className="mt-2 font-semibold text-slate-900">Stats</p>
        <ul className="mt-1 space-y-1">
          <li>Mean: {stats.mean}</li>
          <li>Variance: {stats.variance}</li>
          <li>Standard deviation: {stats.sd}</li>
        </ul>
        <p className="mt-2 text-slate-600">
          Higher variance and standard deviation mean values are spread out. Low values mean the set is tight.
        </p>
      </div>
    </div>
  );
}
