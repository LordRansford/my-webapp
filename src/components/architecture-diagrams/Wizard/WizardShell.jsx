"use client";

import Link from "next/link";

export default function WizardShell({ title, subtitle, left, children, onReset, lastUpdated }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Architecture Diagram Studio</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-700">{subtitle}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/studios/architecture-diagram-studio"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 xl:col-span-3">{left}</aside>
        <section className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">{children}</div>
          {lastUpdated ? (
            <p className="mt-3 text-xs font-medium text-slate-600">Autosaves locally. Last updated: {lastUpdated}</p>
          ) : (
            <p className="mt-3 text-xs font-medium text-slate-600">Autosaves locally.</p>
          )}
        </section>
      </div>
    </div>
  );
}


