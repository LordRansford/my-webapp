import React from "react";

type Props = {
  label: string;
  value: number | string;
  tone?: "neutral" | "success" | "warning" | "danger";
  helper?: string;
};

const toneClass: Record<string, string> = {
  neutral: "bg-slate-50 border-slate-200 text-slate-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  danger: "bg-rose-50 border-rose-200 text-rose-900",
};

export default function ScoreCard({ label, value, tone = "neutral", helper }: Props) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClass[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <span className="text-xl font-bold">{value}</span>
      </div>
      {helper && <p className="text-xs text-slate-700 mt-1">{helper}</p>}
    </div>
  );
}
