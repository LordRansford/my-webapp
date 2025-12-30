"use client";

/**
 * Skeleton Loader Component
 * 
 * Provides elegant skeleton screens for loading states
 * Exceeds gold standard with smooth animations and accessibility
 */

import React, { memo, useMemo } from "react";

interface SkeletonLoaderProps {
  variant?: "text" | "card" | "list" | "grid";
  count?: number;
  className?: string;
  ariaLabel?: string;
}

const SkeletonLoader = memo(function SkeletonLoader({
  variant = "card",
  count = 1,
  className = "",
  ariaLabel = "Loading content"
}: SkeletonLoaderProps) {
  const skeletons = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  if (variant === "text") {
    return (
      <div className={`space-y-2 ${className}`} role="status" aria-label={ariaLabel} aria-live="polite">
        {skeletons.map((i) => (
          <div
            key={i}
            className="h-4 bg-slate-200 rounded animate-pulse"
            style={{
              width: i % 2 === 0 ? "100%" : "80%",
              animationDelay: `${i * 100}ms`
            }}
          />
        ))}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`space-y-3 ${className}`} role="status" aria-label={ariaLabel} aria-live="polite">
        {skeletons.map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`} role="status" aria-label={ariaLabel} aria-live="polite">
        {skeletons.map((i) => (
          <div
            key={i}
            className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 bg-slate-200 rounded animate-pulse w-5/6" />
            </div>
          </div>
        ))}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label={ariaLabel} aria-live="polite">
      {skeletons.map((i) => (
        <div
          key={i}
          className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-slate-200 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6" />
          </div>
        </div>
      ))}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
});

export default SkeletonLoader;



