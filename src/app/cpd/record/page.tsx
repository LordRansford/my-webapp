"use client";

import React from "react";
import Link from "next/link";

export default function CpdRecordPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <header className="space-y-2 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">CPD learning record</p>
        <h1 className="text-2xl font-semibold text-slate-900">My CPD transcript</h1>
        <p className="text-sm text-slate-700">
          This page is a navigation point for your server-derived learning records. PDF certificates are not generated at this stage.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/my-cpd/records"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            View learning records
          </Link>
          <Link
            href="/my-cpd/evidence"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Evidence text
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <p className="text-sm text-slate-700">
          Use the learning records page to view earned hours and completion status. Certificates are prepared as data and verified by ID.
        </p>
      </section>
    </main>
  );
}
