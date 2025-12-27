"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCreditsSafe, formatMsSafe, msOrNull, numberOrNull } from "@/lib/credits/format";
import type { CreditsEstimateResponse } from "@/lib/contracts/credits";

type Preset = "light" | "standard" | "heavy";

type Estimate = Exclude<CreditsEstimateResponse, { message: string }>;

type Receipt = {
  runId: string;
  toolId: string;
  durationMs: number;
  freeTierAppliedMs: number;
  paidMs: number;
  creditsCharged: number;
  remainingCredits: number | null;
  guidanceTips: string[];
};

type WalletState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "ready"; balance: number; freeTierRemainingMs: number | null };

export function CreditMeter({
  toolId,
  inputBytes,
  preset = "standard",
  lastReceipt,
}: {
  toolId: string;
  inputBytes: number;
  preset?: Preset;
  lastReceipt?: Receipt | null;
}) {
  const [wallet, setWallet] = useState<WalletState>({ status: "loading" });
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimateStatus, setEstimateStatus] = useState<"loading" | "ready">("loading");

  const payload = useMemo(() => ({ toolId, inputBytes, requestedComplexityPreset: preset }), [toolId, inputBytes, preset]);

  useEffect(() => {
    let cancelled = false;
    setWallet({ status: "loading" });
    // Best effort wallet for logged in users.
    fetch("/api/credits/wallet")
      .then(async (r) => {
        if (r.status === 401) return { __signedOut: true };
        if (!r.ok) return null;
        return await r.json().catch(() => null);
      })
      .then((j: any) => {
        if (cancelled) return;
        if (j?.__signedOut) return setWallet({ status: "signed_out" });
        const balance = numberOrNull(j?.balance) ?? 0;
        const freeTierRemainingMs = msOrNull(j?.freeTierRemainingMs);
        setWallet({ status: "ready", balance, freeTierRemainingMs });
      })
      .catch(() => {
        if (cancelled) return;
        setWallet({ status: "signed_out" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setEstimateStatus("loading");
    fetch("/api/credits/estimate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
      .then((r) => r.json().catch(() => null))
      .then((j) => {
        if (cancelled) return;
        setEstimate(j);
        setEstimateStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setEstimate(null);
        setEstimateStatus("ready");
      });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  const creditsDisplay =
    wallet.status === "ready" ? formatCreditsSafe(wallet.balance) : wallet.status === "signed_out" ? null : null;

  const freeRemainingMs = msOrNull(estimate?.freeTierRemainingMs) ?? (wallet.status === "ready" ? wallet.freeTierRemainingMs : null);
  const freeRemainingDisplay =
    estimateStatus === "loading" && wallet.status === "loading"
      ? "Loading…"
      : wallet.status === "signed_out"
        ? "Sign in to see credits"
        : formatMsSafe(freeRemainingMs) ?? "N/A";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm" aria-label="Credits and compute">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Credits and compute</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">Free usage stays free</div>
          <div className="mt-1 text-sm text-slate-700">Credits only apply above free limits.</div>
        </div>
        <div className="text-sm font-semibold text-slate-900">
          Credits: {wallet.status === "loading" ? "Loading…" : creditsDisplay ?? "Sign in"}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-xs font-semibold text-slate-800">Free remaining today</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {freeRemainingDisplay}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-xs font-semibold text-slate-800">Estimated cost</div>
          {estimateStatus === "loading" ? (
            <div className="mt-1 text-sm text-slate-700">Loading estimate…</div>
          ) : estimate ? (
            <>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {estimate.willChargeCredits ? `${formatCreditsSafe(estimate.estimatedCredits) ?? "N/A"} credits` : "0 credits"}
              </div>
              <div className="mt-1 text-xs text-slate-700">Estimated duration: {formatMsSafe(estimate.estimatedDurationMs) ?? "N/A"}</div>
            </>
          ) : (
            <div className="mt-1 text-sm text-slate-700">Estimate unavailable</div>
          )}
        </div>
      </div>

      {estimate && !estimate.allowed ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {estimate.reason || "Run not allowed."}
        </div>
      ) : null}

      {lastReceipt ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">After the run</div>
          <div className="mt-1 grid gap-2 sm:grid-cols-2 text-sm text-slate-800">
            <div>
              Duration: <span className="font-semibold">{formatMsSafe(lastReceipt.durationMs) ?? "N/A"}</span>
            </div>
            <div>
              Credits charged: <span className="font-semibold">{formatCreditsSafe(lastReceipt.creditsCharged) ?? "N/A"}</span>
            </div>
            <div>
              Free applied: <span className="font-semibold">{formatMsSafe(lastReceipt.freeTierAppliedMs) ?? "N/A"}</span>
            </div>
            <div>
              Above free: <span className="font-semibold">{formatMsSafe(lastReceipt.paidMs) ?? "N/A"}</span>
            </div>
          </div>
          {Array.isArray(lastReceipt.guidanceTips) && lastReceipt.guidanceTips.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {lastReceipt.guidanceTips.slice(0, 3).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}


