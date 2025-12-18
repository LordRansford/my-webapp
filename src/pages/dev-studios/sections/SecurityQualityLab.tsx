"use client";

import React, { useMemo, useState } from "react";
import { SecurityNotice } from "@/components/SecurityNotice";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { ShieldCheck, HeartPulse, AlertTriangle } from "lucide-react";

const secureCodingItems = [
  "Input validation at all trust boundaries",
  "Output encoding for anything rendered in a browser",
  "Authentication on sensitive routes",
  "Role based access control for admin operations",
  "Secrets in configuration, not in code",
  "Dependencies scanned regularly",
];

const qualityItems = [
  "Unit test coverage on critical modules",
  "Error handling and user friendly messages",
  "Timeouts and retries on network calls",
  "Rate limiting on public endpoints",
  "Feature flags for risky changes",
];

export default function SecurityQualityLab() {
  const [secureState, setSecureState] = useState<Record<string, boolean>>(
    Object.fromEntries(secureCodingItems.map((c) => [c, false]))
  );
  const [qualityState, setQualityState] = useState<Record<string, boolean>>(
    Object.fromEntries(qualityItems.map((c) => [c, false]))
  );

  const secureScore = useMemo(
    () => Math.round((Object.values(secureState).filter(Boolean).length / secureCodingItems.length) * 100),
    [secureState]
  );
  const qualityScore = useMemo(
    () => Math.round((Object.values(qualityState).filter(Boolean).length / qualityItems.length) * 100),
    [qualityState]
  );

  const readinessBadge = useMemo(() => {
    const avg = Math.round((secureScore + qualityScore) / 2);
    if (avg < 40) return { label: "Not ready", tone: "bg-rose-100 text-rose-800 ring-rose-200" };
    if (avg < 70) return { label: "Getting there", tone: "bg-amber-100 text-amber-800 ring-amber-200" };
    return { label: "Pretty solid", tone: "bg-emerald-100 text-emerald-800 ring-emerald-200" };
  }, [secureScore, qualityScore]);

  const fixOrder = useMemo(() => {
    if (secureScore < 50 && qualityScore >= 50) return "Security first: lock down auth, validation, and secrets.";
    if (qualityScore < 50 && secureScore >= 50) return "Quality first: add tests, error handling, and timeouts.";
    if (secureScore < 50 && qualityScore < 50) return "Start with security basics, then add tests and timeouts.";
    return "Polish both: monitor, refactor risky areas, and keep dependencies fresh.";
  }, [secureScore, qualityScore]);

  return (
    <div className="space-y-6">
      <SecurityNotice />
      <SecurityBanner />

      <div className="space-y-4 rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">1. Secure coding habits</h2>
        </div>
        <div className="space-y-2 text-sm text-slate-800">
          {secureCodingItems.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={secureState[c]}
                onChange={(e) => setSecureState((prev) => ({ ...prev, [c]: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>Secure coding score</span>
            <span>{secureScore}/100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className={`h-2 rounded-full transition-all ${
                secureScore < 40 ? "bg-rose-400" : secureScore < 80 ? "bg-amber-400" : "bg-emerald-500"
              }`}
              style={{ width: `${secureScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">
            {secureScore < 40
              ? "CIA says hi: confidentiality and integrity need love."
              : "Trust boundaries and threat modelling keep surprises away."}
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-sky-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">2. Quality and resilience checks</h2>
        </div>
        <div className="space-y-2 text-sm text-slate-800">
          {qualityItems.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={qualityState[c]}
                onChange={(e) => setQualityState((prev) => ({ ...prev, [c]: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>Quality and resilience score</span>
            <span>{qualityScore}/100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className={`h-2 rounded-full transition-all ${
                qualityScore < 40 ? "bg-rose-400" : qualityScore < 80 ? "bg-amber-400" : "bg-emerald-500"
              }`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1" role="status">
          <span className={readinessBadge.tone}>{readinessBadge.label}</span>
        </div>
        <p className="text-xs text-slate-600">
          Overall production readiness blends security hygiene with resilience. If either lags, prod will tell you the hard way.
        </p>
      </div>

      <div className="space-y-3 rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">3. What would I fix first</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{fixOrder}</p>
        <p className="text-xs text-slate-600">
          Borrowed from the notes: protect trust boundaries, keep a rollback plan, and make sure someone owns each surface.
        </p>
      </div>
    </div>
  );
}
