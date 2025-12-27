"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatCreditsSafe, formatMsSafe, msOrNull, numberOrNull } from "@/lib/credits/format";
import type { ComputeActual, ComputeError, ComputeEstimate, ComputeRunStatus } from "@/lib/contracts/compute";

function safeList(v: unknown, max = 6): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean)
    .slice(0, max);
}

export default function ComputeMeter(props: {
  estimate: ComputeEstimate | null;
  actual: ComputeActual | null;
  tier?: { freeMsRemainingToday?: number | null } | null;
  remainingCredits?: number | null;
  runStatus: ComputeRunStatus;
  costHints?: string[];
  error?: ComputeError | null;
  compact?: boolean;
}) {
  const { estimate, actual, tier, remainingCredits, runStatus, costHints, error, compact = true } = props;
  const [expanded, setExpanded] = useState(!compact);

  const statusLabel = useMemo(() => {
    if (runStatus === "blocked") return "Blocked";
    if (runStatus === "aborted") return "Stopped";
    if (runStatus === "error") return "Error";
    return "Complete";
  }, [runStatus]);

  const freeRemaining = msOrNull(tier?.freeMsRemainingToday);

  const estimateFree = msOrNull(estimate?.freeTierAppliedMs);
  const estimatePaid = msOrNull(estimate?.paidMs);
  const estimateCredits = numberOrNull(estimate?.estimatedCreditCost);

  const actualFree = msOrNull(actual?.freeTierAppliedMs);
  const actualPaid = msOrNull(actual?.paidMs);
  const actualCredits = numberOrNull(actual?.creditsCharged);

  const reasons = safeList(estimate?.reasons);
  const hints = safeList(costHints);

  const explanation = (() => {
    if (runStatus === "blocked") {
      return "This run was blocked before it started.";
    }
    if (runStatus === "aborted") {
      return "You stopped this run before it finished.";
    }
    if (runStatus === "error") {
      return "This run did not complete successfully.";
    }
    if (actual) {
      if ((actualCredits || 0) > 0) return "This run used free tier first, then used credits for the remainder.";
      return "This run stayed within the free tier.";
    }
    return "This is an estimate based on your input size and the tool profile.";
  })();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm" aria-label="Compute meter">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Compute and credits</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{statusLabel}</div>
          <p className="mt-1 text-sm text-slate-700">{explanation}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/compute" className="text-xs font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600">
            How compute works
          </Link>
          <button
            type="button"
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-900 hover:border-slate-400"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Less" : "More"}
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-xs font-semibold text-slate-800">Free remaining today</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{formatMsSafe(freeRemaining)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-xs font-semibold text-slate-800">Estimate</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {estimate ? (estimateCredits && estimateCredits > 0 ? `${formatCreditsSafe(estimateCredits)} credits` : "0 credits") : "N/A"}
          </div>
          <div className="mt-1 text-xs text-slate-700">
            {estimate ? `Time: ${formatMsSafe(estimate?.estimatedWallTimeMs)}` : "No estimate yet"}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-xs font-semibold text-slate-800">After run</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {actual ? (actualCredits && actualCredits > 0 ? `${formatCreditsSafe(actualCredits)} credits` : "0 credits") : "N/A"}
          </div>
          <div className="mt-1 text-xs text-slate-700">{actual ? `Time: ${formatMsSafe(actual?.durationMs)}` : "No receipt yet"}</div>
        </div>
      </div>

      {typeof remainingCredits === "number" ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
          Remaining credits: <span className="font-semibold text-slate-900">{formatCreditsSafe(remainingCredits)}</span>
        </div>
      ) : null}

      {expanded ? (
        <div className="mt-3 space-y-3">
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
              <p className="m-0 font-semibold">{error.message}</p>
              {error.hint ? <p className="mt-1 m-0 text-sm text-rose-900">Try: {error.hint}</p> : null}
              {error.details ? <p className="mt-1 m-0 text-xs text-rose-800">{error.details}</p> : null}
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-800">Free tier usage</p>
              <p className="mt-1 text-sm text-slate-900">
                Estimate: <span className="font-semibold">{formatMsSafe(estimateFree)}</span>
              </p>
              <p className="mt-1 text-sm text-slate-900">
                Actual: <span className="font-semibold">{formatMsSafe(actualFree)}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-800">Paid usage</p>
              <p className="mt-1 text-sm text-slate-900">
                Estimate: <span className="font-semibold">{formatMsSafe(estimatePaid)}</span>
              </p>
              <p className="mt-1 text-sm text-slate-900">
                Actual: <span className="font-semibold">{formatMsSafe(actualPaid)}</span>
              </p>
            </div>
          </div>

          {reasons.length ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="m-0 font-semibold">Notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold text-slate-800">How to reduce compute cost</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {(hints.length ? hints : ["Try a smaller input first.", "Run the free tier preview before scaling up.", "Avoid rerunning unchanged inputs."]).slice(0, 4).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}


