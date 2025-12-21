"use client";

import { useMemo, useState } from "react";
import { Radar, Activity, Cloud, AlertTriangle } from "lucide-react";

export default function ServingMonitorSimulatorTool() {
  const [requestRate, setRequestRate] = useState(80);
  const [mode, setMode] = useState("online");
  const [drift, setDrift] = useState(false);

  const metrics = useMemo(() => {
    const baseLatency = mode === "online" ? 120 : 600;
    const latency = Math.round(baseLatency + requestRate * 0.8 + (drift ? 30 : 0));
    const throughput = Math.round(mode === "online" ? requestRate * 0.95 : requestRate * 0.6);
    const errorRate = Math.min(12, Math.round(1 + (requestRate > 140 ? 3 : 0) + (drift ? 2 : 0)));
    return { latency, throughput, errorRate };
  }, [requestRate, mode, drift]);

  const status = useMemo(() => {
    if (metrics.errorRate > 6 || metrics.latency > 600) return "Risky";
    if (metrics.errorRate > 3 || metrics.latency > 350) return "Watch";
    return "Healthy";
  }, [metrics]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <Radar className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Serving and monitoring simulator</p>
          <p className="text-xs text-slate-600">Adjust traffic and see how the service behaves.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-600">Request rate</span>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="range"
              min={20}
              max={200}
              value={requestRate}
              onChange={(event) => setRequestRate(Number(event.target.value))}
              className="w-full accent-slate-900"
            />
            <span className="text-sm text-slate-600">{requestRate} rpm</span>
          </div>
        </label>

        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-600">Serving mode</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs"
          >
            <option value="online">Online inference</option>
            <option value="batch">Batch inference</option>
          </select>
          <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={drift}
              onChange={(event) => setDrift(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            Simulate drift signal
          </label>
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Latency
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{metrics.latency} ms</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
            Throughput
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{metrics.throughput} rpm</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Error rate
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{metrics.errorRate}%</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
        <p className="mt-2">
          {status === "Healthy" && "Healthy. Keep logging inputs and outputs for drift checks."}
          {status === "Watch" && "Watch. Add alerts and test a rollback plan."}
          {status === "Risky" && "Risky. Reduce load or add safeguards before this hits production."}
        </p>
      </div>
    </div>
  );
}
