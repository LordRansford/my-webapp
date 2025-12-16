"use client";

import { useMemo, useState } from "react";

const dimensions = ["Data", "Platforms", "Skills", "Governance", "Customer"];

export default function DigitalMaturityRadarDashboard() {
  const [scores, setScores] = useState(
    Object.fromEntries(dimensions.map((d) => [d, 60]))
  );

  const summary = useMemo(() => {
    const entries = Object.entries(scores);
    const strongest = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
    const weakest = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
    return { strongest, weakest };
  }, [scores]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {dimensions.map((dim) => (
            <label key={dim} className="block text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{dim}</span>
                <span className="text-xs text-slate-600">{scores[dim]} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores[dim]}
                className="mt-2 w-full accent-blue-600"
                onChange={(e) => setScores((prev) => ({ ...prev, [dim]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-48 w-48 rounded-full bg-slate-50">
            {dimensions.map((dim, idx) => {
              const angle = (idx / dimensions.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 20 + (scores[dim] / 100) * 90;
              const x = 96 + radius * Math.cos(angle);
              const y = 96 + radius * Math.sin(angle);
              return (
                <div
                  key={dim}
                  className="absolute h-2 w-2 rounded-full bg-blue-600"
                  style={{ left: x, top: y }}
                  title={`${dim}: ${scores[dim]}`}
                />
              );
            })}
            <div className="absolute inset-8 rounded-full border border-dashed border-slate-200" />
            <div className="absolute inset-16 rounded-full border border-dashed border-slate-200" />
            <div className="absolute inset-24 rounded-full border border-dashed border-slate-200" />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Narrative summary</p>
        <p className="mt-1">
          Strength: <span className="font-semibold">{summary.strongest[0]}</span> at{" "}
          {summary.strongest[1]}.
        </p>
        <p>
          Weak spot: <span className="font-semibold">{summary.weakest[0]}</span> at{" "}
          {summary.weakest[1]}. Focus here for the next sprint.
        </p>
      </div>
    </div>
  );
}
