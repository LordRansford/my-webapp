"use client";

import React, { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  estimatedMinutes: number;
  disclaimer: string;
  inputs: ReactNode;
  results: ReactNode;
  charts: ReactNode;
  exports: ReactNode;
  onReset: () => void;
};

export default function TemplateRunnerLayout({ title, description, estimatedMinutes, disclaimer, inputs, results, charts, exports, onReset }: Props) {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <header className="space-y-2 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Template runner</p>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all inputs?")) onReset();
            }}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Reset
          </button>
        </div>
        <p className="text-sm text-slate-700">{description}</p>
        <p className="text-xs text-slate-600">Estimated time: {estimatedMinutes} minutes</p>
        <p className="text-xs text-slate-600">Disclaimer: {disclaimer}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm lg:col-span-2" aria-label="Inputs">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Inputs</h2>
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("results-panel");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
            >
              Jump to results
            </button>
          </div>
          {inputs}
        </section>

        <section id="results-panel" className="space-y-3 lg:col-span-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            {results}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Charts</h2>
            {charts}
          </div>
        </section>
      </div>

      {exports}
    </div>
  );
}
