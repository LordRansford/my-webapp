"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface CourseHeroSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights?: Array<{ chip: string; text: string }>;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryActions?: Array<{
    label: string;
    href: string;
  }>;
  icon?: ReactNode;
  gradient?: "blue" | "green" | "purple" | "amber" | "indigo";
  className?: string;
}

const gradientClasses = {
  blue: "from-white via-sky-50 to-indigo-50/60",
  green: "from-white via-emerald-50 to-teal-50/60",
  purple: "from-white via-purple-50 to-pink-50/60",
  amber: "from-white via-amber-50 to-orange-50/60",
  indigo: "from-white via-indigo-50 to-blue-50/60",
};

/**
 * Premium hero section component for course overview pages.
 * Provides consistent hero styling with gradient backgrounds, CTAs, and highlights.
 */
export default function CourseHeroSection({
  eyebrow,
  title,
  description,
  highlights = [],
  primaryAction,
  secondaryActions = [],
  icon,
  gradient = "blue",
  className = "",
}: CourseHeroSectionProps) {
  return (
    <div
      className={`not-prose relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br ${gradientClasses[gradient]} p-6 shadow-sm mb-8 ${className} dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/80`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200/40 to-sky-200/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 -bottom-24 h-56 w-56 rounded-full bg-gradient-to-br from-amber-200/30 to-indigo-200/20 blur-3xl" />
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        {icon && (
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            role="img"
            aria-label={`${eyebrow} icon`}
          >
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="eyebrow m-0 text-slate-600 dark:text-slate-400">{eyebrow}</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        </div>
      </div>

      <div className="text-base text-slate-700 leading-relaxed mb-4 dark:text-slate-300">
        {description}
      </div>

      {highlights.length > 0 && (
        <ul className="mt-4 grid gap-2 text-[0.98rem] text-slate-700 leading-relaxed dark:text-slate-300">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="chip chip--accent text-xs">{highlight.chip}</span>
              <span>{highlight.text}</span>
            </li>
          ))}
        </ul>
      )}

      {(primaryAction || secondaryActions.length > 0) && (
        <div className="actions mt-6 flex flex-wrap gap-3">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="button primary"
              aria-label={`Primary action: ${primaryAction.label}`}
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="button ghost"
              aria-label={`Secondary action: ${action.label}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

