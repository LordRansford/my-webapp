import React from "react";
import { formatPercentage, formatScore } from "@/utils/templateMath";

type CalculatedFieldProps = {
  label: string;
  value: number | string;
  suffix?: string;
  description?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  format?: "percentage" | "score" | "plain";
};

const tones: Record<string, string> = {
  neutral: "text-slate-900 bg-slate-50 border-slate-100",
  success: "text-emerald-900 bg-emerald-50 border-emerald-100",
  warning: "text-amber-900 bg-amber-50 border-amber-100",
  danger: "text-rose-900 bg-rose-50 border-rose-100",
};

export function CalculatedField({ label, value, suffix, description, tone = "neutral", format = "plain" }: CalculatedFieldProps) {
  const formatted =
    format === "percentage" ? formatPercentage(value) : format === "score" ? formatScore(value) : `${value}${suffix ? ` ${suffix}` : ""}`;

  return (
    <div className={`space-y-1 rounded-2xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <span className="text-lg font-bold">{formatted}</span>
      </div>
      {description && <p className="text-xs text-slate-700">{description}</p>}
    </div>
  );
}

export default CalculatedField;
