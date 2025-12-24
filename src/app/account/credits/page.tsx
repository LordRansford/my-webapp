"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";

function fmtMs(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export default function CreditsWalletPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/credits/wallet")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setData(j))
      .catch(() => setData({ unauthorized: true }));
  }, []);

  const lots = Array.isArray(data?.lots) ? data.lots : [];
  const balance = typeof data?.balance === "number" ? data.balance : null;
  const freeRemaining = typeof data?.freeTierRemainingMs === "number" ? data.freeTierRemainingMs : null;

  const rows = useMemo(() => {
    const usage = Array.isArray(data?.usage) ? data.usage : [];
    return usage.slice(0, 50);
  }, [data?.usage]);

  return (
    <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing", href: "/pricing" }, { label: "Credits" }]}>
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Account</p>
        <h1 className="text-3xl font-semibold text-slate-900">Credits</h1>
        <p className="text-base text-slate-700">
          Free usage stays free. Credits only apply above free limits.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800">
            <div className="text-xs font-semibold text-slate-700">Balance</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{balance ?? "Sign in"}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800">
            <div className="text-xs font-semibold text-slate-700">Free remaining today</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{freeRemaining === null ? "Unknown" : fmtMs(freeRemaining)}</div>
          </div>
          <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Pricing
          </Link>
          <a
            href="/api/credits/usage/export"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Download usage CSV
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Credit lots</h2>
          <p className="mt-2 text-sm text-slate-700">Lots track where credits came from and how many remain.</p>
          {lots.length === 0 ? (
            <p className="mt-3 text-sm text-slate-700">No credit lots yet.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-slate-800">
              {lots.map((l: any) => (
                <li key={l.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                  <div className="font-semibold text-slate-900">{l.source}</div>
                  <div className="text-xs text-slate-700">
                    Remaining: {l.remainingCredits} / {l.amountCredits || l.credits} · Expires: {l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : "None"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Usage history</h2>
          <p className="mt-2 text-sm text-slate-700">Append-only ledger of tool runs and charges.</p>
          {rows.length === 0 ? (
            <p className="mt-3 text-sm text-slate-700">No usage yet.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-slate-800">
              {rows.map((r: any) => (
                <li key={r.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">{r.toolId}</div>
                    <div className="text-xs text-slate-700">{new Date(r.occurredAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-700">
                    Duration: {fmtMs(r.durationMs)} · Free: {fmtMs(r.freeTierAppliedMs)} · Paid: {fmtMs(r.paidMs)} · Charged: {r.actualCredits ?? r.consumed} credits
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </MarketingPageTemplate>
  );
}


