"use client";

import { useMemo, useState } from "react";
import { Gauge, ShieldCheck, Wrench, Activity } from "lucide-react";

const METRICS = [
  { id: "performance", label: "Performance", icon: Gauge, tone: "bg-sky-50 text-sky-700" },
  { id: "reliability", label: "Reliability", icon: Activity, tone: "bg-emerald-50 text-emerald-700" },
  { id: "security", label: "Security", icon: ShieldCheck, tone: "bg-indigo-50 text-indigo-700" },
  { id: "complexity", label: "Complexity", icon: Wrench, tone: "bg-amber-50 text-amber-700" },
];

export default function QualityTradeoffExplorer() {
  const [values, setValues] = useState({
    performance: 60,
    reliability: 70,
    security: 65,
    complexity: 35,
  });

  const update = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const guidance = useMemo(() => {
    if (values.complexity > 70) {
      return "Complexity is high. Simplify before scaling further.";
    }
    if (values.performance < 40) {
      return "Performance is low. Consider caching or async processing.";
    }
    if (values.reliability < 50) {
      return "Reliability is low. Add monitoring and fallback paths.";
    }
    return "Balance looks healthy. Document the trade offs.";
  }, [values]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <Wrench className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Quality trade off explorer</p>
          <p className="text-xs text-slate-600">Adjust priorities and see the balance shift.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <label key={metric.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl ${metric.tone}`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {metric.label}: {values[metric.id]}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={values[metric.id]}
                onChange={(event) => update(metric.id, event.target.value)}
                className="mt-2 w-full accent-slate-700"
              />
            </label>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Guidance</p>
        <p className="mt-2">{guidance}</p>
      </div>
    </div>
  );
}
