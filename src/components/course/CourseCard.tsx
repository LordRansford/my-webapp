"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface CourseCardProps {
  href: string;
  title: string;
  description?: string;
  summary?: string;
  label?: string;
  badge?: string;
  estimatedHours?: number;
  progress?: {
    percent: number;
    label?: string;
  };
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Premium course card component with consistent styling,
 * hover states, progress indicators, and metadata support.
 */
export default function CourseCard({
  href,
  title,
  description,
  summary,
  label,
  badge,
  estimatedHours,
  progress,
  icon,
  className = "",
  children,
}: CourseCardProps) {
  const displayDescription = description || summary || "";

  return (
    <Link
      href={href}
      className={`course-card group flex flex-col h-full rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm
        transition-all duration-200 ease-out
        hover:border-blue-300 hover:shadow-md hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:bg-slate-800/90 dark:border-slate-700 dark:hover:border-blue-500 ${className}`}
      aria-label={`${title}${displayDescription ? `: ${displayDescription}` : ""}`}
    >
      {/* Meta section with label/badge */}
      {(label || badge) && (
        <div className="course-card__meta flex items-center gap-2 mb-3">
          {label && (
            <span className="chip chip--accent text-xs font-semibold">
              {label}
            </span>
          )}
          {badge && (
            <span className="chip chip--ghost text-xs">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Icon (optional) */}
      {icon && (
        <div className="mb-3 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>

      {/* Description/Summary */}
      {displayDescription && (
        <p className="text-sm text-slate-700 mb-4 flex-1 dark:text-slate-300">
          {displayDescription}
        </p>
      )}

      {/* Progress indicator (optional) */}
      {progress && (
        <div className="mb-4" role="group" aria-label={`${title} progress`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1 dark:text-slate-400">
            <span>{progress.label || "Progress"}</span>
            <span aria-label={`${progress.percent} percent complete`}>
              {progress.percent}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700" aria-hidden="true">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Estimated hours (optional) */}
      {estimatedHours !== undefined && (
        <div className="mb-4">
          <span className="chip chip--ghost text-xs">
            {estimatedHours} {estimatedHours === 1 ? "hour" : "hours"}
          </span>
        </div>
      )}

      {/* Custom children content */}
      {children}

      {/* Footer with link indicator */}
      <div className="course-card__footer flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400 transition-colors">
          Open notes
        </span>
        <span className="text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400 transition-colors" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}

