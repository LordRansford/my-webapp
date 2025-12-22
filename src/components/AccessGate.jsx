"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getTestingOverrideDecision } from "@/lib/testingMode";

function IconBadge() {
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
      <Lock size={18} aria-hidden="true" />
    </div>
  );
}

export default function AccessGate({ feature, title, reason, children }) {
  const [summary, setSummary] = useState(null);
  const testing = getTestingOverrideDecision().allowed;

  useEffect(() => {
    let cancelled = false;
    if (testing) {
      // Temporary QA override: do not show paywalls and do not block content when testing mode is enabled.
      setSummary({ plan: "pro", features: ["*"] });
      return () => {
        cancelled = true;
      };
    }
    fetch("/api/billing/summary")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setSummary({ plan: "free", features: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [testing]);

  const hasAccess = testing || summary?.features?.includes?.(feature);
  // While loading the plan summary, render children. Server routes still enforce access.
  if (!summary) return children;
  if (hasAccess) return children;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <IconBadge />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Supporter feature</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
              <Sparkles size={14} aria-hidden="true" />
              Extra
            </span>
          </div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-700">{reason}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              See plans
            </Link>
            <Link
              href="/support/donate"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Support this work
            </Link>
            <p className="text-xs text-slate-600">
              Templates: internal use can remove the signature. Commercial use keeps author credit in the file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


