"use client";

import Link from "next/link";
import GameHub from "@/components/games/GameHub";
import DigitalisationGameHub from "@/components/games/DigitalisationGameHub";
import CrossDomainGames from "@/components/CrossDomainGames";
import { Shield, TrendingUp, Network, Sparkles, Gamepad2, Brain } from "lucide-react";

export default function PracticeGamesPageClient() {
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
        <div className="group">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-md transition-transform duration-300 group-hover:scale-110">
              <Shield className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Cybersecurity</h2>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-red-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <GameHub />
          </div>
          <div className="mt-3 text-sm text-slate-600">
            <Link href="/cybersecurity/summary" className="text-blue-700 hover:text-blue-900 underline">
              More cybersecurity games in the course summary →
            </Link>
          </div>
        </div>

        {/* Digitalisation Section */}
        <div className="group">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Digitalisation</h2>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-emerald-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <DigitalisationGameHub />
          </div>
          <div className="mt-3 text-sm text-slate-600">
            <Link href="/digitalisation/summary" className="text-blue-700 hover:text-blue-900 underline">
              More digitalisation games in the course summary →
            </Link>
          </div>
        </div>

        {/* Cross Topic Section */}
        <div className="group">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md transition-transform duration-300 group-hover:scale-110">
              <Network className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Cross Topic</h2>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <CrossDomainGames />
          </div>
        </div>
      </div>

      {/* Cross-links to other game sections */}
      <div className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Explore other game types</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/games"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
              <Gamepad2 className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900 group-hover:text-blue-700">Action Games</div>
              <div className="text-sm text-slate-600">Canvas-based offline games with arrow keys and swipe support</div>
            </div>
            <span className="text-blue-700 group-hover:text-blue-900" aria-hidden="true">→</span>
          </Link>
          <Link
            href="/play"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
              <Brain className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900 group-hover:text-blue-700">Play Hub</div>
              <div className="text-sm text-slate-600">Cognitive training games for focus and mental skills</div>
            </div>
            <span className="text-blue-700 group-hover:text-blue-900" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </>
  );
}

