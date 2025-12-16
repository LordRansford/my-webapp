"use client";

import { useMemo, useState } from "react";

export default function RiskTradeoffVisualizer() {
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [control, setControl] = useState(2);

  const initialRisk = useMemo(() => likelihood * impact, [likelihood, impact]);
  const residualRisk = useMemo(() => Math.max(0, initialRisk - control), [initialRisk, control]);

  const narrative = useMemo(() => {
    if (residualRisk <= 4) return "Strong controls reduce risk to a more acceptable level, but it does not vanish.";
    if (residualRisk <= 9) return "Risk is reduced but still material. Consider tighter controls or reducing exposure.";
    return "Residual risk is still high. Either likelihood or impact needs to drop, or controls must strengthen.";
  }, [residualRisk]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <h4 className="text-base font-semibold text-slate-900">Adjust likelihood, impact, and control strength</h4>
      <p className="text-sm text-slate-700">All values are synthetic; this is a conceptual view of risk.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Slider label="Likelihood" value={likelihood} setValue={setLikelihood} />
        <Slider label="Impact" value={impact} setValue={setImpact} />
        <Slider label="Control strength" value={control} setValue={setControl} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <RiskBar title="Initial risk" value={initialRisk} max={25} color="bg-rose-400" />
        <RiskBar title="Residual risk" value={residualRisk} max={25} color="bg-amber-400" />
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm">
        {narrative}
      </div>
    </div>
  );
}

function Slider({ label, value, setValue }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-2 w-full accent-sky-500"
      />
      <div className="mt-1 text-xs text-slate-700">0 = low, 5 = high</div>
    </div>
  );
}

function RiskBar({ title, value, max, color }) {
  const width = `${Math.min(100, (value / max) * 100)}%`;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
        <span>{title}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}
