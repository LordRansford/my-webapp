"use client";

/**
 * LegacyGames Component
 * 
 * NOTE: This component has been migrated to /practice page.
 * All practice games are now available at /practice with improved organization,
 * error handling, loading states, and accessibility features.
 * 
 * This component is kept for backward compatibility and redirects users to the new location.
 */

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LegacyGames() {
  return (
    <section aria-label="Practice games" className="mt-12">
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex-shrink-0">
            <Sparkles className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice Games</h2>
            <p className="text-base leading-relaxed text-slate-700 mb-4">
              All practice games have been moved to a dedicated page with improved organization, error handling, and accessibility. 
              Explore cybersecurity, digitalisation, data, software architecture, and cross-topic games in one place.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 transition-colors"
            >
              View All Practice Games
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


