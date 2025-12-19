"use client";

import { useMemo, useState } from "react";

export default function ReplicationConsistencyVisualizerTool() {
  const [mode, setMode] = useState("balanced");
  const [delay, setDelay] = useState(200);

  const summary = useMemo(() => {
    if (mode === "strong") {
      return "Strong consistency: reads wait for all replicas. High confidence, slower responses.";
    }
    if (mode === "fast") {
      return "Fast availability: respond quickly, accept temporary mismatches.";
    }
    return "Balanced: prefer quick responses but confirm important writes before serving.";
  }, [mode]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Adjust replication settings to see how consistency and availability trade off. Lower delay means faster sync but higher cost.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Mode</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { id: "strong", label: "Strong" },
              { id: "balanced", label: "Balanced" },
              { id: "fast", label: "Fast" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMode(option.id)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none focus:ring ${
                  mode === option.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 focus:ring-emerald-200"
                    : "border-slate-200 bg-white text-slate-800 focus:ring-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-600">{summary}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Replication delay (ms)</p>
          <input
            type="range"
            min="50"
            max="800"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="mt-2 w-full accent-indigo-500"
          />
          <p className="mt-1 text-xs text-slate-600">Current delay: {delay} ms</p>
          <p className="mt-1 text-xs text-slate-600">
            Higher delay risks stale reads. Lower delay uses more resources but keeps replicas aligned.
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">What to remember</p>
        <p className="mt-1">
          Distributed systems pick trade offs. You cannot have instant responses, perfect consistency, and infinite uptime all at once. Choose what the user needs most.
        </p>
      </div>
    </div>
  );
}
