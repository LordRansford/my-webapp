"use client";

import { useEffect, useMemo, useState } from "react";

type Preset = "light" | "standard" | "heavy";

type Estimate = {
  allowed: boolean;
  reason?: string | null;
  estimatedDurationMs: number;
  estimatedCredits: number;
  freeTierRemainingMs: number;
  willChargeCredits: boolean;
  requiredCreditsIfAny: number;
};

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

function fmtMs(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

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
  const [wallet, setWallet] = useState<{ balance: number; freeTierRemainingMs: number } | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);

  const payload = useMemo(() => ({ toolId, inputBytes, requestedComplexityPreset: preset }), [toolId, inputBytes, preset]);

  useEffect(() => {
    // Best effort wallet for logged in users. If unauthorized, it will fail silently.
    fetch("/api/credits/wallet")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setWallet(j))
      .catch(() => setWallet(null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/credits/estimate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
      .then((r) => r.json().catch(() => null))
      .then((j) => {
        if (cancelled) return;
        setEstimate(j);
      })
      .catch(() => setEstimate(null));
    return () => {
      cancelled = true;
    };
  }, [payload]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm" aria-label="Credits and compute">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Credits and compute</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">Free usage stays free</div>
          <div className="mt-1 text-sm text-slate-700">Credits only apply above free limits.</div>
        </div>
        <div className="text-sm font-semibold text-slate-900">
          Credits: {typeof wallet?.balance === "number" ? wallet.balance : "Sign in"}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-xs font-semibold text-slate-800">Free remaining today</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {estimate ? fmtMs(estimate.freeTierRemainingMs) : wallet ? fmtMs(wallet.freeTierRemainingMs) : "Unknown"}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="text-xs font-semibold text-slate-800">Estimated cost</div>
          {estimate ? (
            <>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {estimate.willChargeCredits ? `${estimate.estimatedCredits} credits` : "0 credits"}
              </div>
              <div className="mt-1 text-xs text-slate-700">Estimated duration: {fmtMs(estimate.estimatedDurationMs)}</div>
            </>
          ) : (
            <div className="mt-1 text-sm text-slate-700">Loading estimate...</div>
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
              Duration: <span className="font-semibold">{fmtMs(lastReceipt.durationMs)}</span>
            </div>
            <div>
              Credits charged: <span className="font-semibold">{lastReceipt.creditsCharged}</span>
            </div>
            <div>
              Free applied: <span className="font-semibold">{fmtMs(lastReceipt.freeTierAppliedMs)}</span>
            </div>
            <div>
              Above free: <span className="font-semibold">{fmtMs(lastReceipt.paidMs)}</span>
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


