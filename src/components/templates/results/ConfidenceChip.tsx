import React from "react";

type Props = {
  value: number;
};

export default function ConfidenceChip({ value }: Props) {
  const pct = Math.min(Math.max(Math.round(value), 0), 100);
  const tone = pct >= 70 ? "bg-emerald-100 text-emerald-900 ring-emerald-200" : pct >= 40 ? "bg-amber-100 text-amber-900 ring-amber-200" : "bg-slate-100 text-slate-900 ring-slate-200";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tone}`}>
      <span aria-hidden="true">★</span>
      Confidence {pct}%
    </span>
  );
}
