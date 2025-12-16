"use client";

import { useMemo, useState } from "react";

const sample = [
  { age: 24, income: 55, segment: "A", label: 0 },
  { age: 31, income: 72, segment: "B", label: 1 },
  { age: 28, income: 68, segment: "A", label: 1 },
  { age: 42, income: 80, segment: "C", label: 0 },
  { age: 36, income: 77, segment: "B", label: 1 },
  { age: 29, income: 59, segment: "C", label: 0 },
];

const numericCols = ["age", "income"];
const categoricalCols = ["segment"];
const labelCols = ["label"];

function stats(values) {
  const n = values.length;
  if (!n) return { n: 0, min: 0, max: 0, mean: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / n;
  return { n, min, max, mean: Number(mean.toFixed(2)) };
}

export default function AIDatasetExplorer() {
  const [feature, setFeature] = useState("age");
  const [label, setLabel] = useState("label");

  const numericStats = useMemo(() => stats(sample.map((r) => Number(r[feature]) || 0)), [feature]);

  const missingCounts = useMemo(() => {
    const allCols = [...numericCols, ...categoricalCols, ...labelCols];
    return Object.fromEntries(
      allCols.map((col) => [col, sample.filter((r) => r[col] === null || r[col] === undefined).length])
    );
  }, []);

  const categoricalCounts = useMemo(() => {
    if (!categoricalCols.includes(feature)) return {};
    const map = {};
    sample.forEach((r) => {
      const key = r[feature] ?? "missing";
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [feature]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Feature column</span>
          <select
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {[...numericCols, ...categoricalCols].map((col) => (
              <option key={col}>{col}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Label column</span>
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {labelCols.map((col) => (
              <option key={col}>{col}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          <p className="font-semibold text-slate-900">Numeric summary</p>
          <p className="text-xs text-slate-600">Feature: {feature}</p>
          <p>Count: {numericStats.n}</p>
          <p>Min: {numericStats.min}</p>
          <p>Max: {numericStats.max}</p>
          <p>Mean: {numericStats.mean}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          <p className="font-semibold text-slate-900">Missing values</p>
          <ul className="mt-1 space-y-1 text-xs text-slate-700">
            {Object.entries(missingCounts).map(([col, cnt]) => (
              <li key={col} className="flex justify-between">
                <span>{col}</span>
                <span className="font-semibold text-slate-900">{cnt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {categoricalCols.includes(feature) && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Categorical distribution</p>
          <div className="mt-2 space-y-2">
            {Object.entries(categoricalCounts).map(([val, cnt]) => (
              <div key={val} className="text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span>{val}</span>
                  <span className="font-semibold text-slate-900">{cnt}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${(cnt / sample.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
