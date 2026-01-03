"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "rn_beta_banner_dismissed";

function getSessionFlag() {
  try {
    // Per-session persistence: sessionStorage resets when the browser session ends.
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function setSessionFlag() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore storage errors
  }
}

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(getSessionFlag());
  }, []);

  if (dismissed) return null;

  return (
    <section
      className="mb-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 p-4 shadow-sm backdrop-blur"
      aria-label="Preview release notice"
      role="region"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="m-0 text-sm font-semibold text-slate-900">Beta</p>
          <div className="mt-2 space-y-1 text-sm text-slate-700">
            <p className="m-0">This site is live for testing.</p>
            <p className="m-0">Courses and CPD service alignment are still under review.</p>
            <p className="m-0">
              Tools are for learning and demonstration only. Verify important decisions with authoritative sources.
            </p>
            <p className="m-0">
              Sign in is recommended if you want CPD tracking and assessments.{" "}
              <Link
                href="/feedback"
                className="font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              >
                Give feedback
              </Link>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          onClick={() => {
            setSessionFlag();
            setDismissed(true);
          }}
          aria-label="Dismiss preview release notice"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}


