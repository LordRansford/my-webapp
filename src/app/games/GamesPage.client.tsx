"use client";

import SwStatusPill from "./SwStatus.client";
import DedicationBanner from "./DedicationBanner.client";
import GamesCards from "./GamesCards.client";
import LegacyGames from "./LegacyGames.client";
import { GameHubTemplate } from "@/components/templates/PageTemplates";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";

function GamesErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm" role="alert">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900">Games section unavailable</p>
          <p className="mt-2 text-sm text-red-700">
            This section could not be loaded. This might be a temporary issue. Other games sections should still work.
          </p>
          {process.env.NODE_ENV !== "production" && error && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-red-800">Technical details</summary>
              <pre className="mt-2 overflow-auto text-xs text-red-900">{error?.message || String(error)}</pre>
            </details>
          )}
        </div>
        <button
          onClick={resetErrorBoundary}
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          type="button"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function GamesPageClient() {
  return (
    <>
      <header className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-sm mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Games</p>
            <h1 className="text-4xl font-semibold text-slate-900 mb-3">Canvas-based action games</h1>
            <p className="text-base text-slate-700 leading-relaxed max-w-2xl">
              Offline-first PWA games with arrow keys and swipe support. Load once, then play offline. Perfect for practicing on the go.
            </p>
          </div>
          <div className="flex-shrink-0">
            <SwStatusPill />
          </div>
        </div>
      </header>

      <DedicationBanner />
      
      <ErrorBoundary FallbackComponent={GamesErrorFallback}>
        <GamesCards />
      </ErrorBoundary>

      {/* Legacy Games Section - redirects to /practice */}
      <ErrorBoundary FallbackComponent={GamesErrorFallback}>
        <LegacyGames />
      </ErrorBoundary>
    </>
  );
}

