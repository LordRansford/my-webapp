"use client";

import { useMemo, useState } from "react";

const sample = [55, 72, 68, 80, 77, 59];

function transform(values, method) {
  if (method === "standard") {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length) || 1;
    return values.map((v) => (v - mean) / std);
  }
  if (method === "minmax") {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return values.map((v) => (v - min) / span);
  }
  if (method === "log") return values.map((v) => Math.log(v));
  return values;
}

function summarize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length) || 0;
  return { min: min.toFixed(2), max: max.toFixed(2), mean: mean.toFixed(2), std: std.toFixed(2) };
}

export default function FeatureEngineeringPlayground() {
  const [method, setMethod] = useState("none");

  const transformed = useMemo(() => transform(sample, method), [method]);
  const before = summarize(sample);
  const after = summarize(transformed);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Transform</span>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="none">None</option>
            <option value="standard">Standard scale</option>
            <option value="minmax">Min-max</option>
            <option value="log">Log</option>
          </select>
        </label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">Before</p>
          <p>Min: {before.min}</p>
          <p>Max: {before.max}</p>
          <p>Mean: {before.mean}</p>
          <p>Std: {before.std}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">After</p>
          <p>Min: {after.min}</p>
          <p>Max: {after.max}</p>
          <p>Mean: {after.mean}</p>
          <p>Std: {after.std}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Strip view</p>
        <div className="flex flex-wrap gap-1">
          {transformed.map((v, idx) => (
            <div
              key={idx}
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${Math.min(100, Math.abs(v) * 25 + 10)}px` }}
              title={v.toFixed(2)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
