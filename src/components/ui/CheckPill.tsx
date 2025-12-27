import React from "react";

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
  const padding = size === "xs" ? "px-3 py-2" : "px-3.5 py-2.5";
  const text = size === "xs" ? "text-[0.7rem]" : "text-xs";
  const toggle = size === "xs" ? "h-5 w-9" : "h-6 w-11";
  const knob = size === "xs" ? "h-4 w-4" : "h-5 w-5";
  const knobOn = size === "xs" ? "translate-x-4" : "translate-x-5";
  const knobOff = "translate-x-1";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cx(
        "inline-flex w-full items-center justify-between gap-3 rounded-2xl border transition",
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
      <span className="min-w-0">{children}</span>
      <span className="inline-flex shrink-0 items-center gap-2">
        {after ? <span className="shrink-0">{after}</span> : null}
        <span
          className={cx(
            "relative inline-flex items-center rounded-full border transition",
            toggle,
            checked ? cx(toneStyle.border, toneStyle.bg) : "border-slate-300 bg-slate-200",
            "dark:border-slate-600 dark:bg-slate-800"
          )}
          aria-hidden="true"
        >
          <span
            className={cx(
              "inline-block transform rounded-full bg-white shadow-sm transition",
              knob,
              checked ? knobOn : knobOff
            )}
          />
        </span>
      </span>
    </button>
  );
}
