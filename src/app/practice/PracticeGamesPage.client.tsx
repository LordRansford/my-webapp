"use client";

import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Shield, TrendingUp, Network, Database, Layers, Sparkles, Gamepad2, Brain } from "lucide-react";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";

// Dynamic imports with loading states
const GameHub = dynamic(() => import("@/components/games/GameHub"), {
  ssr: false,
  loading: () => <GameSectionSkeleton />,
});

const DigitalisationGameHub = dynamic(() => import("@/components/games/DigitalisationGameHub"), {
  ssr: false,
  loading: () => <GameSectionSkeleton />,
});

const CrossDomainGames = dynamic(() => import("@/components/CrossDomainGames"), {
  ssr: false,
  loading: () => <GameSectionSkeleton />,
});

const DataSummaryGameHub = dynamic(() => import("@/components/notes/summary/DataSummaryGameHub"), {
  ssr: false,
  loading: () => <GameSectionSkeleton />,
});

// Software Architecture games are tools, not a hub component, so we'll link to the summary
// They're integrated into the summary page directly

function GameSectionSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/30 to-white p-6 shadow-md animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="h-32 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
}

function GameErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm" role="alert">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900">Game section unavailable</p>
          <p className="mt-2 text-sm text-red-700">
            This game section could not be loaded. Other sections should still work.
          </p>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          type="button"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

function PracticeGamesContent() {
  // Handle smooth scrolling to anchor links on page load
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  return <PracticeGamesContentInner />;
}

function PracticeGamesContentInner() {
  return (
    <>
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-white p-8 shadow-lg backdrop-blur-sm mb-8">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Practice Games</h1>
          </div>
          <p className="text-base leading-relaxed text-slate-700 max-w-2xl">
            Lightweight interactive drills from across the site to reinforce learning. Build skills through hands-on practice.
          </p>
        </div>
      </header>

      <div className="space-y-8">
        {/* Cybersecurity Section */}
        <section id="cybersecurity" className="scroll-mt-8">
          <div className="group">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-md transition-transform duration-300 group-hover:scale-110">
                <Shield className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Cybersecurity</h2>
            </div>
            <ErrorBoundary FallbackComponent={GameErrorFallback}>
              <Suspense fallback={<GameSectionSkeleton />}>
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-red-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <GameHub />
                </div>
              </Suspense>
            </ErrorBoundary>
            <div className="mt-3 text-sm text-slate-600">
              <Link href="/cybersecurity/summary" className="text-blue-700 hover:text-blue-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
                More cybersecurity games in the course summary →
              </Link>
            </div>
          </div>
        </section>

        {/* Digitalisation Section */}
        <section id="digitalisation" className="scroll-mt-8">
          <div className="group">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md transition-transform duration-300 group-hover:scale-110">
                <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Digitalisation</h2>
            </div>
            <ErrorBoundary FallbackComponent={GameErrorFallback}>
              <Suspense fallback={<GameSectionSkeleton />}>
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-emerald-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <DigitalisationGameHub />
                </div>
              </Suspense>
            </ErrorBoundary>
            <div className="mt-3 text-sm text-slate-600">
              <Link href="/digitalisation/summary" className="text-blue-700 hover:text-blue-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
                More digitalisation games in the course summary →
              </Link>
            </div>
          </div>
        </section>

        {/* Data Section */}
        <section id="data" className="scroll-mt-8">
          <div className="group">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md transition-transform duration-300 group-hover:scale-110">
                <Database className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Data</h2>
            </div>
            <ErrorBoundary FallbackComponent={GameErrorFallback}>
              <Suspense fallback={<GameSectionSkeleton />}>
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-blue-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <DataSummaryGameHub />
                </div>
              </Suspense>
            </ErrorBoundary>
            <div className="mt-3 text-sm text-slate-600">
              <Link href="/data/summary" className="text-blue-700 hover:text-blue-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
                More data games in the course summary →
              </Link>
            </div>
          </div>
        </section>

        {/* Software Architecture Section */}
        <section id="software-architecture" className="scroll-mt-8">
          <div className="group">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md transition-transform duration-300 group-hover:scale-110">
                <Layers className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Software Architecture</h2>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-purple-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="text-center py-8">
                <p className="text-base text-slate-700 mb-4">
                  Software architecture games are integrated directly into the course summary page.
                </p>
                <Link
                  href="/software-architecture/summary"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 transition-colors"
                >
                  View Architecture Games
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              <Link href="/software-architecture/summary" className="text-blue-700 hover:text-blue-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
                Explore architecture games and labs in the course summary →
              </Link>
            </div>
          </div>
        </section>

        {/* Cross Topic Section */}
        <section id="cross-topic" className="scroll-mt-8">
          <div className="group">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md transition-transform duration-300 group-hover:scale-110">
                <Network className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Cross Topic</h2>
            </div>
            <ErrorBoundary FallbackComponent={GameErrorFallback}>
              <Suspense fallback={<GameSectionSkeleton />}>
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <CrossDomainGames />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      </div>

      {/* Cross-links to other game sections */}
      <section className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Explore other game types</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/games"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
            aria-label="View action games"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md flex-shrink-0">
              <Gamepad2 className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 group-hover:text-blue-700">Action Games</div>
              <div className="text-sm text-slate-600">Canvas-based offline games with arrow keys and swipe support</div>
            </div>
            <span className="text-blue-700 group-hover:text-blue-900 flex-shrink-0" aria-hidden="true">→</span>
          </Link>
          <Link
            href="/play"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
            aria-label="View cognitive training games"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md flex-shrink-0">
              <Brain className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 group-hover:text-blue-700">Play Hub</div>
              <div className="text-sm text-slate-600">Cognitive training games for focus and mental skills</div>
            </div>
            <span className="text-blue-700 group-hover:text-blue-900 flex-shrink-0" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

export default function PracticeGamesPageClient() {
  return (
    <Suspense fallback={<PracticeGamesPageSkeleton />}>
      <PracticeGamesContent />
    </Suspense>
  );
}

function PracticeGamesPageSkeleton() {
  return (
    <>
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-white p-8 shadow-lg backdrop-blur-sm mb-8 animate-pulse">
        <div className="h-12 bg-slate-200 rounded w-64 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-96"></div>
      </header>
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
            <div className="h-32 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    </>
  );
}
