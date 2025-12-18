"use client";

import { useMemo, useState } from "react";
import { Gauge, Shield, Wallet } from "lucide-react";

export default function TradeoffSliderTool() {
  const [balance, setBalance] = useState(55);

  const metrics = useMemo(() => {
    const speed = Math.max(0, 100 - balance);
    const safety = balance;
    const cost = Math.round(40 + Math.abs(balance - 50) * 0.6);
    return { speed, safety, cost };
  }, [balance]);

  const guidance = useMemo(() => {
    if (balance < 35) return "Fast and cheap, but fragile. Add guardrails before scaling.";
    if (balance > 75) return "Safe and stable, but slower. Watch time to market.";
    return "Balanced. Document the trade offs and keep monitoring.";
  }, [balance]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <Gauge className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Trade off slider</p>
          <p className="text-xs text-slate-600">Balance speed, safety, and cost.</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-600" htmlFor="tradeoff-slider">
          Shift toward safety
        </label>
        <input
          id="tradeoff-slider"
          type="range"
          min={0}
          max={100}
          value={balance}
          onChange={(event) => setBalance(Number(event.target.value))}
          className="mt-2 w-full accent-slate-900"
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            Speed
          </p>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-sky-400" style={{ width: `${metrics.speed}%` }} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            Safety
          </p>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${metrics.safety}%` }} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
            Cost
          </p>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-amber-400" style={{ width: `${metrics.cost}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Guidance</p>
        <p className="mt-2">{guidance}</p>
      </div>
    </div>
  );
}
