"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ComputeCostBreakdown } from "@/lib/compute/estimateCost";
import { getToolComputeProfile } from "@/config/computeLimits";

export default function ComputeSummaryPanel({ toolId, summary }: { toolId: string; summary: ComputeCostBreakdown | null }) {
  const profile = useMemo(() => getToolComputeProfile(toolId), [toolId]);
  if (!summary) return null;

  return (
    <details className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Compute summary</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">After the run</p>
          </div>
          <span className="text-xs font-semibold text-slate-700">Toggle</span>
        </div>
      </summary>

      <div className="mt-3 space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-800">Estimated units</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{summary.estimate.units}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-800">Free portion</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{summary.estimate.freeUnitsUsed}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-800">Above free tier</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{summary.estimate.paidUnitsUsed}</p>
          </div>
        </div>

        {summary.explanation?.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold text-slate-800">Why it cost this much</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
              {summary.explanation.slice(0, 4).map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-800">How to reduce this next time</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
            {(profile?.guidance || ["Try smaller inputs first.", "Avoid rerunning unchanged inputs.", "Sample before scaling up."]).slice(0, 4).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-600">
            More detail:{" "}
            <Link href="/compute" className="font-semibold underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600">
              How compute works
            </Link>
          </p>
        </div>
      </div>
    </details>
  );
}



