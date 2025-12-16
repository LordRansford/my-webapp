"use client";

import { useMemo, useState } from "react";

const STEPS = [
  {
    id: "client",
    title: "Client",
    carries: ["request payload", "trace id"],
    does: "Sends request with headers and correlation ids.",
    qualities: ["latency", "usability"],
  },
  {
    id: "gateway",
    title: "API gateway",
    carries: ["request payload", "trace id", "auth context"],
    does: "Validates, authenticates, rate limits, and routes.",
    qualities: ["security", "reliability"],
  },
  {
    id: "service",
    title: "Service",
    carries: ["request payload", "trace id", "auth context"],
    does: "Applies business rules, orchestrates downstream calls.",
    qualities: ["latency", "modifiability"],
  },
  {
    id: "database",
    title: "Database",
    carries: ["persisted entity", "trace id"],
    does: "Stores and retrieves state with constraints and indexes.",
    qualities: ["reliability", "consistency"],
  },
  {
    id: "event-bus",
    title: "Event bus",
    carries: ["event payload", "trace id"],
    does: "Publishes domain events to decouple producers and consumers.",
    qualities: ["scalability", "evolution"],
  },
  {
    id: "reporting",
    title: "Reporting service",
    carries: ["event payload", "materialized views"],
    does: "Builds read models and dashboards from events.",
    qualities: ["observability", "latency"],
  },
];

export default function RequestFlowGame() {
  const [index, setIndex] = useState(0);
  const [showFull, setShowFull] = useState(false);

  const current = useMemo(() => STEPS[index], [index]);
  const next = () => setIndex((i) => Math.min(STEPS.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>
                Step {index + 1} / {STEPS.length}
              </span>
            </div>
            <h4 className="mt-2 text-base font-semibold text-slate-900">{current.title}</h4>
            <p className="text-sm text-slate-800">{current.does}</p>
            <div className="mt-2 text-sm text-slate-800">
              <span className="font-semibold">Carries:</span>{" "}
              {current.carries.join(", ")}
            </div>
            <div className="mt-2 text-sm text-slate-800">
              <span className="font-semibold">Quality attributes touched:</span>{" "}
              {current.qualities.join(", ")}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={prev}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
                disabled={index === 0}
              >
                Previous
              </button>
              <button
                onClick={next}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
                disabled={index === STEPS.length - 1}
              >
                Next
              </button>
              <button
                onClick={() => setShowFull((v) => !v)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                {showFull ? "Hide full journey" : "Show full journey"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h5 className="text-sm font-semibold text-slate-900">Journey map</h5>
            <ol className="mt-2 space-y-2 text-sm text-slate-800">
              {STEPS.map((step, idx) => (
                <li
                  key={step.id}
                  className={`rounded-lg border px-3 py-2 shadow-sm ${
                    idx === index ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{step.title}</span>
                    <span className="text-xs text-slate-600">#{idx + 1}</span>
                  </div>
                  <div className="text-xs text-slate-700">{step.does}</div>
                </li>
              ))}
            </ol>
          </div>

          {showFull && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-900 shadow-sm">
              <h5 className="mb-2 text-sm font-semibold text-emerald-800">Full journey at a glance</h5>
              <div className="flex flex-wrap gap-2">
                {STEPS.map((step) => (
                  <span
                    key={step.id}
                    className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm"
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
