"use client";

import React, { useMemo, useState } from "react";
import { Target, ClipboardCheck } from "lucide-react";

const failureModes = [
  { title: "Collect everything", note: "If you cannot explain purpose, you cannot defend risk, cost, or retention." },
  { title: "Dashboards before definitions", note: "Teams argue about what numbers mean. Trust erodes fast." },
  { title: "No owner", note: "When nobody owns the data, nobody fixes it. Quality becomes accidental." },
  { title: "Insight without action", note: "If nobody changes behavior, analytics becomes decoration." },
];

export default function DataStrategyLab() {
  const [outcome, setOutcome] = useState("Reduce missed appointments in a public service.");
  const [opsVsInsight, setOpsVsInsight] = useState<"ops" | "insight" | "both">("both");
  const [dataPurpose, setDataPurpose] = useState("Confirm appointments, track attendance, and understand where the process fails.");
  const [collectionStop, setCollectionStop] = useState("We do not collect free-text notes unless there is a clear care or safety reason.");

  const guidance = useMemo(() => {
    const items: string[] = [];
    items.push("Start with an outcome, not with a database.");
    items.push("Define what decision this data supports and who makes it.");
    if (opsVsInsight === "ops") items.push("Operational data should be fast, reliable, and minimal. Avoid turning it into a research project.");
    if (opsVsInsight === "insight") items.push("Insight data must be explainable and comparable over time. Agree definitions before analysis.");
    if (opsVsInsight === "both") items.push("When one dataset serves operations and insight, be explicit about trade-offs and governance.");
    return items;
  }, [opsVsInsight]);

  return (
    <section className="space-y-6" aria-label="Data strategy and purpose lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-amber-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Data strategy and purpose</h2>
        </div>
        <p className="text-sm text-slate-700">
          This lab teaches the first question: why does this data exist? If you cannot answer that, governance and architecture become guesswork.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">1. Outcome and decision</h3>
            <p className="text-sm text-slate-700">
              Write the outcome in one sentence. Then ask: what decision will change because we have better data?
            </p>
            <input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">2. Operations vs insight</h3>
            <p className="text-sm text-slate-700">
              Operational data keeps the service running. Insight data helps you learn and improve. Mixing them is possible, but it must be intentional.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: "ops", title: "Operations", note: "Fast, minimal, reliable, supports day-to-day work." },
                { id: "insight", title: "Insight", note: "Comparable over time, supports analysis and improvement." },
                { id: "both", title: "Both", note: "Requires clear contracts and governance to avoid conflicts." },
              ].map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setOpsVsInsight(x.id as any)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    opsVsInsight === x.id ? "border-amber-300 bg-amber-50 ring-1 ring-amber-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{x.title}</p>
                  <p className="mt-1 text-sm text-slate-700">{x.note}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">3. Purpose statement</h3>
            <p className="text-sm text-slate-700">
              Write what this data is for, using simple language. If you cannot explain it to a non-technical stakeholder, it is not ready.
            </p>
            <textarea
              value={dataPurpose}
              onChange={(e) => setDataPurpose(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Stop rule</p>
              <p className="mt-1 text-sm text-slate-700">
                Good data strategy includes what you will not collect. This protects privacy, reduces cost, and keeps teams focused.
              </p>
              <textarea
                value={collectionStop}
                onChange={(e) => setCollectionStop(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">Guidance</p>
            </div>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {guidance.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Common organisational failures</p>
            <ul className="space-y-2">
              {failureModes.map((f) => (
                <li key={f.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                  <p className="mt-1 text-sm text-slate-700">{f.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



