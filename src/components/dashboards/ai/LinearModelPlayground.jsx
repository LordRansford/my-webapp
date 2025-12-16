"use client";

import { useMemo, useState } from "react";

const points = [
  { x: 1, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 6 },
  { x: 4, y: 8 },
  { x: 5, y: 9 },
];

function mse(m, b) {
  const err = points.reduce((sum, p) => sum + (p.y - (m * p.x + b)) ** 2, 0);
  return Number((err / points.length).toFixed(2));
}

export default function LinearModelPlayground() {
  const [m, setM] = useState(1);
  const [b, setB] = useState(1);
  const error = useMemo(() => mse(m, b), [m, b]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Slope (m)</span>
          <input
            type="range"
            min="-2"
            max="3"
            step="0.1"
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            className="mt-1 w-full accent-blue-600"
          />
          <span className="text-xs text-slate-600">m = {m.toFixed(1)}</span>
        </label>
        <label className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Intercept (b)</span>
          <input
            type="range"
            min="-2"
            max="5"
            step="0.1"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="mt-1 w-full accent-blue-600"
          />
          <span className="text-xs text-slate-600">b = {b.toFixed(1)}</span>
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-900">Mean squared error: {error}</p>
        <div className="relative mt-3 h-40 w-full rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 shadow-sm"
              style={{ left: `${p.x * 18 + 20}px`, top: `${160 - p.y * 12}px` }}
              title={`(${p.x}, ${p.y})`}
            />
          ))}
          {/* line sample */}
          <div
            className="absolute h-0.5 bg-emerald-600"
            style={{
              left: "20px",
              width: "140px",
              top: `${160 - (m * 1 + b) * 12}px`,
              transform: `skewY(${Math.atan(m) * (180 / Math.PI)}deg)`,
              transformOrigin: "left",
            }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-700">
          Adjust m and b to see how the fitted line moves relative to the points and how the error responds.
        </p>
      </div>
    </div>
  );
}
