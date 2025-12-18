"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ScanLine, Workflow, Sparkles, Users, Settings2, Wrench } from "lucide-react";

const SCENARIOS = {
  "digitisation-vs-digitalisation": [
    {
      id: "scan",
      title: "Scan forms",
      type: "Digitisation",
      impact: "Low",
      adoption: "Low",
      effort: "Low",
      note: "You still have the old process plus scanning overhead.",
      icon: ScanLine,
      tone: "border-slate-200 bg-slate-50 text-slate-700",
    },
    {
      id: "online-flow",
      title: "Online workflow",
      type: "Digitalisation",
      impact: "Medium",
      adoption: "Medium",
      effort: "Medium",
      note: "Process is redesigned and tracked automatically.",
      icon: Workflow,
      tone: "border-sky-200 bg-sky-50 text-sky-700",
    },
    {
      id: "new-service",
      title: "New digital service",
      type: "Digital transformation",
      impact: "High",
      adoption: "Medium",
      effort: "High",
      note: "Service and operating model change together.",
      icon: Sparkles,
      tone: "border-amber-200 bg-amber-50 text-amber-700",
    },
  ],
  culture: [
    {
      id: "train",
      title: "Train teams",
      type: "People",
      impact: "High",
      adoption: "High",
      effort: "Medium",
      note: "Trust and capability improve with steady support.",
      icon: Users,
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      id: "simplify",
      title: "Simplify process",
      type: "Process",
      impact: "Medium",
      adoption: "High",
      effort: "Low",
      note: "Less friction makes change stick faster.",
      icon: Settings2,
      tone: "border-indigo-200 bg-indigo-50 text-indigo-700",
    },
    {
      id: "tool-only",
      title: "Add tool only",
      type: "Technology",
      impact: "Low",
      adoption: "Low",
      effort: "Low",
      note: "Adoption stalls when tools arrive without process change.",
      icon: Wrench,
      tone: "border-rose-200 bg-rose-50 text-rose-700",
    },
  ],
};

const scoreTone = (value) => {
  if (value === "High") return "bg-emerald-100 text-emerald-800";
  if (value === "Medium") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-700";
};

export default function ChangeImpactSimulator({ mode = "digitisation-vs-digitalisation" }) {
  const options = SCENARIOS[mode] || [];
  const [pickedId, setPickedId] = useState(options[1]?.id || options[0]?.id);
  const picked = options.find((o) => o.id === pickedId) || options[0];

  const summary = useMemo(() => {
    if (!picked) return "Pick an option to see the impact.";
    return `${picked.type}: ${picked.note}`;
  }, [picked]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Change impact simulator</p>
          <p className="text-xs text-slate-600">Compare choices and see how impact and adoption differ.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {options.map((o) => {
          const Icon = o.icon;
          const isActive = picked?.id === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setPickedId(o.id)}
              aria-pressed={isActive}
              className={`rounded-2xl border p-3 text-left transition ${
                isActive ? "border-slate-300 bg-white shadow-sm" : "border-slate-200 bg-slate-50/70 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${o.tone}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{o.title}</p>
                  <p className="text-xs text-slate-600">{o.type}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600">{o.note}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">What this shows</p>
          <p className="mt-1">{summary}</p>
          <p className="mt-2 text-xs text-slate-600">Culture and process change are usually the hardest parts.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Signals</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-2 py-1 font-semibold ${scoreTone(picked?.impact)}`}>
              Impact: {picked?.impact}
            </span>
            <span className={`rounded-full px-2 py-1 font-semibold ${scoreTone(picked?.adoption)}`}>
              Adoption: {picked?.adoption}
            </span>
            <span className={`rounded-full px-2 py-1 font-semibold ${scoreTone(picked?.effort)}`}>
              Effort: {picked?.effort}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
