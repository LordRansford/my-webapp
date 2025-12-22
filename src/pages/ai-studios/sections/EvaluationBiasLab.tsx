"use client";

import React, { useMemo, useState } from "react";
import { ClipboardCheck, Users, Scale } from "lucide-react";

type Goal = "Accuracy" | "Safety" | "Usefulness";

export default function EvaluationBiasLab() {
  const [goal, setGoal] = useState<Goal>("Usefulness");
  const [baseRateGap, setBaseRateGap] = useState(2);
  const [labelNoise, setLabelNoise] = useState(1);
  const [humanOversight, setHumanOversight] = useState(true);
  const [impactSeverity, setImpactSeverity] = useState(3);

  const explanation = useMemo(() => {
    const parts: string[] = [];
    parts.push("Accuracy measures correctness on a dataset. Usefulness measures value in a workflow.");
    parts.push("Bias and fairness risks often show up as different error rates across groups or contexts.");
    parts.push("Testing AI systems means testing data pipelines, prompts, and monitoring, not only the model.");
    if (baseRateGap >= 3) parts.push("Large base-rate differences can make naive fairness claims misleading. Start by understanding the population.");
    if (labelNoise >= 3) parts.push("High label noise means your metrics may be unreliable. Fix the labels and definitions first.");
    if (!humanOversight && impactSeverity >= 3) parts.push("High impact without oversight is risky. Add review steps or restrict where the system can act.");
    return parts;
  }, [baseRateGap, labelNoise, humanOversight, impactSeverity]);

  const rubric = useMemo(() => {
    if (goal === "Accuracy") return ["Use a held-out test set.", "Track calibration if you show confidence.", "Watch for drift and changes in data definitions."];
    if (goal === "Safety") return ["Define harm scenarios.", "Add guardrails and block risky outputs.", "Escalate to humans for edge cases."];
    return ["Measure time saved and user satisfaction.", "Track error cost, not only error rate.", "Design a workflow that recovers from mistakes."];
  }, [goal]);

  return (
    <section className="space-y-6" aria-label="Evaluation and bias lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Evaluation and bias</h2>
        </div>
        <p className="text-sm text-slate-700">
          Evaluation is how you earn trust. Bias is a risk to safety, fairness, and credibility. Both are business and governance concerns, not only technical ones.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. What are you optimising for?</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Usefulness", "Accuracy", "Safety"] as Goal[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    goal === g ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Evaluation rubric</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {rubric.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-rose-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Bias and oversight factors</h3>
            </div>
            {[
              { label: "Base-rate gap between groups", value: baseRateGap, set: setBaseRateGap },
              { label: "Label noise", value: labelNoise, set: setLabelNoise },
              { label: "Impact severity if wrong", value: impactSeverity, set: setImpactSeverity },
            ].map((x) => (
              <div key={x.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>{x.label}</span>
                  <span>{["Very low", "Low", "Medium", "High", "Very high"][x.value]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={x.value} onChange={(e) => x.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input type="checkbox" checked={humanOversight} onChange={(e) => setHumanOversight(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
              Human oversight exists for higher impact decisions
            </label>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {explanation.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-600">This lab avoids heavy maths. In practice you would still run real subgroup and drift tests.</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Accuracy vs usefulness</p>
            <p className="text-sm text-slate-700">
              A system can be accurate and still harmful, if it is applied to the wrong task or used without safeguards.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



