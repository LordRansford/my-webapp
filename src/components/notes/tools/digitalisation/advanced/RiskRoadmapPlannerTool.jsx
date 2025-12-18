"use client";

import { useMemo, useState } from "react";
import { ShieldAlert, TrendingUp, Route, CheckCircle2 } from "lucide-react";

const METRICS = [
  { id: "adoption", label: "Journey adoption" },
  { id: "quality", label: "Data quality" },
  { id: "uptime", label: "Platform stability" },
  { id: "cost", label: "Cost to serve" },
];

export default function RiskRoadmapPlannerTool() {
  const [selected, setSelected] = useState(["adoption", "quality", "uptime"]);
  const [appetite, setAppetite] = useState(2);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const appetiteLabel = useMemo(() => {
    if (appetite <= 2) return "Conservative";
    if (appetite === 3) return "Balanced";
    return "Bold";
  }, [appetite]);

  const phase = useMemo(() => {
    if (appetite <= 2) return "Phase 1: Stabilise data quality and governance";
    if (appetite === 3) return "Phase 2: Expand platforms and automate reporting";
    return "Phase 3: Scale ecosystem services and advanced analytics";
  }, [appetite]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Risk and roadmap planner</p>
          <p className="text-xs text-slate-600">Pick KPIs and set risk appetite to shape your plan.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">KPIs to watch</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {METRICS.map((metric) => (
              <button
                key={metric.id}
                type="button"
                onClick={() => toggle(metric.id)}
                aria-pressed={selected.includes(metric.id)}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                  selected.includes(metric.id)
                    ? "border-slate-300 bg-white text-slate-900"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Aim for at least three KPIs so you cover adoption, quality, and stability.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk appetite</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Low</span>
            <span>High</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={appetite}
            onChange={(e) => setAppetite(Number(e.target.value))}
            className="mt-2 w-full accent-slate-700"
          />
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              {appetiteLabel}
            </div>
            <p className="mt-2 text-sm text-slate-700">{phase}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <Route className="h-4 w-4" aria-hidden="true" />
            Roadmaps work best when the risk appetite is explicit.
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Suggested focus
        </div>
        <p className="mt-2">Align investment to the selected KPIs and revisit the appetite each quarter.</p>
      </div>
    </div>
  );
}
