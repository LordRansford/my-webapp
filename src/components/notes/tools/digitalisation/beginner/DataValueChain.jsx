"use client";

import { useState } from "react";
import { Download, Database, Wand2, BarChart3, Rocket, AlertTriangle } from "lucide-react";

const STEPS = [
  {
    key: "collect",
    label: "Collect",
    note: "Capture and validate data at the source.",
    value: "Strong capture rules prevent downstream drift.",
    risk: "Missing fields or weak checks amplify errors.",
    fields: ["source_id", "timestamp", "channel"],
    icon: Download,
  },
  {
    key: "store",
    label: "Store",
    note: "Govern, secure, and track lineage.",
    value: "Clear ownership keeps data reusable.",
    risk: "Unowned data becomes a liability.",
    fields: ["owner", "retention", "classification"],
    icon: Database,
  },
  {
    key: "transform",
    label: "Transform",
    note: "Clean, normalise, and shape data.",
    value: "Well defined transforms preserve meaning.",
    risk: "Hidden assumptions distort reality.",
    fields: ["unit", "precision", "mapping_rule"],
    icon: Wand2,
  },
  {
    key: "analyze",
    label: "Analyse",
    note: "Turn data into insight and signals.",
    value: "Context makes metrics actionable.",
    risk: "Vanity metrics mislead teams.",
    fields: ["metric", "segment", "confidence"],
    icon: BarChart3,
  },
  {
    key: "act",
    label: "Act",
    note: "Use insight to change decisions.",
    value: "Outcomes improve when teams respond fast.",
    risk: "No action means the chain is broken.",
    fields: ["owner", "decision", "outcome"],
    icon: Rocket,
  },
];

export default function DataValueChain() {
  const [selected, setSelected] = useState("collect");
  const [lens, setLens] = useState("value");
  const active = STEPS.find((s) => s.key === selected) || STEPS[0];
  const Icon = active.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Data value chain mapper</p>
          <p className="text-xs text-slate-600">Tap a step to see where value is added and where risk appears.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setLens("value")}
            aria-pressed={lens === "value"}
            className={`rounded-full border px-3 py-1 font-semibold ${
              lens === "value" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            Value lens
          </button>
          <button
            type="button"
            onClick={() => setLens("risk")}
            aria-pressed={lens === "risk"}
            className={`rounded-full border px-3 py-1 font-semibold ${
              lens === "risk" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            Risk lens
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s) => {
          const StepIcon = s.icon;
          const isActive = s.key === selected;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSelected(s.key)}
              aria-pressed={isActive}
              className={`rounded-2xl border p-3 text-left transition ${
                isActive ? "border-slate-300 bg-white shadow-sm" : "border-slate-200 bg-slate-50/70 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <StepIcon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                  <p className="text-xs text-slate-600">{s.note}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Icon className="h-4 w-4 text-slate-600" aria-hidden="true" />
            <span>{active.label} focus</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">{lens === "value" ? active.value : active.risk}</p>
          {lens === "risk" ? (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Small errors here compound quickly.
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Example schema fields</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {active.fields.map((field) => (
              <span key={field} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
