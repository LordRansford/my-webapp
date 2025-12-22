"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";

type Dimension = "Accuracy" | "Completeness" | "Timeliness" | "Consistency" | "Uniqueness" | "Validity";

const dimensionCopy: Record<Dimension, { meaning: string; sourceVsDownstream: string }> = {
  Accuracy: { meaning: "Correct values that reflect reality.", sourceVsDownstream: "Fix at source where possible. Downstream correction hides upstream failure." },
  Completeness: { meaning: "Required fields are present for the intended use.", sourceVsDownstream: "Missing values are a product decision, not a cleaning task." },
  Timeliness: { meaning: "Data arrives and is refreshed fast enough for the decision.", sourceVsDownstream: "Late data can be worse than no data if it misleads." },
  Consistency: { meaning: "Same concept means the same thing across systems and time.", sourceVsDownstream: "Consistency requires definitions and stewardship, not just ETL." },
  Uniqueness: { meaning: "No unwanted duplicates for the entity being represented.", sourceVsDownstream: "Duplicate handling needs identity rules and reference data." },
  Validity: { meaning: "Values conform to the allowed formats and ranges.", sourceVsDownstream: "Validation belongs at trust boundaries, not only in analytics." },
};

export default function DataQualityLab() {
  const [dim, setDim] = useState<Dimension>("Completeness");
  const [sourceValidation, setSourceValidation] = useState(2);
  const [downstreamCleaning, setDownstreamCleaning] = useState(2);
  const [monitoring, setMonitoring] = useState(1);
  const [controlOwner, setControlOwner] = useState("Steward");

  const costStory = useMemo(() => {
    const s = sourceValidation;
    const d = downstreamCleaning;
    const m = monitoring;
    if (s <= 1 && d >= 3) return "You are paying a hidden tax: teams clean the same issues repeatedly. Fixing at source will be cheaper over time.";
    if (s >= 3 && m <= 1) return "Strong validation is good, but without monitoring you will miss silent drift and upstream changes.";
    if (s >= 3 && m >= 3) return "Good pattern: validate early and monitor continuously. This supports trust and stable decisions.";
    return "Balance is the goal: validate what you can at source, keep downstream checks for detection, and monitor for drift.";
  }, [sourceValidation, downstreamCleaning, monitoring]);

  const score = useMemo(() => {
    const raw = Math.round(((sourceValidation + monitoring) * 20 + (4 - downstreamCleaning) * 15) / 2);
    return Math.max(0, Math.min(100, raw));
  }, [sourceValidation, downstreamCleaning, monitoring]);

  return (
    <section className="space-y-6" aria-label="Data quality and assurance lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Data quality and assurance</h2>
        </div>
        <p className="text-sm text-slate-700">
          Quality is not aesthetics. It is whether people trust the numbers enough to act. This lab focuses on controls and where to place them.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">1. Choose a quality dimension</p>
            <div className="grid gap-3 md:grid-cols-3">
              {(Object.keys(dimensionCopy) as Dimension[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDim(d)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    dim === d ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{d}</p>
                  <p className="mt-1 text-sm text-slate-700">{dimensionCopy[d].meaning}</p>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Source vs downstream</p>
              <p className="mt-2 text-sm text-slate-700">{dimensionCopy[dim].sourceVsDownstream}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Controls placement</h3>
            </div>
            <p className="text-sm text-slate-700">
              Practice the trade-off: validate at source vs clean downstream. Monitoring is how you detect drift and upstream changes.
            </p>
            {[
              { label: "Validation at source", value: sourceValidation, set: setSourceValidation, options: ["None", "Basic", "Some", "Strong", "Strict"] },
              { label: "Downstream cleaning", value: downstreamCleaning, set: setDownstreamCleaning, options: ["None", "Basic", "Some", "Heavy", "Constant"] },
              { label: "Monitoring and alerts", value: monitoring, set: setMonitoring, options: ["None", "Basic", "Some", "Strong", "Strict"] },
            ].map((i) => (
              <div key={i.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>{i.label}</span>
                  <span>{i.options[i.value]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={i.value} onChange={(e) => i.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Assurance score</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{score}/100</p>
                <p className="text-sm text-slate-700">{costStory}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-900">Ownership</p>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Controls fail when nobody owns them. Pick who owns the rule and who gets paged when it breaks.
                </p>
                <select
                  value={controlOwner}
                  onChange={(e) => setControlOwner(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {["Owner", "Steward", "Custodian", "Product lead"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-600">Selected owner: {controlOwner}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Cost of poor quality</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Wasted staff time in manual reconciliation.</li>
              <li>Wrong decisions that look confident.</li>
              <li>Compliance issues when audit trails are broken.</li>
              <li>Loss of trust so teams create shadow spreadsheets.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Monitoring basics</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Track freshness and volume.</li>
              <li>Track null rates on key fields.</li>
              <li>Track distribution drift for important metrics.</li>
              <li>Alert on failures with clear runbooks.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



