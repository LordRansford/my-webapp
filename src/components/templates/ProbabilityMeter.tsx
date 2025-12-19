import React from "react";

type ProbabilityMeterProps = {
  label: string;
  value: number;
  subtitle?: string;
};

const gradientStops = [
  { threshold: 25, color: "from-emerald-400 via-emerald-500 to-emerald-600" },
  { threshold: 50, color: "from-sky-400 via-sky-500 to-sky-600" },
  { threshold: 75, color: "from-amber-400 via-amber-500 to-amber-600" },
  { threshold: 100, color: "from-rose-400 via-rose-500 to-rose-600" },
];

export function ProbabilityMeter({ label, value, subtitle }: ProbabilityMeterProps) {
  const normalized = Math.min(Math.max(value, 0), 100);
  const stop = gradientStops.find((s) => normalized <= s.threshold) || gradientStops[gradientStops.length - 1];

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          {subtitle && <p className="text-xs text-slate-600">{subtitle}</p>}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-900">{normalized}%</p>
          <p className="text-[11px] text-slate-500">on this scenario</p>
        </div>
      </div>
      <div className="relative h-3 w-full rounded-full bg-slate-100" role="presentation" aria-hidden="true">
        <div
          className={`absolute inset-y-0 rounded-full bg-gradient-to-r ${stop.color}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-medium text-slate-500">
        <span>Unlikely</span>
        <span>Likely</span>
      </div>
    </div>
  );
}

export default ProbabilityMeter;
