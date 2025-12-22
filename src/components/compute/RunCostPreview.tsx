"use client";

import type { ComputeCostBreakdown } from "@/lib/compute/estimateCost";
import CreditBalanceBadge from "@/components/compute/CreditBalanceBadge";
import ComputeMeter from "@/components/compute/ComputeMeter";

export default function RunCostPreview({
  estimate,
  creditsBalance,
}: {
  estimate: ComputeCostBreakdown | null;
  creditsBalance: number | null;
}) {
  if (!estimate) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Before you run</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Estimated cost</p>
          <p className="mt-1 text-xs text-slate-700">Free tier is always free. Credits only apply above the free tier.</p>
        </div>
        <CreditBalanceBadge balance={creditsBalance} />
      </div>

      <div className="mt-3">
        <ComputeMeter freeUsed={estimate.estimate.freeUnitsUsed} paidUsed={estimate.estimate.paidUnitsUsed} freeCap={estimate.estimate.freeUnitsAvailable} />
      </div>

      <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="font-semibold text-slate-800">Free tier</p>
          <p className="mt-1">Free used: <span className="font-semibold">{estimate.estimate.freeUnitsUsed}</span> units</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="font-semibold text-slate-800">Above free tier</p>
          <p className="mt-1">Estimated credits: <span className="font-semibold">{estimate.estimate.estimatedCredits}</span></p>
        </div>
      </div>

      {estimate.warnings?.length ? (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-3">
          <p className="text-xs font-semibold text-amber-900">Warnings</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-900">
            {estimate.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}


