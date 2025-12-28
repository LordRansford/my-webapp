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
      <div className="space-y-8 animate-pulse">
        <section aria-label="Featured games">
          <div className="h-7 w-32 rounded bg-slate-200 mb-2" />
          <div className="h-4 w-48 rounded bg-slate-200 mb-4" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section aria-label="Featured games" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Featured</h2>
          <p className="mt-2 text-base text-slate-700">Three flagship games. Start here.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {flagship.map((g) => (
            <div 
              key={g.id} 
              className="group rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-xl font-semibold text-slate-900">{g.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
                  {g.difficulty}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{g.blurb}</p>
              <div className="flex flex-wrap gap-2">
                <Link 
                  className="button primary inline-flex items-center justify-center min-w-[100px]" 
                  href={`/games/${g.id}`}
                >
                  Play
                </Link>
                <Link 
                  className="button secondary inline-flex items-center justify-center" 
                  href={`/games/${g.id}#how-to-play`}
                >
                  How to play
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {rest.length > 0 && (
        <section aria-label="More games" className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">More</h2>
            <p className="mt-2 text-base text-slate-700">Daily runs, unlocks, and extras.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((g) => (
              <div 
                key={g.id} 
                className="group rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-slate-900">{g.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
                    {g.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{g.blurb}</p>
                {g.id === "daily" && (
                  <p className="text-xs font-semibold text-emerald-700 mb-4 py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    {GAMES_COPY.dailyChallengeLabel} - {today} {todayDaily.completed ? "• Completed" : todayDaily.attempted ? `• ${GAMES_COPY.dailyAttemptUsedLabel}` : ""}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Link 
                    className="button primary inline-flex items-center justify-center min-w-[100px]" 
                    href={`/games/${g.id}`}
                  >
                    Play
                  </Link>
                  <Link 
                    className="button secondary inline-flex items-center justify-center" 
                    href={`/games/${g.id}#how-to-play`}
                  >
                    How to play
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


