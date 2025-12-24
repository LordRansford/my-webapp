"use client";

import Link from "next/link";
import NotesLayout from "@/components/notes/Layout";
import { PLAY_CATEGORIES, PLAY_GAMES } from "@/components/play/games";

export default function PlayPage() {
  return (
    <NotesLayout
      meta={{
        title: "Play",
        description: "Small games for a quick reset and short skill practice.",
        level: "Summary",
        slug: "/play",
        section: "ai",
      }}
      activeLevelId="summary"
      useAppShell
    >
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="eyebrow">Play</p>
          <h1 className="text-3xl font-semibold text-slate-900">Play hub</h1>
          <p className="text-slate-700 max-w-3xl">
            Small games for a quick reset and short skill practice. Each game explains what it is, how long it takes, and how to restart or leave.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">New</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Games</h2>
              <p className="mt-1 text-sm text-slate-700">
                The full games collection is now in the dedicated Games area.
              </p>
            </div>
            <Link className="button primary" href="/games">
              Go to Games
            </Link>
          </div>
        </section>

        <div className="grid gap-6">
          {PLAY_CATEGORIES.map((cat) => {
            const games = PLAY_GAMES.filter((g) => g.category === cat.id);
            if (games.length === 0) {
              return (
                <section key={cat.id} className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{cat.title}</h2>
                      <p className="text-sm text-slate-700">{cat.description}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">More games are being prepared for this section.</p>
                </section>
              );
            }

            return (
              <section key={cat.id} className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{cat.title}</h2>
                    <p className="text-sm text-slate-700">{cat.description}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {games.map((g) => (
                    <Link
                      key={g.id}
                      href={g.href}
                      className="group rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-950">{g.title}</h3>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{g.difficulty}</span>
                        </div>
                        <p className="text-sm text-slate-700">{g.purpose}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="rounded-full border border-slate-200 bg-white px-2 py-1">Estimated time: {g.estTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </NotesLayout>
  );
}


