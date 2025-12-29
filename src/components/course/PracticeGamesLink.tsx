"use client";

import Link from "next/link";

interface PracticeGamesLinkProps {
  className?: string;
}

/**
 * Standardized component for linking to practice games from course summaries
 * Ensures consistent styling and messaging across all course pages
 */
export default function PracticeGamesLink({ className = "" }: PracticeGamesLinkProps) {
  return (
    <div className={`rounded-2xl border border-blue-200 bg-blue-50/50 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">More practice games</h3>
          <p className="text-sm text-slate-700">Explore all practice games including cybersecurity, digitalisation, data, software architecture, and cross-topic drills.</p>
        </div>
        <Link
          href="/practice"
          className="button secondary whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="View all practice games"
        >
          View All Practice Games →
        </Link>
      </div>
    </div>
  );
}

