"use client";

import React, { useMemo, useState } from "react";
import { BarChart3, Eye, TriangleAlert } from "lucide-react";

type Level = "Descriptive" | "Diagnostic" | "Predictive";

const pitfalls = [
  { title: "Proxy metrics", note: "You measure something easy, then mistake it for the outcome." },
  { title: "Vanity dashboards", note: "Pretty charts with no decision owner and no action." },
  { title: "No denominator", note: "Counts without context hide the real rate." },
  { title: "Moving definitions", note: "If KPI definitions change silently, trend lines become fiction." },
];

export default function AnalyticsInsightLab() {
  const [level, setLevel] = useState<Level>("Descriptive");
  const [kpiName, setKpiName] = useState("Missed appointment rate");
  const [numerator, setNumerator] = useState("Missed appointments");
  const [denominator, setDenominator] = useState("Total scheduled appointments");
  const [decisionOwner, setDecisionOwner] = useState("Operations lead");
  const [cadence, setCadence] = useState("Weekly");
  const [failureCase, setFailureCase] = useState("If the KPI worsens, we investigate booking reminders and clinic capacity.");

  const interpretation = useMemo(() => {
    if (level === "Descriptive") return "Descriptive analytics tells you what happened. It is the starting point, not the conclusion.";
    if (level === "Diagnostic") return "Diagnostic analytics asks why. It needs segmentation, context, and healthy skepticism.";
    return "Predictive analytics estimates what may happen next. It needs careful validation and clear limits.";
  }, [level]);

  const kpiCard = useMemo(() => {
    return `${kpiName} = ${numerator} / ${denominator}. Decision owner: ${decisionOwner}. Cadence: ${cadence}.`;
  }, [kpiName, numerator, denominator, decisionOwner, cadence]);

  return (
    <section className="space-y-6" aria-label="Analytics and insight lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Analytics and insight</h2>
        </div>
        <p className="text-sm text-slate-700">
          This lab focuses on reasoning, not tooling. The goal is to design KPIs that people can act on without fooling themselves.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Types of analytics</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["Descriptive", "Diagnostic", "Predictive"] as Level[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    level === l ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{l}</p>
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-700">{interpretation}</p>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">2. KPI design</h3>
            <p className="text-sm text-slate-700">
              Good KPIs have a denominator, a decision owner, and a clear action when they move.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">KPI name</span>
                <input value={kpiName} onChange={(e) => setKpiName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Decision owner</span>
                <input value={decisionOwner} onChange={(e) => setDecisionOwner(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Numerator</span>
                <input value={numerator} onChange={(e) => setNumerator(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Denominator</span>
                <input value={denominator} onChange={(e) => setDenominator(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Cadence</span>
                <select value={cadence} onChange={(e) => setCadence(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                  {["Daily", "Weekly", "Monthly", "Quarterly"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold text-slate-700">What happens if it moves</span>
                <textarea value={failureCase} onChange={(e) => setFailureCase(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Your KPI contract</p>
              <p className="mt-2 text-sm text-slate-700">{kpiCard}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">Dashboard pitfalls</p>
            </div>
            <ul className="space-y-2">
              {pitfalls.map((p) => (
                <li key={p.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-1 text-sm text-slate-700">{p.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Misleading metrics checklist</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Is the denominator clear?</li>
              <li>Can the KPI be gamed?</li>
              <li>Is it stable over time, or does it change meaning?</li>
              <li>Do we have confidence intervals or at least sample sizes?</li>
              <li>Is there a named decision owner?</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



