"use client";

import Link from "next/link";

export default function SupportBanner() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Support</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-900">Support this work</h2>
      <p className="mt-2 text-sm text-slate-700">
        Donations help maintain and improve the site. No paywalls. No forced sign ups. You keep full access either way.
      </p>
      <p className="mt-2 text-xs text-slate-600">
        Payments are not enabled yet in this build. This card is informational only.
      </p>
      <div className="mt-3">
        <Link
          href="/support/donate"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}


