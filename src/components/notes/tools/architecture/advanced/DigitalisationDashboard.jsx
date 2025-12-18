"use client";

import { useMemo, useState } from "react";
import { Gauge, Timer, ShieldCheck, RotateCcw, DollarSign } from "lucide-react";

const METRICS = [
  { key: "deploy", name: "Deployment frequency", hint: "Higher suggests flow is healthy.", category: "speed", icon: Gauge },
  { key: "lead", name: "Lead time for change", hint: "Lower suggests friction is low.", category: "speed", icon: Timer },
  { key: "fail", name: "Change failure rate", hint: "Lower suggests quality and safety.", category: "quality", icon: ShieldCheck },
  { key: "recover", name: "Time to restore", hint: "Lower suggests resilience.", category: "resilience", icon: RotateCcw },
  { key: "cost", name: "Operational cost trend", hint: "Flat or down suggests sustainability.", category: "cost", icon: DollarSign },
];

const CATEGORIES = [
  { key: "speed", label: "Speed", tone: "bg-sky-50 text-sky-700" },
  { key: "quality", label: "Quality", tone: "bg-emerald-50 text-emerald-700" },
  { key: "resilience", label: "Resilience", tone: "bg-amber-50 text-amber-700" },
  { key: "cost", label: "Cost", tone: "bg-slate-100 text-slate-700" },
];

export default function DigitalisationDashboard() {
  const [selection, setSelection] = useState(["deploy", "lead", "fail"]);

  const coverage = useMemo(() => {
    const covered = new Set(METRICS.filter((m) => selection.includes(m.key)).map((m) => m.category));
    return CATEGORIES.map((c) => ({ ...c, active: covered.has(c.key) }));
  }, [selection]);

  const summary = useMemo(() => {
    const hasBalance = selection.includes("deploy") && selection.includes("fail") && selection.includes("recover");
    if (hasBalance) return "You are watching flow, quality, and resilience together. This is a balanced lens.";
    if (selection.length <= 2) return "Add more signals to avoid single metric tunnel vision.";
    return "Good start. Add a resilience signal so risk does not hide.";
  }, [selection]);

  const toggle = (key) => {
    setSelection((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Journey dashboard lab</p>
          <p className="text-xs text-slate-600">Pick signals that prove the journey is improving.</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {selection.length} selected
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-2 sm:grid-cols-2">
          {METRICS.map((m) => {
            const Icon = m.icon;
            const isActive = selection.includes(m.key);
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => toggle(m.key)}
                aria-pressed={isActive}
                className={`rounded-2xl border p-3 text-left transition ${
                  isActive ? "border-slate-300 bg-white shadow-sm" : "border-slate-200 bg-slate-50/70 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-600">{m.hint}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Coverage</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {coverage.map((c) => (
                <span
                  key={c.key}
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${c.active ? c.tone : "bg-slate-100 text-slate-500"}`}
                >
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Reflection</p>
            <p className="mt-2 text-sm text-slate-700">{summary}</p>
            <p className="mt-2 text-xs text-slate-600">
              Watching only speed hides quality risk. Watching only quality hides delivery friction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
