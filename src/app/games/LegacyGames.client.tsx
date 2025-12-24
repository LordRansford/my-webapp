"use client";

import GameHub from "@/components/games/GameHub";
import DigitalisationGameHub from "@/components/games/DigitalisationGameHub";
import CrossDomainGames from "@/components/CrossDomainGames";

export default function LegacyGames() {
  return (
    <section aria-label="More practice games" className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">More practice games</h2>
        <p className="mt-1 text-sm text-slate-700">
          These are lightweight interactive drills from the rest of the site.
        </p>
      </header>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Cybersecurity</h3>
          <div className="mt-3">
            <GameHub />
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">Digitalisation</h3>
          <div className="mt-3">
            <DigitalisationGameHub />
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">Cross topic</h3>
          <div className="mt-3">
            <CrossDomainGames />
          </div>
        </div>
      </div>
    </section>
  );
}


