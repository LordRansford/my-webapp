"use client";

import { useMemo } from "react";
import { formatBytes, COMPUTE_TIER, getToolComputeProfile } from "@/config/computeLimits";
import type { ComputeCostBreakdown } from "@/lib/compute/estimateCost";
import ComputeScenarioCard from "@/components/compute/ComputeScenarioCard";

function MeterBar({ freeUsed, paidUsed, freeCap }: { freeUsed: number; paidUsed: number; freeCap: number }) {
  const total = Math.max(1, freeCap);
  const freePct = Math.min(100, Math.round((freeUsed / total) * 100));
  const paidPct = Math.min(100, Math.round((paidUsed / total) * 100));
  return (
    <div className="mt-2">
      <div className="h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100" aria-label="Compute meter">
        <div className="flex h-full w-full">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${freePct}%` }}
            title="Free tier portion"
            aria-label="Free tier portion"
          />
          <div
            className="h-full bg-amber-500"
            style={{ width: `${Math.max(0, paidPct)}%` }}
            title="Above free tier portion"
            aria-label="Above free tier portion"
          />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Free
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          Above free tier
        </span>
      </div>
    </div>
  );
}

export default function ComputeMeterPanel({
  toolId,
  phase,
  estimate,
  inputBytes,
  fileBytes,
}: {
  toolId: string;
  phase: "pre" | "post";
  estimate: ComputeCostBreakdown | null;
  inputBytes?: number | null;
  fileBytes?: number | null;
}) {
  const profile = useMemo(() => getToolComputeProfile(toolId), [toolId]);

  if (!estimate) return null;

  const freeCap = estimate.estimate.freeUnitsAvailable;
  const freeUsed = estimate.estimate.freeUnitsUsed;
  const paidUsed = estimate.estimate.paidUnitsUsed;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{phase === "pre" ? "Before you run" : "After the run"}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Compute and credits estimate</p>
          <p className="mt-1 text-xs text-slate-700">
            Free tier is always available. Credits only apply above the free tier. This is an estimate, not a promise.
          </p>
        </div>
        <div className="text-right text-xs text-slate-700">
          <div>
            Free per run: <span className="font-semibold">{COMPUTE_TIER.freeUnitsPerRun}</span> units
          </div>
          <div>
            Free per session: <span className="font-semibold">{COMPUTE_TIER.freeUnitsPerSession}</span> units
          </div>
        </div>
      </div>

      <MeterBar freeUsed={freeUsed} paidUsed={paidUsed} freeCap={freeCap} />

      <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="font-semibold text-slate-800">This run</p>
          <p className="mt-1">
            Free used: <span className="font-semibold">{freeUsed}</span> units
          </p>
          <p className="mt-1">
            Above free tier: <span className="font-semibold">{paidUsed}</span> units
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="font-semibold text-slate-800">Estimated credits</p>
          <p className="mt-1">
            Estimated credits: <span className="font-semibold">{estimate.estimate.estimatedCredits}</span>
          </p>
          <p className="mt-1 text-xs text-slate-600">Credits shown are estimates. No deductions happen in this phase.</p>
        </div>
      </div>

      {typeof inputBytes === "number" && inputBytes > 0 ? (
        <p className="mt-2 text-xs text-slate-700">
          Input size: <span className="font-semibold">{formatBytes(inputBytes)}</span>
        </p>
      ) : null}
      {typeof fileBytes === "number" && fileBytes > 0 ? (
        <p className="mt-1 text-xs text-slate-700">
          File size: <span className="font-semibold">{formatBytes(fileBytes)}</span>
        </p>
      ) : null}

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

      {estimate.explanation?.length ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold text-slate-800">What drove the estimate</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
            {estimate.explanation.slice(0, 4).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {profile?.guidance?.length ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-800">How to reduce compute</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
            {profile.guidance.slice(0, 3).map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {profile?.scenarios?.length ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {profile.scenarios.slice(0, 2).map((s) => (
            <ComputeScenarioCard key={s.title} title={s.title} note={s.estimateNote} mediumRunsPerTenCredits={s.mediumRunsPerTenCredits} largeRunCredits={s.largeRunCredits} browserOnlyCostsZero={s.browserOnlyCostsZero} />
          ))}
        </div>
      ) : null}
    </div>
  );
}


