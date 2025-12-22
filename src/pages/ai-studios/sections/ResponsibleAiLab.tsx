"use client";

import React, { useMemo, useState } from "react";
import { ShieldCheck, Eye, FileCheck2, AlertTriangle } from "lucide-react";

type UseCase = "Low risk assist" | "Moderate risk workflow" | "High impact decision";

export default function ResponsibleAiLab() {
  const [useCase, setUseCase] = useState<UseCase>("Moderate risk workflow");
  const [transparency, setTransparency] = useState(true);
  const [accountability, setAccountability] = useState(true);
  const [safetyControls, setSafetyControls] = useState(true);
  const [inappropriateUse, setInappropriateUse] = useState(false);

  const checklist = useMemo(() => {
    const items: Array<{ title: string; ok: boolean; note: string }> = [];
    items.push({ title: "Transparency", ok: transparency, note: "Users understand when AI is used and what it can fail at." });
    items.push({ title: "Accountability", ok: accountability, note: "A named owner exists for outcomes, monitoring, and incidents." });
    items.push({ title: "Safety controls", ok: safetyControls, note: "Guardrails, escalation paths, and monitoring exist." });
    items.push({ title: "Appropriate use case", ok: !inappropriateUse, note: "The task is suitable for AI and failure costs are understood." });
    return items;
  }, [transparency, accountability, safetyControls, inappropriateUse]);

  const guidance = useMemo(() => {
    if (useCase === "Low risk assist") {
      return [
        "Good fit: drafting, summarising, brainstorming, and navigation help.",
        "Controls: disclaimers, privacy boundaries, and light review.",
        "Avoid: pretending it is a source of truth.",
      ];
    }
    if (useCase === "Moderate risk workflow") {
      return [
        "Good fit: triage, classification, routing, and decision support with oversight.",
        "Controls: monitoring, evaluation, escalation, and audit logs.",
        "Avoid: fully automated actions without an error budget and recovery plan.",
      ];
    }
    return [
      "High impact: hiring, credit, benefits, medical decisions, safety-critical controls.",
      "Controls: strong oversight, clear appeals, rigorous evaluation, and strict data governance.",
      "Default stance: do not deploy unless you can prove safety and fairness in context.",
    ];
  }, [useCase]);

  return (
    <section className="space-y-6" aria-label="Responsible AI lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Responsible AI</h2>
        </div>
        <p className="text-sm text-slate-700">
          Responsible AI is about governance and outcomes: transparency, accountability, safety, and appropriate use. This is not compliance theatre.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Choose a use case risk level</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Low risk assist", "Moderate risk workflow", "High impact decision"] as UseCase[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUseCase(u)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    useCase === u ? "border-indigo-300 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Guidance</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {guidance.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Responsible AI checklist</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-800">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={transparency} onChange={(e) => setTransparency(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Transparency: users know AI is used and what it can fail at
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={accountability} onChange={(e) => setAccountability(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Accountability: a named owner exists for outcomes and incidents
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={safetyControls} onChange={(e) => setSafetyControls(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Safety: guardrails, escalation, monitoring, and audits exist
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={inappropriateUse} onChange={(e) => setInappropriateUse(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-200" />
                This is an inappropriate use case (too high impact or too unclear)
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Status</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {checklist.map((c) => (
                  <li key={c.title} className="flex items-start gap-2">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${c.ok ? "bg-emerald-500" : "bg-rose-500"}`} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-slate-900">{c.title}</div>
                      <div>{c.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">Appropriate use matters</p>
            </div>
            <p className="text-sm text-slate-700">
              Many failures come from using AI on the wrong task. If you cannot define correct outcomes, you cannot evaluate or govern the system.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



