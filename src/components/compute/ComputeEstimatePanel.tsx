"use client";

import Link from "next/link";
import type { ComputeCostBreakdown } from "@/lib/compute/estimateCost";
import { computeIntensityFromUnits, freeTierCoverageFromUnits } from "@/lib/compute/computeModel";

function labelIntensity(v: "low" | "medium" | "high") {
  if (v === "low") return "Low";
  if (v === "medium") return "Medium";
  return "High";
}

function labelCoverage(v: "yes" | "likely" | "no") {
  if (v === "yes") return "Yes";
  if (v === "likely") return "Likely";
  return "No";
}

export default function ComputeEstimatePanel({ estimate }: { estimate: ComputeCostBreakdown | null }) {
  if (!estimate) return null;

  const intensity = computeIntensityFromUnits(estimate.estimate.units);
  const coverage = freeTierCoverageFromUnits(estimate.estimate.units);
  const exceedsFree = coverage !== "yes";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Compute estimate</p>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">ESTIMATE</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900">Before you run</p>
          <p className="mt-1 text-xs text-slate-700">
            Compute is an estimate of work. It depends on input size, run time, and how the tool executes.
          </p>
          <p className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1">
            ⚠️ This is an estimate. Actual compute usage may be higher or lower than estimated.
          </p>
        </div>
        <Link href="/compute" className="text-xs font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600">
          How compute works
        </Link>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold text-slate-800">Estimated compute usage</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{labelIntensity(intensity)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold text-slate-800">Free tier covers this</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{labelCoverage(coverage)}</p>
        </div>
      </div>

      {exceedsFree ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          <p className="m-0 font-semibold">Heads up</p>
          <p className="mt-1 m-0">
            This may exceed the free tier. If you do not have credits available, you will be prompted to run a lighter version.
          </p>
        </div>
      ) : null}
    </div>
  );
}


