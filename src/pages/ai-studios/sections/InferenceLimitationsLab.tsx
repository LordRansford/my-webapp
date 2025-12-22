"use client";

import React, { useMemo, useState } from "react";
import { MessageSquareWarning, Shuffle, BadgeCheck, BadgeX } from "lucide-react";

export default function InferenceLimitationsLab() {
  const [prompt, setPrompt] = useState("Summarise this policy in three bullet points: ...");
  const [sensitivity, setSensitivity] = useState(2);
  const [nonDeterminism, setNonDeterminism] = useState(2);
  const [hallucinationRisk, setHallucinationRisk] = useState(2);

  const guidance = useMemo(() => {
    const out: string[] = [];
    out.push("Prompt sensitivity: small wording changes can change behaviour, especially for ambiguous tasks.");
    out.push("Non-determinism: even with the same prompt, outputs can vary due to sampling and system factors.");
    out.push("Hallucinations: plausible text can be wrong. Confidence is not correctness.");
    if (hallucinationRisk >= 3) out.push("High hallucination risk. Require citations or constrain the system to a known source.");
    if (sensitivity >= 3) out.push("High sensitivity. Standardise prompts and test variants as part of the release process.");
    return out;
  }, [hallucinationRisk, sensitivity]);

  const verdict = useMemo(() => {
    const score = sensitivity + nonDeterminism + hallucinationRisk;
    if (score >= 10) return { ok: false, label: "Do not trust output without strong controls" };
    if (score >= 6) return { ok: false, label: "Treat output as a draft with review" };
    return { ok: true, label: "Suitable for low-risk assistance" };
  }, [sensitivity, nonDeterminism, hallucinationRisk]);

  return (
    <section className="space-y-6" aria-label="Inference and limitations lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquareWarning className="h-5 w-5 text-rose-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Inference and limitations</h2>
        </div>
        <p className="text-sm text-slate-700">
          Inference is the model producing an output. The hard part is interpreting that output safely.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">A simple inference risk check</h3>
            <p className="text-sm text-slate-700">This is not a model run. It is a structured way to think about how much you should trust AI output for a task.</p>
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-700">Example prompt</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <span className="text-xs text-slate-600">We keep this local. The point is to assess task risk, not to call an external model.</span>
            </label>

            {[
              { label: "Prompt sensitivity", value: sensitivity, set: setSensitivity, icon: Shuffle },
              { label: "Non-determinism", value: nonDeterminism, set: setNonDeterminism, icon: Shuffle },
              { label: "Hallucination risk", value: hallucinationRisk, set: setHallucinationRisk, icon: MessageSquareWarning },
            ].map((x) => (
              <div key={x.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <x.icon className="h-4 w-4 text-slate-700" aria-hidden="true" />
                    {x.label}
                  </span>
                  <span>{["Very low", "Low", "Medium", "High", "Very high"][x.value]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={x.value} onChange={(e) => x.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2">
                {verdict.ok ? <BadgeCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" /> : <BadgeX className="h-5 w-5 text-rose-600" aria-hidden="true" />}
                <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">{verdict.label}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {guidance.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Confidence vs correctness</p>
            <p className="text-sm text-slate-700">
              Many systems can produce confident text even when wrong. Treat confidence signals as a product feature, not a truth guarantee.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



