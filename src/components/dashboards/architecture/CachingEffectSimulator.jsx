"use client";

import { useMemo, useState } from "react";

export function CachingEffectSimulator() {
  const [hitRate, setHitRate] = useState(60);
  const [backendLatency, setBackendLatency] = useState(200);
  const [cacheLatency, setCacheLatency] = useState(20);
  const [requestsPerSecond, setRequestsPerSecond] = useState(300);

  const stats = useMemo(() => {
    const hit = hitRate / 100;
    const miss = 1 - hit;

    const effectiveLatency = hit * cacheLatency + miss * backendLatency;
    const backendRequests = requestsPerSecond * miss;

    return {
      effectiveLatency,
      backendRequests,
    };
  }, [hitRate, backendLatency, cacheLatency, requestsPerSecond]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        This simulator helps you see why caches matter. Adjust the hit rate and latencies to get a feel for how much load is taken
        off the backend and how user experience changes.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="space-y-4">
            <label className="block text-xs text-slate-600">
              Cache hit rate
              <input
                type="range"
                min={0}
                max={100}
                value={hitRate}
                onChange={(e) => setHitRate(Number(e.target.value) || 0)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">{hitRate}% of requests are served from cache.</span>
            </label>

            <label className="block text-xs text-slate-600">
              Backend latency
              <input
                type="range"
                min={50}
                max={800}
                step={10}
                value={backendLatency}
                onChange={(e) => setBackendLatency(Number(e.target.value) || 50)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">Backend takes about {backendLatency} ms.</span>
            </label>

            <label className="block text-xs text-slate-600">
              Cache latency
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={cacheLatency}
                onChange={(e) => setCacheLatency(Number(e.target.value) || 5)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">Cache responds in about {cacheLatency} ms.</span>
            </label>

            <label className="block text-xs text-slate-600">
              Total incoming requests per second
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={requestsPerSecond}
                onChange={(e) => setRequestsPerSecond(Number(e.target.value) || 50)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">{requestsPerSecond} requests per second.</span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Results</p>
            <p className="text-xs text-slate-700">
              Effective average latency: <span className="font-semibold">{stats.effectiveLatency.toFixed(1)} ms per request</span>
            </p>
            <p className="text-xs text-slate-700">
              Requests that still reach the backend each second:{" "}
              <span className="font-semibold">{stats.backendRequests.toFixed(0)} requests per second</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              A higher hit rate reduces both latency and backend pressure. At very low hit rates caches mostly add complexity without
              much benefit.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Things to explore</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Set hit rate to zero to see the uncached baseline.</li>
              <li>Try a very slow backend and notice how cache latency dominates experience.</li>
              <li>Consider what monitoring you would put in place for hit rate and backend request volume.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
