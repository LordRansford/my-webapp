import Link from "next/link";
import SwStatusPill from "./SwStatus.client";

export const metadata = {
  title: "Games",
  description: "Offline-friendly mini games.",
};

const games = [
  { slug: "pulse-runner", title: "Pulse Runner", difficulty: "Easy", blurb: "Warm up timing and rhythm with simple dodges." },
  { slug: "skyline-drift", title: "Skyline Drift", difficulty: "Normal", blurb: "Smooth turns and clean lines. Keep momentum." },
  { slug: "vault-circuit", title: "Vault Circuit", difficulty: "Hard", blurb: "Tighter windows and faster patterns." },
];

export default function GamesHubPage() {
  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-6">
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

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <div key={g.slug} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{g.title}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{g.difficulty}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{g.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="button primary" href={`/games/${g.slug}`}>Play</Link>
              <Link className="button secondary" href={`/games/${g.slug}#how-to-play`}>How to play</Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}


