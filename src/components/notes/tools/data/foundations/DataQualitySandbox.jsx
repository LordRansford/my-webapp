"use client";

import { useMemo, useState } from "react";

export default function DataQualitySandbox() {
  const [missing, setMissing] = useState(0);
  const [noise, setNoise] = useState(0);

  const qualityScore = useMemo(() => {
    const base = 100;
    const penalty = missing * 5 + noise * 4;
    return Math.max(0, base - penalty);
  }, [missing, noise]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Adjust missing values and noise to see a quick quality score. Lower quality means weaker decisions and models.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-800">
          <span>Missing values (per 100 rows)</span>
          <input
            type="range"
            min="0"
            max="10"
            value={missing}
            onChange={(e) => setMissing(Number(e.target.value))}
            className="accent-amber-500"
          />
          <span className="text-xs text-slate-600">{missing} missing</span>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-800">
          <span>Noise level (scale 0-10)</span>
          <input
            type="range"
            min="0"
            max="10"
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
            className="accent-sky-500"
          />
          <span className="text-xs text-slate-600">Noise setting: {noise}</span>
        </label>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-sm font-semibold text-slate-900">Quality score: {qualityScore}/100</p>
        <p className="mt-1 text-xs text-slate-700">
          Aim high. Dropping below 70 often shows up as poor dashboards or shaky model results.
        </p>
      </div>
    </div>
  );
}
