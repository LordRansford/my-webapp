"use client";

import React, { useMemo, useState } from "react";
import { Network, MessagesSquare, Eye, Mic } from "lucide-react";

type ModelType = "Classical ML" | "Neural networks" | "Large language models" | "Vision and speech models";

export default function ModelTypesLab() {
  const [active, setActive] = useState<ModelType>("Classical ML");

  const info = useMemo(() => {
    if (active === "Classical ML")
      return {
        icon: Network,
        good: ["Tabular prediction with clear features.", "Fast training and simpler debugging.", "Often easier to explain and measure."],
        bad: ["Needs good feature design.", "Can struggle with unstructured data.", "Still fails under distribution shift."],
        examples: ["Fraud scoring", "Churn prediction", "Risk ranking", "Anomaly scoring"],
      };
    if (active === "Neural networks")
      return {
        icon: Network,
        good: ["Learn complex patterns from data.", "Strong for images, text embeddings, and sequences.", "Can compress useful representations."],
        bad: ["Harder to explain.", "Sensitive to data quality and scaling.", "More compute and more ways to fail quietly."],
        examples: ["Image classification", "Speech recognition", "Time-series forecasting"],
      };
    if (active === "Large language models")
      return {
        icon: MessagesSquare,
        good: ["Strong at language tasks: drafting, summarising, classification with good prompts.", "Useful for search, support, and workflows.", "Can be combined with retrieval for grounded answers."],
        bad: ["Hallucinations and prompt sensitivity.", "Non-determinism and inconsistent outputs.", "Privacy and governance risks if used carelessly."],
        examples: ["Customer support assistant", "Document summarisation", "Policy Q&A with citations"],
      };
    return {
      icon: active === "Vision and speech models" ? Eye : Mic,
      good: ["Perception tasks: detect objects, transcribe speech, classify audio.", "Great when evaluation datasets reflect reality."],
      bad: ["Errors can be systematic for some groups or environments.", "Confidence is not correctness.", "Data collection and privacy are often the hardest part."],
      examples: ["Content moderation", "Accessibility captions", "Quality inspection"],
    };
  }, [active]);

  return (
    <section className="space-y-6" aria-label="Model types lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Model types and capabilities</h2>
        <p className="text-sm text-slate-700">
          Different models are good at different work. Choose based on the task, the data you have, and the failure costs.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Choose a model family</p>
            <div className="grid gap-3 md:grid-cols-2">
              {(["Classical ML", "Neural networks", "Large language models", "Vision and speech models"] as ModelType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActive(t)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    active === t ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{t}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <info.icon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">{active}</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Good at</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {info.good.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Weak at</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {info.bad.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Typical real-world uses</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {info.examples.map((x) => (
                  <span key={x} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Decision rule</p>
            <p className="text-sm text-slate-700">
              Start with the simplest model that meets the need. Add complexity only when evaluation shows a real improvement and you can operate it safely.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



