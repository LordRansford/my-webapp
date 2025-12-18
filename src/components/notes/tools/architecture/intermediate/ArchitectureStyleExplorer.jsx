"use client";

import { useState } from "react";
import { Blocks, Layers, Network, Cloud } from "lucide-react";

const STYLES = [
  {
    id: "monolith",
    name: "Monolith",
    icon: Blocks,
    summary: "Everything in one deployable unit.",
    strengths: ["Simple ops", "Fast local changes"],
    risks: ["Hard to scale teams", "Tight coupling grows"],
  },
  {
    id: "modular",
    name: "Modular monolith",
    icon: Layers,
    summary: "One deployable unit with clear modules.",
    strengths: ["Strong boundaries", "Single deployment"],
    risks: ["Requires discipline", "Modules can leak"],
  },
  {
    id: "microservices",
    name: "Microservices",
    icon: Network,
    summary: "Multiple services with independent deploys.",
    strengths: ["Team autonomy", "Targeted scaling"],
    risks: ["Operational overhead", "Distributed debugging"],
  },
  {
    id: "serverless",
    name: "Serverless",
    icon: Cloud,
    summary: "Functions run on demand with managed infra.",
    strengths: ["Fast start", "Pay for use"],
    risks: ["Cold starts", "Limited control"],
  },
];

export default function ArchitectureStyleExplorer() {
  const [active, setActive] = useState(STYLES[1]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Blocks className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Architecture style explorer</p>
          <p className="text-xs text-slate-600">Compare styles and see where each one shines.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isActive = active.id === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => setActive(style)}
              aria-pressed={isActive}
              className={`rounded-2xl border p-3 text-left transition ${
                isActive
                  ? "border-sky-200 bg-white shadow-sm ring-1 ring-sky-100"
                  : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-600">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{style.name}</p>
                  <p className="text-xs text-slate-600">{style.summary}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{active.name}</p>
        <p className="mt-1 text-xs text-slate-600">{active.summary}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-semibold text-slate-900">Strengths</p>
            <ul className="mt-2 space-y-1 text-slate-600">
              {active.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-semibold text-slate-900">Risks</p>
            <ul className="mt-2 space-y-1 text-slate-600">
              {active.risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
