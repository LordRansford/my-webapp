"use client";

import { useMemo, useState } from "react";

const data = [3, 5, 6, 7, 8, 10, 12, 12, 14, 18];

export default function AnalysisPlaygroundTool() {
  const [filter, setFilter] = useState(0);

  const filtered = useMemo(() => data.filter((value) => value >= filter), [filter]);

  const average = useMemo(() => {
    if (filtered.length === 0) return 0;
    return Math.round((filtered.reduce((sum, n) => sum + n, 0) / filtered.length) * 10) / 10;
  }, [filtered]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Adjust a simple filter and see how the average shifts. Analysis is asking questions and watching how answers change.
      </p>
      <label className="flex flex-col gap-2 text-sm text-slate-800">
        <span>Minimum value filter</span>
        <input
          type="range"
          min="0"
          max="15"
          value={filter}
          onChange={(e) => setFilter(Number(e.target.value))}
          className="accent-indigo-500"
        />
        <span className="text-xs text-slate-600">Current filter: {filter}</span>
      </label>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Filtered values</p>
        <p className="mt-1 font-mono">{filtered.join(", ") || "None"}</p>
        <p className="mt-1">Average: {average}</p>
        <p className="mt-1 text-slate-600">Different slices lead to different stories. Always ask why a change happens.</p>
      </div>
    </div>
  );
}
