import React from "react";

type Props = {
  band?: string;
};

const tone: Record<string, string> = {
  High: "bg-rose-100 text-rose-900 ring-rose-200",
  Medium: "bg-amber-100 text-amber-900 ring-amber-200",
  Low: "bg-emerald-100 text-emerald-900 ring-emerald-200",
};

export default function RiskBadge({ band }: Props) {
  const label = band || "Unrated";
  const classes = tone[band || ""] || "bg-slate-100 text-slate-900 ring-slate-200";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${classes}`}>
      <span aria-hidden="true">●</span>
      {label}
    </span>
  );
}
