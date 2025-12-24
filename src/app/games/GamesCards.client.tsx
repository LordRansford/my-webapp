"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PersistStore } from "@/games/engine/persist";
import { createGamesProgressStore } from "@/games/progress";
import { GAMES } from "@/games/registry";
import { utcDateId } from "@/games/seed";
import { GAMES_COPY } from "@/games/dedication";

export default function GamesCards() {
  const store = useMemo(() => new PersistStore({ prefix: "rn_games", version: "v1" }), []);
  const progress = useMemo(() => createGamesProgressStore(store), [store]);
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [today, setToday] = useState<string | null>(null);
  const [todayDaily, setTodayDaily] = useState(() => ({ completed: false, attempted: false }));

  useEffect(() => {
    const t = utcDateId();
    setToday(t);
    setUnlocked(progress.get().charisTrophyUnlocked);
    setTodayDaily(progress.getDaily(t));
    setHydrated(true);

    const refresh = () => {
      setUnlocked(progress.get().charisTrophyUnlocked);
      setTodayDaily(progress.getDaily(t));
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [progress]);

  const visible = useMemo(() => {
    return GAMES.filter((g) => {
      if (!g.hidden) return true;
      if (g.requiresCharisTrophy) return unlocked;
      return false;
    });
  }, [unlocked]);

  const flagship = useMemo(() => visible.filter((g) => ["pulse-runner", "skyline-drift", "vault-circuit"].includes(g.id)), [visible]);
  const rest = useMemo(() => visible.filter((g) => !["pulse-runner", "skyline-drift", "vault-circuit"].includes(g.id)), [visible]);

  if (!hydrated || !today) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 rounded bg-slate-200" />
        <div className="h-4 w-48 rounded bg-slate-200" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-label="Featured games">
        <h2 className="text-lg font-semibold text-slate-900">Featured</h2>
        <p className="mt-1 text-sm text-slate-700">Three flagship games. Start here.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flagship.map((g) => (
            <div key={g.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{g.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{g.difficulty}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{g.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="button primary" href={`/games/${g.id}`}>Play</Link>
                <Link className="button secondary" href={`/games/${g.id}#how-to-play`}>How to play</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {rest.length ? (
        <section aria-label="More games">
          <h2 className="text-lg font-semibold text-slate-900">More</h2>
          <p className="mt-1 text-sm text-slate-700">Daily runs, unlocks, and extras.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((g) => (
              <div key={g.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{g.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{g.difficulty}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{g.blurb}</p>
                {g.id === "daily" ? (
                  <p className="mt-2 text-xs font-semibold text-slate-600">
                    {GAMES_COPY.dailyChallengeLabel} - {today} {todayDaily.completed ? "• Completed" : todayDaily.attempted ? `• ${GAMES_COPY.dailyAttemptUsedLabel}` : ""}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="button primary" href={`/games/${g.id}`}>Play</Link>
                  <Link className="button secondary" href={`/games/${g.id}#how-to-play`}>How to play</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}


