"use client";

import { useMemo, useState } from "react";

const EVENTS = [
  { id: 1, score: 15, malicious: false },
  { id: 2, score: 62, malicious: true },
  { id: 3, score: 40, malicious: false },
  { id: 4, score: 78, malicious: true },
  { id: 5, score: 22, malicious: false },
  { id: 6, score: 90, malicious: true },
  { id: 7, score: 55, malicious: false },
  { id: 8, score: 68, malicious: true },
];

export default function DetectionRuleTuner() {
  const [threshold, setThreshold] = useState(50);

  const stats = useMemo(() => {
    let tp = 0,
      fp = 0,
      tn = 0,
      fn = 0;
    EVENTS.forEach((e) => {
      const alert = e.score >= threshold;
      if (alert && e.malicious) tp++;
      else if (alert && !e.malicious) fp++;
      else if (!alert && !e.malicious) tn++;
      else fn++;
    });
    return { tp, fp, tn, fn };
  }, [threshold]);

  const summary =
    threshold > 70
      ? "High threshold: fewer alerts and false positives, but higher chance of missing attacks."
      : threshold < 40
      ? "Low threshold: more attacks caught, but expect more noise."
      : "Balanced threshold: watch noise vs miss rate.";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <h4 className="text-base font-semibold text-slate-900">Tune the rule threshold</h4>
      <p className="text-sm text-slate-700">Events with score above the threshold raise alerts.</p>

      <div className="mt-3">
        <input
          type="range"
          min={0}
          max={100}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-sky-500"
          aria-label="Threshold"
        />
        <div className="mt-1 text-sm text-slate-800">Threshold: {threshold}</div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Event scores</h5>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {EVENTS.map((e) => (
              <span
                key={e.id}
                className={`rounded-full border px-3 py-1 font-semibold shadow-sm ${
                  e.score >= threshold ? "border-sky-300 bg-sky-50 text-slate-900" : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                {e.score}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Results</h5>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <Stat label="True positives" value={stats.tp} tone="emerald" />
            <Stat label="False positives" value={stats.fp} tone="amber" />
            <Stat label="True negatives" value={stats.tn} tone="emerald" />
            <Stat label="False negatives" value={stats.fn} tone="rose" />
          </div>
          <p className="mt-2 text-sm text-slate-800">{summary}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const color =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-slate-900"
      : tone === "amber"
      ? "border-amber-200 bg-amber-50 text-slate-900"
      : "border-rose-200 bg-rose-50 text-slate-900";
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm shadow-sm ${color}`}>
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
