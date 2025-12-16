"use client";

import { useMemo, useState } from "react";

const LEVERS = [
  {
    id: "cache",
    label: "Add cache in front of database",
    effects: { latency: 2, scalability: 1, reliability: -1, complexity: 1 },
    note: "Caching reduces latency and load, but adds consistency and invalidation complexity.",
  },
  {
    id: "scaleOut",
    label: "Add a second instance behind a load balancer",
    effects: { latency: 0, scalability: 2, reliability: 1, complexity: 1 },
    note: "Scaling out improves capacity and resilience, but increases ops and coordination.",
  },
  {
    id: "async",
    label: "Move some work to async background processing",
    effects: { latency: -1, scalability: 1, reliability: 1, complexity: 1 },
    note: "Async can smooth spikes and improve reliability, but adds queueing and eventual consistency.",
  },
];

const BASE = { latency: 3, scalability: 2, reliability: 2, complexity: 1 };

export default function QualityTradeoffGame() {
  const [toggles, setToggles] = useState(
    LEVERS.reduce((acc, lever) => ({ ...acc, [lever.id]: false }), {})
  );

  const scores = useMemo(() => {
    const result = { ...BASE };
    LEVERS.forEach((lever) => {
      if (toggles[lever.id]) {
        Object.entries(lever.effects).forEach(([k, v]) => {
          result[k] = Math.max(1, Math.min(5, result[k] + v));
        });
      }
    });
    return result;
  }, [toggles]);

  const activeNotes = useMemo(
    () => LEVERS.filter((l) => toggles[l.id]).map((l) => l.note),
    [toggles]
  );

  const bars = [
    { id: "latency", label: "Latency (lower is better when score is lower)", inverse: true },
    { id: "scalability", label: "Scalability" },
    { id: "reliability", label: "Reliability" },
    { id: "complexity", label: "Complexity" },
  ];

  const reset = () =>
    setToggles(LEVERS.reduce((acc, lever) => ({ ...acc, [lever.id]: false }), {}));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <h4 className="text-base font-semibold text-slate-900">Adjust the design</h4>
      <p className="text-sm text-slate-700">Toggle design choices to see how they influence qualities.</p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {LEVERS.map((lever) => (
          <button
            key={lever.id}
            onClick={() => setToggles((prev) => ({ ...prev, [lever.id]: !prev[lever.id] }))}
            className={`rounded-xl border px-3 py-3 text-left text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
              toggles[lever.id]
                ? "border-sky-300 bg-sky-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-800 hover:border-sky-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{lever.label}</span>
              <span className="text-xs font-semibold">{toggles[lever.id] ? "On" : "Off"}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Quality scores (1-5)</h5>
          <div className="mt-3 space-y-2">
            {bars.map((bar) => {
              const val = scores[bar.id];
              const width = `${(val / 5) * 100}%`;
              return (
                <div key={bar.id}>
                  <div className="flex items-center justify-between text-sm text-slate-800">
                    <span>{bar.label}</span>
                    <span className="font-semibold">{val}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white">
                    <div
                      className={`h-full rounded-full ${bar.inverse ? "bg-rose-400" : "bg-sky-500"}`}
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">What this means</h5>
          <div className="space-y-2 text-sm text-slate-800">
            {activeNotes.length ? (
              activeNotes.map((note, idx) => <p key={idx}>{note}</p>)
            ) : (
              <p>Toggle a design choice to see its effects.</p>
            )}
          </div>
          <button
            onClick={reset}
            className="mt-3 inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Reset design
          </button>
        </div>
      </div>
    </div>
  );
}
