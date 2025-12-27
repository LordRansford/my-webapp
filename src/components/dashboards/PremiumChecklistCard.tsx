"use client";

import { ReactNode } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface PremiumChecklistCardProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
  tone?: "sky" | "emerald" | "violet" | "amber" | "rose" | "slate";
  disabled?: boolean;
  description?: string;
}

const toneStyles = {
  sky: {
    border: "border-sky-200",
    bg: "bg-sky-50/50",
    checkedBorder: "border-sky-400",
    checkedBg: "bg-sky-50",
    icon: "text-sky-600",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "bg-emerald-50/50",
    checkedBorder: "border-emerald-400",
    checkedBg: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  violet: {
    border: "border-violet-200",
    bg: "bg-violet-50/50",
    checkedBorder: "border-violet-400",
    checkedBg: "bg-violet-50",
    icon: "text-violet-600",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-amber-50/50",
    checkedBorder: "border-amber-400",
    checkedBg: "bg-amber-50",
    icon: "text-amber-600",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-rose-50/50",
    checkedBorder: "border-rose-400",
    checkedBg: "bg-rose-50",
    icon: "text-rose-600",
  },
  slate: {
    border: "border-slate-200",
    bg: "bg-slate-50/50",
    checkedBorder: "border-slate-400",
    checkedBg: "bg-slate-50",
    icon: "text-slate-600",
  },
};

export function PremiumChecklistCard({
  checked,
  onCheckedChange,
  children,
  tone = "slate",
  disabled = false,
  description,
}: PremiumChecklistCardProps) {
  const style = toneStyles[tone];

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`
        group relative flex items-start gap-3 rounded-xl border p-4 text-left
        transition-all duration-200
        ${checked ? `${style.checkedBorder} ${style.checkedBg} shadow-sm` : `${style.border} ${style.bg}`}
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:shadow-md hover:border-opacity-60"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${checked ? `focus-visible:ring-${tone}-300` : "focus-visible:ring-slate-300"}
      `}
    >
      <div className="flex-shrink-0 pt-0.5">
        {checked ? (
          <CheckCircle2 className={`h-5 w-5 ${style.icon}`} aria-hidden="true" />
        ) : (
          <Circle className="h-5 w-5 text-slate-400 group-hover:text-slate-600" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900">{children}</div>
        {description && (
          <div className="mt-1 text-xs text-slate-600 leading-relaxed">{description}</div>
        )}
      </div>
    </button>
  );
}

