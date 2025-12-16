"use client";

import { useMemo, useState } from "react";

const metrics = ["Completeness", "Timeliness", "Accuracy", "Consistency"];

export default function DataQualityDashboard() {
  const [values, setValues] = useState(
    Object.fromEntries(metrics.map((m) => [m, 75]))
  );

  const composite = useMemo(() => {
    const list = Object.values(values);
    return Math.round(list.reduce((a, b) => a + b, 0) / list.length);
  }, [values]);

  const tone = composite > 80 ? "bg-emerald-100 text-emerald-800" : composite > 60 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {metrics.map((metric) => (
            <label key={metric} className="block text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{metric}</span>
                <span className="text-xs text-slate-600">{values[metric]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={values[metric]}
                className="mt-2 w-full accent-blue-600"
                onChange={(e) => setValues((prev) => ({ ...prev, [metric]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Overall picture</p>
          <div className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tone}`}>
            Overall quality: {composite}%
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {composite > 80
              ? "Data feels trustworthy; keep monitoring timeliness and edge cases."
              : composite > 60
              ? "Usable with caution; address the lowest dimensions before scaling."
              : "High friction likely; prioritise fixes before adding more consumers."}
          </p>
        </div>
      </div>
    </div>
  );
}
