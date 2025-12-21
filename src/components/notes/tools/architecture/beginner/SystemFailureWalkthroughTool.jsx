"use client";

import { useMemo, useState } from "react";

const STEPS = [
  {
    title: "A small slowdown starts",
    body: "The database gets slower. Nothing is down yet. Requests still succeed, just slower than normal.",
    focus: "Signal: latency increases before errors.",
  },
  {
    title: "Queues and timeouts appear",
    body: "Service B waits longer for the database. Its request queue grows. Some calls start timing out.",
    focus: "Signal: queue depth and timeout rate rise together.",
  },
  {
    title: "Retries amplify the load",
    body: "Clients retry immediately after timeouts. This increases traffic into the slow dependency and makes it worse.",
    focus: "Risk: retries can turn a slowdown into an outage.",
  },
  {
    title: "Cascading failure spreads",
    body: "Service A calls Service B. If B is slow, A becomes slow too. Upstream services start failing health checks.",
    focus: "Signal: failures spread outward from the original bottleneck.",
  },
  {
    title: "Guardrails limit the blast radius",
    body: "Timeouts, backoff, bulkheads, and fallbacks stop the feedback loop. The system degrades safely instead of collapsing.",
    focus: "Goal: keep the incident small and recoverable.",
  },
] ;

export default function SystemFailureWalkthroughTool() {
  const [idx, setIdx] = useState(0);

  const step = useMemo(() => STEPS[Math.max(0, Math.min(STEPS.length - 1, idx))], [idx]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Step through a common incident pattern. The point is to recognise the loop early and know what guardrails break
        it.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Step {idx + 1} of {STEPS.length}
        </p>
        <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
        <p className="mt-2 text-sm text-slate-700">{step.body}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
          <span className="font-semibold">Focus:</span> {step.focus}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm disabled:opacity-50"
          onClick={() => setIdx((n) => Math.max(0, n - 1))}
          disabled={idx === 0}
        >
          Back
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm disabled:opacity-50"
          onClick={() => setIdx((n) => Math.min(STEPS.length - 1, n + 1))}
          disabled={idx === STEPS.length - 1}
        >
          Next
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          onClick={() => setIdx(0)}
        >
          Restart
        </button>
      </div>
    </div>
  );
}


