"use client";

import { useMemo, useState } from "react";

const points = [
  { id: "A", vec: [1, 0.5, 0.2] },
  { id: "B", vec: [0.8, 0.7, 0.1] },
  { id: "C", vec: [0.2, 0.9, 0.6] },
  { id: "D", vec: [0.1, 0.2, 0.9] },
];

function project(method, v) {
  if (method === "random") return { x: v[0] * 0.8 + v[1] * 0.2, y: v[1] * -0.4 + v[2] * 0.9 };
  // simple PCA-like weights
  if (method === "pca") return { x: v[0] * 0.6 + v[1] * 0.6, y: v[1] * 0.3 + v[2] * 0.7 };
  return { x: v[0], y: v[1] };
}

export default function DimensionalityReductionView() {
  const [method, setMethod] = useState("pca");
  const projected = useMemo(() => points.map((p) => ({ id: p.id, ...project(method, p.vec) })), [method]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Projection</span>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="pca">PCA style</option>
          <option value="random">Random projection</option>
          <option value="raw">Raw first two dims</option>
        </select>
      </div>

      <div className="relative mt-3 h-48 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
        {projected.map((p) => (
          <div
            key={p.id}
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white shadow-sm"
            style={{ left: `${50 + p.x * 40}%`, top: `${50 - p.y * 40}%` }}
            title={`(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`}
          >
            {p.id}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-700">Switch projections to see how neighbourhoods change.</p>
    </div>
  );
}
