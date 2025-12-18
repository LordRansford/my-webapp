"use client";

import { useMemo, useState } from "react";
import { Database, Layers, MessageSquare } from "lucide-react";

const STEPS = [
  { id: "write", label: "Write to database" },
  { id: "cache", label: "Update cache" },
  { id: "event", label: "Publish event" },
];

export default function ConsistencySimulator() {
  const [steps, setSteps] = useState({
    write: true,
    cache: false,
    event: true,
  });

  const toggle = (id) => {
    setSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stateSummary = useMemo(() => {
    if (!steps.write) return "No durable state yet. The system is still pending.";
    if (steps.write && !steps.cache) return "Database updated, cache is stale until refreshed.";
    if (steps.write && steps.cache && !steps.event) return "State is fresh locally, but other services may be out of date.";
    return "Database, cache, and events aligned. Consistency is high.";
  }, [steps]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <Database className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Consistency and state simulator</p>
          <p className="text-xs text-slate-600">Toggle where state lives and watch it drift.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {STEPS.map((step) => {
          const active = steps[step.id];
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => toggle(step.id)}
              aria-pressed={active}
              className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${
                active
                  ? "border-indigo-200 bg-indigo-50/70 text-indigo-800"
                  : "border-slate-200 bg-slate-50/70 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                {step.id === "write" ? (
                  <Database className="h-4 w-4" aria-hidden="true" />
                ) : step.id === "cache" ? (
                  <Layers className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                )}
                {step.label}
              </div>
              <p className="mt-1 text-[11px] font-normal">
                {active ? "Active" : "Skipped"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">State check</p>
        <p className="mt-2">{stateSummary}</p>
      </div>
    </div>
  );
}
