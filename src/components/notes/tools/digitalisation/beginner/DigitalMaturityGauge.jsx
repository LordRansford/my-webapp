"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, Users, ClipboardCheck, Clock } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    label: "Initial",
    focus: "Visibility and ownership",
    next: "Name data owners and agree the first shared metric.",
    risks: ["Hidden data flows", "Unclear accountability"],
    signals: { ownership: "low", controls: "low", evidence: "low", cadence: "low" },
  },
  {
    level: 2,
    label: "Early",
    focus: "Foundation and consistency",
    next: "Standardise a core dataset and publish basic usage rules.",
    risks: ["Inconsistent definitions", "Manual approvals"],
    signals: { ownership: "medium", controls: "low", evidence: "low", cadence: "medium" },
  },
  {
    level: 3,
    label: "Developing",
    focus: "Shared platforms and controls",
    next: "Add lightweight governance forums and shared dashboards.",
    risks: ["Platform sprawl", "Slow decisions"],
    signals: { ownership: "medium", controls: "medium", evidence: "medium", cadence: "medium" },
  },
  {
    level: 4,
    label: "Established",
    focus: "Scale with trust",
    next: "Automate policy checks and tighten data quality gates.",
    risks: ["Complacency", "Tool overload"],
    signals: { ownership: "high", controls: "medium", evidence: "high", cadence: "high" },
  },
  {
    level: 5,
    label: "Leading",
    focus: "Adaptive governance",
    next: "Use evidence to iterate governance and remove friction.",
    risks: ["Over governance", "Innovation drag"],
    signals: { ownership: "high", controls: "high", evidence: "high", cadence: "high" },
  },
];

const SIGNALS = [
  { key: "ownership", label: "Ownership", icon: Users },
  { key: "controls", label: "Controls", icon: ShieldCheck },
  { key: "evidence", label: "Evidence", icon: ClipboardCheck },
  { key: "cadence", label: "Cadence", icon: Clock },
];

const signalStyle = (state) => {
  if (state === "high") return "bg-emerald-50 text-emerald-800";
  if (state === "medium") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-600";
};

export default function DigitalMaturityGauge() {
  const [level, setLevel] = useState(2);

  const active = useMemo(() => LEVELS.find((l) => l.level === level) || LEVELS[1], [level]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Governance readiness check</p>
          <p className="text-xs text-slate-600">Choose a level to see focus areas and likely risks.</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          Level {active.level} - {active.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.level}
            type="button"
            onClick={() => setLevel(l.level)}
            aria-pressed={l.level === level}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              l.level === level ? "border-slate-300 bg-white shadow-sm text-slate-900" : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {l.level}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Focus</p>
          <p className="mt-2 text-sm text-slate-800">{active.focus}</p>
          <p className="mt-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Next step</p>
          <p className="mt-1 text-sm text-slate-700">{active.next}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Key risks</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {active.risks.map((risk) => (
              <li key={risk} className="rounded-xl bg-slate-50 px-3 py-2">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {SIGNALS.map((signal) => {
          const Icon = signal.icon;
          return (
            <div key={signal.key} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {signal.label}
              </div>
              <span
                className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${signalStyle(active.signals[signal.key])}`}
              >
                {active.signals[signal.key] === "high"
                  ? "Strong"
                  : active.signals[signal.key] === "medium"
                  ? "Improving"
                  : "Needs work"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
