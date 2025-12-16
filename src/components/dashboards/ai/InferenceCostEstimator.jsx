"use client";

import { useMemo, useState } from "react";

export default function InferenceCostEstimator() {
  const [modelSize, setModelSize] = useState(7); // billions params
  const [promptTokens, setPromptTokens] = useState(400);
  const [rps, setRps] = useState(2);

  const estimates = useMemo(() => {
    const tokensPerReq = promptTokens + 200; // include output tokens
    const tokensPerSec = tokensPerReq * rps;
    const costPerM = 0.0008 * modelSize; // synthetic cost
    const dailyCost = ((tokensPerSec * 3600 * 24) / 1_000_000) * costPerM;
    const latency = Math.max(0.2, modelSize * 0.03 + promptTokens / 1000);
    return {
      tokensPerSec: tokensPerSec.toFixed(0),
      dailyCost: dailyCost.toFixed(2),
      latency: latency.toFixed(2),
    };
  }, [modelSize, promptTokens, rps]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3 text-sm text-slate-700">
        <Control label="Model size (B params)" value={modelSize} min={1} max={70} step={1} onChange={setModelSize} />
        <Control label="Prompt tokens" value={promptTokens} min={50} max={2000} step={50} onChange={setPromptTokens} />
        <Control label="Requests per second" value={rps} min={1} max={20} step={1} onChange={setRps} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Stat label="Tokens / sec" value={estimates.tokensPerSec} />
        <Stat label="Est. daily cost ($)" value={estimates.dailyCost} />
        <Stat label="Latency (s, rough)" value={estimates.latency} />
      </div>
      <p className="mt-2 text-xs text-slate-700">Synthetic numbers to reason about scale, not tied to any provider.</p>
    </div>
  );
}

function Control({ label, value, min, max, step, onChange }) {
  return (
    <label className="block text-sm text-slate-700">
      <span className="font-semibold text-slate-900">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-blue-600"
      />
      <span className="text-xs text-slate-600">{value}</span>
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
