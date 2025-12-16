"use client";

import { useMemo, useState } from "react";

export function ResiliencePatternSandbox() {
  const [baseFailureRate, setBaseFailureRate] = useState(5);
  const [retries, setRetries] = useState(2);
  const [timeoutMs, setTimeoutMs] = useState(500);
  const [circuitThreshold, setCircuitThreshold] = useState(50);

  const stats = useMemo(() => {
    const p = baseFailureRate / 100;
    const attempts = retries + 1;
    const userFailureProbability = Math.pow(p, attempts);

    const extraLoadFactor = attempts;
    const likelyCircuitTrip = baseFailureRate >= circuitThreshold ? "High chance of opening" : "Unlikely to open";

    return {
      userFailureProbability,
      extraLoadFactor,
      likelyCircuitTrip,
    };
  }, [baseFailureRate, retries, circuitThreshold]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        This sandbox lets you see how retries, timeouts and circuit breakers interact. It is not a full reliability model. It helps
        you feel how quickly extra retries can create extra load.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="space-y-4">
            <label className="block text-xs text-slate-600">
              Base failure rate of a single call
              <input
                type="range"
                min={1}
                max={60}
                value={baseFailureRate}
                onChange={(e) => setBaseFailureRate(Number(e.target.value) || 1)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                {baseFailureRate}% of calls fail before resilience patterns.
              </span>
            </label>

            <label className="block text-xs text-slate-600">
              Retries
              <input
                type="range"
                min={0}
                max={4}
                value={retries}
                onChange={(e) => setRetries(Number(e.target.value) || 0)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                {retries} retry attempt{retries === 1 ? "" : "s"} after the first call.
              </span>
            </label>

            <label className="block text-xs text-slate-600">
              Timeout per attempt
              <input
                type="range"
                min={200}
                max={3000}
                step={100}
                value={timeoutMs}
                onChange={(e) => setTimeoutMs(Number(e.target.value) || 200)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">{timeoutMs} ms per attempt.</span>
            </label>

            <label className="block text-xs text-slate-600">
              Circuit breaker failure threshold
              <input
                type="range"
                min={10}
                max={80}
                step={5}
                value={circuitThreshold}
                onChange={(e) => setCircuitThreshold(Number(e.target.value) || 10)}
                className="mt-1 w-full"
              />
              <span className="mt-1 inline-block text-xs text-slate-700">
                Circuit opens when failure rate is around {circuitThreshold}% or higher.
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Estimated outcomes</p>
            <p className="text-xs text-slate-700">
              Probability that a user still sees a failure after all retries:{" "}
              <span className="font-semibold">{(stats.userFailureProbability * 100).toFixed(2)}%</span>
            </p>
            <p className="text-xs text-slate-700">
              Relative extra load due to retries: <span className="font-semibold">{stats.extraLoadFactor.toFixed(1)} times</span> the
              original request volume.
            </p>
            <p className="text-xs text-slate-700">
              Circuit breaker behaviour: <span className="font-semibold">{stats.likelyCircuitTrip}</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Total worst case time for one user is roughly {(timeoutMs * (retries + 1)) / 1000} seconds if every attempt hits the
              full timeout.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Discussion prompts</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Is the extra load factor acceptable for the downstream service during an incident.</li>
              <li>Would a shorter timeout with fewer retries give users a faster, clearer failure.</li>
              <li>Are there some operations where you prefer no retries at all, for example payments.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
