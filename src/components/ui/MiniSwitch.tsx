"use client";

import React from "react";

type Tone = "slate" | "emerald" | "sky" | "amber" | "rose" | "indigo";

function trackClasses(tone: Tone, checked: boolean) {
  if (!checked) return "border-slate-300 bg-slate-200";
  if (tone === "emerald") return "border-emerald-700/20 bg-emerald-600";
  if (tone === "sky") return "border-sky-700/20 bg-sky-600";
  if (tone === "amber") return "border-amber-700/20 bg-amber-600";
  if (tone === "rose") return "border-rose-700/20 bg-rose-600";
  if (tone === "indigo") return "border-indigo-700/20 bg-indigo-600";
  return "border-slate-900/10 bg-slate-900";
}

export default function MiniSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  tone = "slate",
  ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  tone?: Tone;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${trackClasses(tone, checked)}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${checked ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

