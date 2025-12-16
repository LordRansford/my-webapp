"use client";

import { useMemo, useState } from "react";

export default function DriftMonitorSimulator() {
  const [driftSpeed, setDriftSpeed] = useState(0.02);
  const [monitorStrength, setMonitorStrength] = useState(0.6);

  const timeline = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const drift = 0.1 + driftSpeed * i * 3;
      const detected = monitorStrength > 0.5 && drift > 0.25;
      return { step: i, accuracy: Math.max(0.9 - drift, 0.4), detected };
    });
  }, [driftSpeed, monitorStrength]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <Control label="Drift speed" value={driftSpeed} min={0} max={0.08} step={0.01} onChange={setDriftSpeed} />
        <Control label="Monitoring strength" value={monitorStrength} min={0} max={1} step={0.1} onChange={setMonitorStrength} />
      </div>

      <div className="mt-4 space-y-2">
        {timeline.map((t) => (
          <div key={t.step} className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-8 font-semibold text-slate-900">T{t.step}</span>
            <div className="h-2 flex-1 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${t.accuracy * 100}%` }} />
            </div>
            <span className="w-12 text-right">{Math.round(t.accuracy * 100)}%</span>
            {t.detected && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Alert</span>}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-700">Faster drift + weak monitoring means issues surface late for users.</p>
    </div>
  );
}

function Control({ label, value, min, max, step, onChange }) {
  return (
    <label className="text-sm text-slate-700">
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
      <span className="text-xs text-slate-600">{value.toFixed(2)}</span>
    </label>
  );
}
