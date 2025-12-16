"use client";

import { useMemo, useState } from "react";

const initialHops = [
  { id: 1, name: "Browser and network", latencyMs: 80, reliability: 99.0 },
  { id: 2, name: "API gateway", latencyMs: 20, reliability: 99.5 },
  { id: 3, name: "Service", latencyMs: 40, reliability: 99.0 },
  { id: 4, name: "Database", latencyMs: 30, reliability: 99.5 },
];

export function RequestJourneyExplorer() {
  const [hops, setHops] = useState(initialHops);

  function updateHop(id, patch) {
    setHops((current) => current.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }

  const totals = useMemo(() => {
    const totalLatency = hops.reduce((sum, h) => sum + h.latencyMs, 0);
    const combinedReliability = hops.reduce((acc, h) => acc * (h.reliability / 100), 1);
    return {
      totalLatency,
      combinedReliability,
    };
  }, [hops]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Every request is a small journey. This tool helps you see where time and risk sit in that
        journey. You can tweak each hop and notice how the overall experience responds.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Request hops
          </p>
          <div className="space-y-3">
            {hops.map((hop) => (
              <div key={hop.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                <p className="mb-2 text-sm font-semibold text-slate-800">{hop.name}</p>
                <label className="mb-2 block text-xs text-slate-600">
                  Latency (milliseconds)
                  <input
                    type="range"
                    min={0}
                    max={400}
                    value={hop.latencyMs}
                    onChange={(e) => updateHop(hop.id, { latencyMs: Number(e.target.value) || 0 })}
                    className="mt-1 w-full"
                  />
                  <span className="mt-1 inline-block text-xs text-slate-700">{hop.latencyMs} ms</span>
                </label>

                <label className="block text-xs text-slate-600">
                  Reliability (percentage of requests that succeed at this hop)
                  <input
                    type="range"
                    min={90}
                    max={100}
                    value={hop.reliability}
                    onChange={(e) => updateHop(hop.id, { reliability: Number(e.target.value) || 0 })}
                    className="mt-1 w-full"
                  />
                  <span className="mt-1 inline-block text-xs text-slate-700">
                    {hop.reliability.toFixed(2)}%
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Journey summary
            </p>
            <p className="text-sm text-slate-800">
              Total latency: <span className="font-semibold">{totals.totalLatency.toFixed(0)} ms</span>
            </p>
            <p className="text-sm text-slate-800">
              Combined reliability:{" "}
              <span className="font-semibold">{(totals.combinedReliability * 100).toFixed(3)}%</span>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Combined reliability is the product of the reliability of each hop. Even strong values can drop when many hops are
              chained together.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Exercises</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Halve database latency and see how that compares with shaving a few milliseconds from the gateway.</li>
              <li>Reduce reliability at one hop and watch how quickly the end-to-end percentage falls.</li>
              <li>Add an extra hop in your head, such as a fraud check, and think about where it is safest to place it.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
