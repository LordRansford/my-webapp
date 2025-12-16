"use client";

import { useMemo, useState } from "react";

const data = [
  { x: 1, y: 1, label: 0 },
  { x: 2, y: 1, label: 0 },
  { x: 2, y: 2, label: 0 },
  { x: 3, y: 4, label: 1 },
  { x: 4, y: 3, label: 1 },
  { x: 3.5, y: 3.5, label: 1 },
];

function classifyLinear(p) {
  // simple line y = x - 0.2
  return p.y > p.x - 0.2 ? 1 : 0;
}

function classifyCurved(p) {
  // simple curve centered at (2.5,2.5)
  const dx = p.x - 2.5;
  const dy = p.y - 2.5;
  return dx * dx + dy * dy > 1.5 ? 1 : 0;
}

export default function DecisionBoundarySandbox() {
  const [mode, setMode] = useState("linear");

  const classifier = useMemo(() => (mode === "linear" ? classifyLinear : classifyCurved), [mode]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Boundary type</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="linear">Linear</option>
            <option value="curved">Non-linear</option>
          </select>
        </label>
      </div>

      <div className="relative mt-4 h-48 w-full rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
        {/* grid */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0 h-px bg-slate-200/60" style={{ top: `${(i / 5) * 100}%` }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-slate-200/60" style={{ left: `${(i / 5) * 100}%` }} />
        ))}

        {/* decision shading */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background:
              mode === "linear"
                ? "linear-gradient(135deg, rgba(59,130,246,0.15) 50%, rgba(248,113,113,0.15) 50%)"
                : "radial-gradient(circle at 50% 50%, rgba(248,113,113,0.15) 35%, rgba(59,130,246,0.15) 35%)",
          }}
        />

        {data.map((p, idx) => {
          const pred = classifier(p);
          const correct = pred === p.label;
          return (
            <div
              key={idx}
              className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm ${
                p.label === 1 ? "bg-rose-500" : "bg-blue-500"
              } ${correct ? "ring-2 ring-emerald-300/80" : "ring-2 ring-amber-300/80"}`}
              style={{ left: `${(p.x / 5) * 100}%`, top: `${100 - (p.y / 5) * 100}%` }}
              title={`true:${p.label} pred:${pred}`}
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-700">
        Toggle the boundary type to see how model capacity changes which points are correctly separated.
      </p>
    </div>
  );
}
