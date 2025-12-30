"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { 
  Code, 
  Shield, 
  Database, 
  Brain, 
  Sparkles, 
  FlaskConical, 
  Eye, 
  Volume2, 
  FileText, 
  MessageSquare, 
  Scale,
  Layers
} from "lucide-react";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityNotice } from "@/components/SecurityNotice";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { StudioCard } from "@/components/studios/StudioCard";

const navChips = [
  { label: "Software Development Studio", href: "/dev-studios" },
  { label: "Cybersecurity Studio", href: "/cyber-studios" },
  { label: "Data and Digitalisation Studio", href: "/data-studios" },
  { label: "AI Studio", href: "/studios/ai-hub" },
  { label: "Architecture Diagram Studio", href: "/studios/architecture-diagram-studio" },
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
    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 active:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 min-h-[40px] sm:min-h-[44px] touch-manipulation flex-shrink-0"
    role="tab"
    aria-selected="false"
  >
    <span className="whitespace-nowrap">{item.label}</span>
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
    <div className="mx-auto w-full max-w-5xl px-3 py-4 space-y-6 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 text-sm sm:text-base leading-relaxed overflow-x-hidden">
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/50 to-slate-50 ring-1 ring-slate-100 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
              New
            </span>
            <span>Studios</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">Studios and labs</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-700 max-w-3xl leading-relaxed">
            Studios are guided workspaces where you build a real project in small, safe steps. Labs are focused tools for drilling one skill.
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0" role="tablist" aria-label="Studios navigation">
            {navChips.map((item) => chip(item))}
          </div>
        </div>
      </div>

      <SecurityNotice />
      <SecurityBanner />

      <section className="grid gap-4 sm:gap-6 md:grid-cols-2" aria-label="Core studios">
        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white ring-1 ring-slate-900">
              <Code className="h-4 w-4" aria-hidden="true" />
              Software Development Studio
            </div>
            <p className="text-base text-slate-700">
              Build a full project end to end. Requirements, architecture, backend, frontend, security, and delivery. It stays local to your browser.
            </p>
          </header>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dev-studios"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Open Software Development Studio
            </Link>
            <Link
              href="/dev-studios?tab=overview"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Start in Control Room
            </Link>
          </div>
          <p className="text-xs text-slate-600">Tip: keep secrets out of text boxes. Use `.env.local` in your own repos.</p>
        </StudioCard>

        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-100">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Cybersecurity Studio
            </div>
            <p className="text-base text-slate-700">
              Practise governance, threat thinking, incident response, and recovery planning. It is built to be useful for work and safe for learning.
            </p>
          </header>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/cyber-studios"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Open Cybersecurity Studio
            </Link>
            <Link
              href="/cybersecurity"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-amber-300 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
            >
              Open cybersecurity notes
            </Link>
          </div>
        </StudioCard>

        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-100">
              <Database className="h-4 w-4" aria-hidden="true" />
              Data and Digitalisation Studio
            </div>
            <p className="text-base text-slate-700">Turn messy data and processes into decisions. Use dashboards, templates, and careful trade offs.</p>
          </header>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/data-studios"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Open Data and Digitalisation Studio
            </Link>
            <Link
              href="/data"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
            >
              Open data notes
            </Link>
          </div>
        </StudioCard>

        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-900 ring-1 ring-indigo-100">
              <Brain className="h-4 w-4" aria-hidden="true" />
              AI Studio
            </div>
            <p className="text-base text-slate-700">A responsible AI studio for scenarios, evaluation, and practical habits. It is designed to keep learning local.</p>
          </header>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/ai-studios"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Open AI Studio
            </Link>
            <Link
              href="/ai"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            >
              Open AI notes
            </Link>
          </div>
        </StudioCard>
      </section>

      <section className="grid gap-4 sm:gap-6 xl:grid-cols-2" aria-label="AI labs and specialist tools">
        {/* AI Control Room */}
        <StudioCard>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              AI Control Room
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
                      {d.columnCount ?? "?"} cols · {d.rowCount ?? "?"} rows
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
                        {j.status} · {j.metrics ? Object.entries(j.metrics).map(([k, v]) => `${k}:${v}`).join(" ") : "no metrics yet"}
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
              <Sparkles className="h-4 w-4" aria-hidden="true" />
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
              <Layers className="h-4 w-4" aria-hidden="true" />
              Architecture Diagram Studio
            </div>
            <p className="text-base text-slate-700">
              Describe your system and generate clear, printable architecture diagrams. Choose the guided wizard for beginners or the power editor for direct control.
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Guided wizard</p>
              <p className="text-xs text-slate-600">Step by step. Best if you are new to architecture diagrams.</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-base font-semibold text-slate-900">Power editor</p>
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
