"use client";

import { useMemo, useState } from "react";
import { Target, Layers, Route, ShieldCheck, Database } from "lucide-react";

const CAPABILITIES = [
  { id: 1, name: "Customer journeys", icon: Route },
  { id: 2, name: "Data foundations", icon: Database },
  { id: 3, name: "Platform services", icon: Layers },
  { id: 4, name: "Risk and assurance", icon: ShieldCheck },
];

export default function TargetStateCanvasTool() {
  const [scores, setScores] = useState(
    CAPABILITIES.map((c) => ({ ...c, current: 2, target: 4 }))
  );

  const update = (id, field, value) => {
    setScores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: Number(value) } : c))
    );
  };

  const gaps = useMemo(
    () =>
      scores
        .map((c) => ({ ...c, gap: Math.max(c.target - c.current, 0) }))
        .sort((a, b) => b.gap - a.gap),
    [scores]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Target className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Target state canvas</p>
          <p className="text-xs text-slate-600">Score today versus target and spot the biggest gaps.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          {scores.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {c.name}
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 text-xs text-slate-600">
                  <label className="space-y-1">
                    <span className="font-semibold text-slate-700">Current: {c.current}</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={c.current}
                      onChange={(e) => update(c.id, "current", e.target.value)}
                      className="w-full accent-slate-700"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-slate-700">Target: {c.target}</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={c.target}
                      onChange={(e) => update(c.id, "target", e.target.value)}
                      className="w-full accent-slate-700"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priority gaps</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {gaps.map((g) => (
              <div key={g.id} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                <p className="font-semibold text-slate-900">
                  {g.name} - Gap {g.gap}
                </p>
                <p className="text-xs text-slate-600">
                  Current {g.current} / Target {g.target}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            The biggest gaps are not always the first priority. Pick the ones that unblock the most outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
