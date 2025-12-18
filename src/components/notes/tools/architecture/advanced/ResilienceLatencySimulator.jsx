"use client";

import { useMemo, useState } from "react";
import { Activity, AlertTriangle, Timer, ShieldCheck } from "lucide-react";

export default function ResilienceLatencySimulator() {
  const [timeout, setTimeoutMs] = useState(800);
  const [retries, setRetries] = useState(1);
  const [breaker, setBreaker] = useState(2);

  const risk = useMemo(() => {
    const score = timeout < 500 ? 2 : timeout < 900 ? 1 : 0;
    const retryScore = retries >= 2 ? 1 : 0;
    const breakerScore = breaker >= 2 ? 1 : 0;
    return score + retryScore + breakerScore;
  }, [timeout, retries, breaker]);

  const latency = useMemo(() => {
    return Math.round(timeout + retries * 150 + breaker * 40);
  }, [timeout, retries, breaker]);

  const label = risk >= 3 ? "Stable" : risk === 2 ? "Balanced" : "Fragile";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Activity className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Resilience and latency simulator</p>
          <p className="text-xs text-slate-600">Tune timeouts, retries, and circuit breakers.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="flex items-center gap-2 font-semibold text-slate-700">
            <Timer className="h-4 w-4" aria-hidden="true" />
            Timeout: {timeout} ms
          </span>
          <input
            type="range"
            min={200}
            max={1200}
            step={50}
            value={timeout}
            onChange={(event) => setTimeoutMs(Number(event.target.value))}
            className="mt-2 w-full accent-slate-700"
          />
        </label>

        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="flex items-center gap-2 font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Retries: {retries}
          </span>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={retries}
            onChange={(event) => setRetries(Number(event.target.value))}
            className="mt-2 w-full accent-slate-700"
          />
        </label>

        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="flex items-center gap-2 font-semibold text-slate-700">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Circuit breaker: {breaker}
          </span>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={breaker}
            onChange={(event) => setBreaker(Number(event.target.value))}
            className="mt-2 w-full accent-slate-700"
          />
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated latency</span>
          <span className="text-sm font-semibold text-slate-900">{latency} ms</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" style={{ width: `${Math.min(latency / 20, 100)}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Resilience label: <span className="font-semibold text-slate-800">{label}</span>. Balance stability and latency.
        </p>
      </div>
    </div>
  );
}
