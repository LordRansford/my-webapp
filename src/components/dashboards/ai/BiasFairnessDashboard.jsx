"use client";

import { useMemo, useState } from "react";

export default function BiasFairnessDashboard() {
  const [groupA, setGroupA] = useState({ base: 0.4, tpr: 0.8, fpr: 0.1 });
  const [groupB, setGroupB] = useState({ base: 0.6, tpr: 0.7, fpr: 0.2 });

  const metrics = useMemo(() => {
    const rate = (g) => ({
      positiveRate: g.base * g.tpr + (1 - g.base) * g.fpr,
      tpr: g.tpr,
    });
    const a = rate(groupA);
    const b = rate(groupB);
    return {
      parityGap: (a.positiveRate - b.positiveRate).toFixed(2),
      eoGap: (a.tpr - b.tpr).toFixed(2),
    };
  }, [groupA, groupB]);

  const slider = (label, value, onChange, step = 0.05) => (
    <label className="block text-xs text-slate-700">
      <span className="font-semibold text-slate-900">{label}</span>
      <input
        type="range"
        min="0"
        max="1"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-blue-600"
      />
      <span className="text-[11px] text-slate-600">{value.toFixed(2)}</span>
    </label>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Group A</p>
          {slider("Base rate", groupA.base, (v) => setGroupA((p) => ({ ...p, base: v })))}
          {slider("True positive rate", groupA.tpr, (v) => setGroupA((p) => ({ ...p, tpr: v })))}
          {slider("False positive rate", groupA.fpr, (v) => setGroupA((p) => ({ ...p, fpr: v })))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Group B</p>
          {slider("Base rate", groupB.base, (v) => setGroupB((p) => ({ ...p, base: v })))}
          {slider("True positive rate", groupB.tpr, (v) => setGroupB((p) => ({ ...p, tpr: v })))}
          {slider("False positive rate", groupB.fpr, (v) => setGroupB((p) => ({ ...p, fpr: v })))}
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          <p className="font-semibold text-slate-900">Demographic parity difference</p>
          <p>{metrics.parityGap}</p>
          <p className="text-xs text-slate-700">Closer to 0 means similar positive rates.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          <p className="font-semibold text-slate-900">Equal opportunity difference</p>
          <p>{metrics.eoGap}</p>
          <p className="text-xs text-slate-700">Closer to 0 means similar true positive rates.</p>
        </div>
      </div>
    </div>
  );
}
