import SwStatusPill from "./SwStatus.client";
import DedicationBanner from "./DedicationBanner.client";
import GamesCards from "./GamesCards.client";
import LegacyGames from "./LegacyGames.client";
import { GameHubTemplate } from "@/components/templates/PageTemplates";

export const metadata = {
  title: "Games",
  description: "Offline-friendly mini games.",
};

export default function GamesHubPage() {
  return (
    <GameHubTemplate>
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Games</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Offline-friendly mini games</h1>
            <p className="mt-2 text-slate-700">Load once, then play offline. Arrow keys and swipe gestures supported.</p>
          </div>
          <SwStatusPill />
        </div>
      </header>

      <DedicationBanner />
      <GamesCards />
      <LegacyGames />
    </GameHubTemplate>
  );
}


