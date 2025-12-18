"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, Sparkles, Activity, Lock } from "lucide-react";

const CONTROLS = [
  { id: "tests", label: "Automated tests", hint: "Unit and integration checks", tone: "bg-emerald-50 text-emerald-700" },
  { id: "security", label: "Security scan", hint: "Secrets and dependency checks", tone: "bg-sky-50 text-sky-700" },
  { id: "approval", label: "Approval gate", hint: "Peer review and sign off", tone: "bg-amber-50 text-amber-700" },
  { id: "monitoring", label: "Monitoring on deploy", hint: "Logs, metrics, alerts", tone: "bg-indigo-50 text-indigo-700" },
  { id: "rollback", label: "Rollback plan", hint: "Fast revert path", tone: "bg-rose-50 text-rose-700" },
];

export default function DeploySafetySandbox() {
  const [active, setActive] = useState({
    tests: true,
    security: true,
    approval: false,
    monitoring: true,
    rollback: false,
  });

  const score = useMemo(() => {
    return Object.values(active).filter(Boolean).length;
  }, [active]);

  const riskLabel = useMemo(() => {
    if (score >= 4) return { label: "Low risk", tone: "bg-emerald-50 text-emerald-700" };
    if (score === 3) return { label: "Balanced", tone: "bg-amber-50 text-amber-700" };
    return { label: "High risk", tone: "bg-rose-50 text-rose-700" };
  }, [score]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Deployment and safety sandbox</p>
          <p className="text-xs text-slate-600">Toggle controls and see delivery risk shift.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {CONTROLS.map((control) => (
          <button
            key={control.id}
            type="button"
            onClick={() => setActive((prev) => ({ ...prev, [control.id]: !prev[control.id] }))}
            aria-pressed={active[control.id]}
            className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${
              active[control.id]
                ? `${control.tone} border-transparent`
                : "border-slate-200 bg-slate-50/70 text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{control.label}</span>
              <span className="text-[10px] uppercase">{active[control.id] ? "On" : "Off"}</span>
            </div>
            <p className="mt-1 text-[11px] font-normal">{control.hint}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {score} of {CONTROLS.length} controls
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${riskLabel.tone}`}>
            <Activity className="h-3 w-3" aria-hidden="true" />
            {riskLabel.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Security in the pipeline
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Aim for at least three controls. If you skip monitoring and rollback, you are blind when things go wrong.
        </p>
      </div>
    </div>
  );
}
