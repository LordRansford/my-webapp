"use client";

import GameHub from "@/components/games/GameHub";
import DigitalisationGameHub from "@/components/games/DigitalisationGameHub";
import CrossDomainGames from "@/components/CrossDomainGames";
import { Shield, TrendingUp, Network, Sparkles } from "lucide-react";

export default function LegacyGames() {
  return (
    <section aria-label="More practice games" className="mt-12 space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-white p-8 shadow-lg backdrop-blur-sm">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Practice Games</h2>
          </div>
          <p className="text-base leading-relaxed text-slate-700">
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
            <h3 className="text-2xl font-bold text-slate-900">Cybersecurity</h3>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-red-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <GameHub />
          </div>
        </div>

        {/* Digitalisation Section */}
        <div className="group">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Digitalisation</h3>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-emerald-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <DigitalisationGameHub />
          </div>
        </div>

        {/* Cross Topic Section */}
        <div className="group">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md transition-transform duration-300 group-hover:scale-110">
              <Network className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Cross Topic</h3>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <CrossDomainGames />
          </div>
        </div>
      </div>
    </section>
  );
}


