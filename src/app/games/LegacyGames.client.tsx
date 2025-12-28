"use client";

import GameHub from "@/components/games/GameHub";
import DigitalisationGameHub from "@/components/games/DigitalisationGameHub";
import CrossDomainGames from "@/components/CrossDomainGames";

export default function LegacyGames() {
  return (
    <section aria-label="More practice games" className="space-y-6 mt-10">
      <header className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Practice Games</h2>
        <p className="mt-2 text-base text-slate-700">
          Lightweight interactive drills from across the site to reinforce learning.
        </p>
      </header>

      <div className="space-y-10">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Cybersecurity</h3>
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-4">
            <GameHub />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Digitalisation</h3>
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-4">
            <DigitalisationGameHub />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Cross Topic</h3>
          <div className="rounded-2xl border border-slate-200 bg-white/50 p-4">
            <CrossDomainGames />
          </div>
        </div>
      </div>
    </section>
  );
}


