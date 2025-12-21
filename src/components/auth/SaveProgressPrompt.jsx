"use client";

import Link from "next/link";

export default function SaveProgressPrompt({ className = "" }) {
  return (
    <div className={`mt-3 rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm text-slate-700 shadow-sm ${className}`}>
      <p className="m-0">
        <span className="font-semibold text-slate-900">Sign in to track this.</span>{" "}
        Visitors can read the courses, but tracking requires an account.
      </p>
      <div className="mt-2">
        <Link
          href="/signin"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Sign in
        </Link>
      </div>
      <p className="mt-2 text-xs text-slate-600">Privacy note: we store your email and your progress only. No analytics. No IP storage.</p>
    </div>
  );
}


