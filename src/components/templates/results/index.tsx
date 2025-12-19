"use client";

import React from "react";

export function ScoreCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {subtitle ? <p className="text-sm text-slate-700">{subtitle}</p> : null}
    </div>
  );
}

export function RiskBadge({ band }: { band?: string }) {
  const color =
    band === "Critical" ? "bg-rose-100 text-rose-800" : band === "High" ? "bg-amber-100 text-amber-800" : band === "Moderate" ? "bg-yellow-100 text-yellow-800" : "bg-emerald-100 text-emerald-800";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
      {band || "Not rated"}
    </span>
  );
}

export function ConfidenceChip({ confidence }: { confidence?: string }) {
  if (!confidence) return null;
  return <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">Confidence: {confidence}</span>;
}

export function AssumptionsPanel({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-sm font-semibold text-slate-900">Assumptions</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExplanationBlock({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Explanation</p>
      <p className="mt-1 text-sm text-slate-700 leading-relaxed">{text}</p>
    </div>
  );
}

export function NextStepsPanel({ steps }: { steps: string[] }) {
  if (!steps.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Next steps</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
