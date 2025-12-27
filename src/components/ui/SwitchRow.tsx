"use client";

import React from "react";

type Tone = "slate" | "emerald" | "sky" | "amber" | "rose" | "indigo";

function toneClasses(tone: Tone, checked: boolean) {
  if (!checked) return "border-slate-200 bg-white text-slate-900 hover:bg-slate-50";
  if (tone === "emerald") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (tone === "sky") return "border-sky-200 bg-sky-50 text-sky-900";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-950";
  if (tone === "rose") return "border-rose-200 bg-rose-50 text-rose-950";
  if (tone === "indigo") return "border-indigo-200 bg-indigo-50 text-indigo-950";
  return "border-slate-200 bg-slate-50 text-slate-900";
}

function trackClasses(tone: Tone, checked: boolean) {
  if (!checked) return "border-slate-300 bg-slate-200";
  if (tone === "emerald") return "border-emerald-700/20 bg-emerald-600";
  if (tone === "sky") return "border-sky-700/20 bg-sky-600";
  if (tone === "amber") return "border-amber-700/20 bg-amber-600";
  if (tone === "rose") return "border-rose-700/20 bg-rose-600";
  if (tone === "indigo") return "border-indigo-700/20 bg-indigo-600";
  return "border-slate-900/10 bg-slate-900";
}

export default function SwitchRow({
  label,
  description,
  leading,
  checked,
  onCheckedChange,
  disabled = false,
  tone = "slate",
  className = "",
}: {
  label: string;
  description?: string;
  leading?: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  tone?: Tone;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${toneClasses(tone, checked)} ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-start gap-3">
          {leading ? (
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700" aria-hidden="true">
              {leading}
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug">{label}</p>
            {description ? <p className="mt-1 text-xs text-slate-700">{description}</p> : null}
          </div>
        </div>
        <span
          aria-hidden="true"
          className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${trackClasses(tone, checked)}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${checked ? "translate-x-5" : "translate-x-1"}`} />
        </span>
      </div>
    </button>
  );
}
