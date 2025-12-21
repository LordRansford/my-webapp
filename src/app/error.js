"use client";

import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Client-side error boundary: keep logging minimal.
    console.error("ui:error", { message: error?.message || "unknown" });
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Error</p>
        <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="text-sm text-slate-700">Try again. If it keeps happening, refresh the page.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Retry
        </button>
      </section>
    </main>
  );
}


