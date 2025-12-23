"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityNotice } from "@/components/SecurityNotice";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { StudioCard } from "@/components/studios/StudioCard";

const navChips = [
  { label: "Control Room", href: "/studios" },
  { label: "Architecture Diagram Studio", href: "/studios/architecture-diagram-studio" },
  { label: "Responsible AI Studio", href: "/ai-studios" },
  { label: "Model Forge", href: "/studios/model-forge" },
  { label: "Vision Lab", href: "/studios/vision-lab" },
  { label: "Speech & Sound Lab", href: "/studios/speech-lab" },
  { label: "Docs & Data Lab", href: "/studios/docs-data-lab" },
  { label: "LLM & Agent Lab", href: "/studios/llm-agent-lab" },
  { label: "Evaluation & Governance Lab", href: "/studios/eval-governance-lab" },
  { label: "Visit AI Labs", href: "/tools/ai" },
];

const chip = (item) => (
  <Link
    key={item.label}
    href={item.href}
    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    role="tab"
    aria-selected="false"
  >
    {item.label}
  </Link>
);

const DevOnly = ({ children }) => (process.env.NODE_ENV === "development" ? <div className="text-xs text-slate-500 mt-2">{children}</div> : null);

export default function StudiosPage() {
  const datasets = useStudiosStore((s) => s.datasets);
  const jobs = useStudiosStore((s) => s.jobs);
  const safetyChecklist = useMemo(
    () => [
      { label: "API keys stay in .env.local", ok: true },
      { label: "No user data to 3rd-party analytics", ok: true },
      { label: "Max file size enforced", ok: true },
      { label: "Max training time enforced", ok: true },
    ],
    []
  );

  return (
    <div className="page-content space-y-10 text-base leading-relaxed max-w-5xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/50 to-slate-50 ring-1 ring-slate-100 px-6 py-6 sm:px-8 sm:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
              New
            </span>
            <span>Ransford&apos;s AI Studios</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Ransford&apos;s AI Studios</h1>
          <p className="text-base text-slate-700 max-w-3xl">
            This is my AI sandbox. Bring your own data, keep everything local, and try ideas without handing them to a black box. We look at safety, drift, fairness and classic ML in one place, minus the vendor noise.
          </p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Studios navigation">
            {navChips.map((item) => chip(item))}
          </div>
        </div>
      </div>

      <SecurityNotice />
      <SecurityBanner />

      <section className="grid gap-6 xl:grid-cols-2">
        {/* Control Room */}
        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
              Control Room
            </div>
            <p className="text-base text-slate-700">
              Overview of datasets, jobs and safety. Upload, profile, and keep an eye on running work before you jump into the other
              studios.
            </p>
          </header>

          <div className="space-y-3">
            <p className="text-xl font-semibold text-slate-900">Dataset registry</p>
            <div className="space-y-2">
              {datasets.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-600">
                  No datasets yet. Upload CSV/JSONL in Control Room to get started.
                </div>
              )}
              {datasets.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-2 gap-2"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-600">
                      {d.columnCount ?? "?"} cols • {d.rowCount ?? "?"} rows
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200">
                        type: tabular
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/studios/model-forge"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                    >
                      Open in Model Forge
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xl font-semibold text-slate-900">Job board</p>
            <div className="space-y-2">
              {jobs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-base text-slate-600">
                  No jobs yet. Train a model in Model Forge to see it here.
                </div>
              )}
              {jobs.map((j) => (
                <div key={j.id} className="rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100/60">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{j.name}</p>
                      <p className="text-xs text-slate-600">
                        {j.status} • {j.metrics ? Object.entries(j.metrics).map(([k, v]) => `${k}:${v}`).join(" ") : "no metrics yet"}
                      </p>
                    </div>
                    <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2">
                      Replay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-semibold text-slate-900">Safety status</p>
            <ul className="space-y-1 text-sm text-slate-700">
              {safetyChecklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.ok ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </StudioCard>

        {/* Model Forge */}
        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100">
              Model Forge
            </div>
            <p className="text-base text-slate-700">
              Train and evaluate tabular models with real metrics. Everything runs in your browser for privacy and speed.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Upload & detect task</p>
              <p className="text-xs text-slate-600">
                Upload CSV/Parquet, pick target, auto-detect classification vs regression. Set train/test split, CV folds.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Algorithms & hyperparameters</p>
              <p className="text-xs text-slate-600">
                Logistic regression, random forest, boosted trees, small MLP. Tune depth, trees, learning rate, epochs.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Evaluation</p>
              <p className="text-xs text-slate-600">
                Classification: accuracy, precision, recall, F1, ROC/AUC, confusion matrix. Regression: MAE, MSE, RMSE, R². Feature
                importance for trees.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Inference playground</p>
              <p className="text-xs text-slate-600">
                Auto-generated form from your features. Shows prediction and uncertainty. Sample to N rows for heavy datasets.
              </p>
            </div>
          </div>

          <DevOnly>
            Currently stubbed with mock data and in-memory flow. Swap in your backend for training/eval and connect to a “cloud AI
            provider” via user-supplied keys. Keep vendor names out of the UI; mention them only in docs with proper trademark notes.
          </DevOnly>
        </StudioCard>

        {/* Architecture Diagram Studio */}
        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-900 ring-1 ring-indigo-100">
              Architecture Diagram Studio
            </div>
            <p className="text-base text-slate-700">
              Describe your system and generate clear, printable architecture diagrams. Choose the guided wizard for beginners or the power editor for direct control.
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Guided Wizard 🧭</p>
              <p className="text-xs text-slate-600">Step by step. Best if you are new to architecture diagrams.</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Power Editor ⚡</p>
              <p className="text-xs text-slate-600">Direct control. Best for professionals and reviewers.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/studios/architecture-diagram-studio"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Open Architecture Diagram Studio
            </Link>
            <Link
              href="/studios/architecture-diagram-studio/wizard"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            >
              Open Wizard
            </Link>
            <Link
              href="/studios/architecture-diagram-studio/editor"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            >
              Open Editor
            </Link>
          </div>
        </StudioCard>
      </section>

      <StudioCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold text-slate-900">Studios roadmap</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/studios/model-forge"
              className="inline-flex items-center rounded-2xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Open Model Forge
            </Link>
            <Link
              href="/studios/vision-lab"
              className="inline-flex items-center rounded-2xl bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500"
            >
              Open Vision Lab
            </Link>
            <Link
              href="/studios/speech-lab"
              className="inline-flex items-center rounded-2xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Open Speech Lab
            </Link>
            <Link
              href="/studios/docs-data-lab"
              className="inline-flex items-center rounded-2xl bg-purple-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-600"
            >
              Open Docs &amp; Data Lab
            </Link>
            <Link
              href="/studios/llm-agent-lab"
              className="inline-flex items-center rounded-2xl bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-500"
            >
              Open LLM &amp; Agent Lab
            </Link>
            <Link
              href="/studios/eval-governance-lab"
              className="inline-flex items-center rounded-2xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-500"
            >
              Open Evaluation Lab
            </Link>
            <Link
              href="/tools/ai"
              className="inline-flex items-center rounded-2xl bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Visit AI Labs
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          {["Vision Lab", "Speech & Sound Lab", "Docs & Data Lab", "LLM & Agent Lab", "Evaluation & Governance Lab"].map((lab) => (
            <span key={lab} className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
              {lab}
            </span>
          ))}
        </div>
      </StudioCard>
    </div>
  );
}
