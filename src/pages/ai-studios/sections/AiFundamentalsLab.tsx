"use client";

import React, { useMemo, useState } from "react";
import { Brain, ListChecks, Wrench } from "lucide-react";

type Lens = "Plain language" | "Technical context";

export default function AiFundamentalsLab() {
  const [lens, setLens] = useState<Lens>("Plain language");
  const [topic, setTopic] = useState<"ML vs rules" | "Learning types" | "Generalisation and failure">("ML vs rules");

  const content = useMemo(() => {
    if (topic === "ML vs rules") {
      return {
        title: "Machine learning vs rules-based systems",
        plain: [
          "Rules-based systems follow explicit logic you write. They are predictable, but brittle when the world changes.",
          "Machine learning learns patterns from data. It can generalise, but it can also be confidently wrong.",
        ],
        tech: [
          "Rules: deterministic logic, clear decision boundaries, easier traceability.",
          "ML: statistical estimation, learned parameters, performance depends on data distribution and labels.",
        ],
      };
    }
    if (topic === "Learning types") {
      return {
        title: "Supervised, unsupervised, and reinforcement learning",
        plain: [
          "Supervised learning: learn from examples with labels (spam vs not spam).",
          "Unsupervised learning: find structure without labels (clusters, anomalies).",
          "Reinforcement learning: learn by trying actions and receiving rewards.",
        ],
        tech: [
          "Supervised: minimise loss against labelled targets; risk of label noise and leakage.",
          "Unsupervised: optimise similarity structure; evaluation often indirect and domain-specific.",
          "Reinforcement: policies, exploration vs exploitation; sensitive to reward design.",
        ],
      };
    }
    return {
      title: "Why models generalise and why they fail",
      plain: [
        "Models generalise when training examples cover the real world well enough.",
        "They fail when the world shifts, data is biased, labels are wrong, or the task is underspecified.",
      ],
      tech: [
        "Generalisation depends on representativeness, regularisation, and capacity vs signal.",
        "Failures include distribution shift, spurious correlations, overfitting, and underspecified objectives.",
      ],
    };
  }, [topic]);

  return (
    <section className="space-y-6" aria-label="AI fundamentals lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">AI fundamentals</h2>
        </div>
        <p className="text-sm text-slate-700">Plain language first. Technical context second. The goal is confident explanation and safe decisions.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">1. Choose a topic</p>
            <div className="grid gap-3 md:grid-cols-3">
              {(["ML vs rules", "Learning types", "Generalisation and failure"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    topic === t ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{t}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">2. Choose a lens</p>
            <div className="flex flex-wrap gap-2">
              {(["Plain language", "Technical context"] as Lens[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLens(l)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    lens === l ? "border-indigo-300 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{content.title}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {(lens === "Plain language" ? content.plain : content.tech).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">A useful mental model</p>
            </div>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Data defines what the system can learn.</li>
              <li>Objectives define what it tries to optimise.</li>
              <li>Evaluation defines what you trust.</li>
              <li>Controls define what you allow in production.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">Decision cue</p>
            </div>
            <p className="text-sm text-slate-700">
              If you cannot define success and failure clearly, do not deploy AI. Use a simpler rule or a human workflow first.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



