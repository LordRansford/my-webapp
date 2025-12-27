import React from "react";
import { Check } from "lucide-react";

type Tone = "sky" | "emerald" | "violet" | "amber" | "rose" | "slate";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  after?: React.ReactNode;
  tone?: Tone;
  className?: string;
  size?: "sm" | "xs";
  disabled?: boolean;
};

const toneClasses: Record<Tone, { border: string; bg: string; ring: string }> = {
  sky: { border: "border-sky-400/40", bg: "bg-sky-500/15", ring: "focus-visible:ring-sky-300/40" },
  emerald: { border: "border-emerald-400/40", bg: "bg-emerald-500/15", ring: "focus-visible:ring-emerald-300/40" },
  violet: { border: "border-violet-400/40", bg: "bg-violet-500/15", ring: "focus-visible:ring-violet-300/40" },
  amber: { border: "border-amber-400/40", bg: "bg-amber-500/15", ring: "focus-visible:ring-amber-300/40" },
  rose: { border: "border-rose-400/40", bg: "bg-rose-500/15", ring: "focus-visible:ring-rose-300/40" },
  slate: { border: "border-slate-400/40", bg: "bg-slate-500/10", ring: "focus-visible:ring-slate-300/30" },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function CheckPill({
  checked,
  onCheckedChange,
  children,
  after,
  tone = "sky",
  className,
  size = "sm",
  disabled = false,
}: Props) {
  const toneStyle = toneClasses[tone] || toneClasses.sky;
  const padding = size === "xs" ? "px-2.5 py-1" : "px-3 py-1.5";
  const text = size === "xs" ? "text-[0.7rem]" : "text-xs";

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cx(
        "inline-flex w-full items-center justify-between gap-3 rounded-full border transition",
        padding,
        text,
        "bg-white/80 text-slate-900 hover:bg-white",
        "dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-900/60 dark:border-slate-700",
        checked ? cx(toneStyle.bg, toneStyle.border) : "border-slate-200",
        "focus-visible:outline-none focus-visible:ring-2",
        toneStyle.ring,
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        <span
          className={cx(
            "inline-flex h-5 w-5 items-center justify-center rounded-full border",
            checked ? cx(toneStyle.border, toneStyle.bg) : "border-slate-300 bg-white",
            "dark:border-slate-600 dark:bg-slate-900"
          )}
          aria-hidden="true"
        >
          {checked ? <Check className="h-3.5 w-3.5 text-slate-900 dark:text-slate-100" /> : null}
        </span>
        <span className="min-w-0">{children}</span>
      </span>
      {after ? <span className="shrink-0">{after}</span> : null}
    </button>
  );
}

