"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { getStandaloneGamesRegistry } from "@/lib/catalog";

type Tone = "slate" | "emerald" | "indigo" | "amber" | "rose";

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : tone === "indigo"
      ? "bg-indigo-50 text-indigo-800 ring-indigo-100"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 ring-amber-100"
      : tone === "rose"
      ? "bg-rose-50 text-rose-800 ring-rose-100"
      : "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass}`}>{children}</span>;
}

export default function StandaloneGamesHubClient() {
  const all = useMemo(() => getStandaloneGamesRegistry(), []);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"all" | "games" | "play">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((g) => {
        if (source !== "all" && g.source !== source) return false;
        if (!q) return true;
        const hay = `${g.title} ${g.description}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [all, query, source]);

  return (
    <section className="section" aria-label="Standalone games list">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Standalone games</p>
          <h2>20 games, no course dependencies</h2>
          <p className="lead">A curated set of lightweight games and puzzles you can play directly.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            aria-label="Search games"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-72"
          />
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            aria-label="Filter games by source"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-56"
          >
            <option value="all">All ({all.length})</option>
            <option value="games">Games ({all.filter((g) => g.source === "games").length})</option>
            <option value="play">Play ({all.filter((g) => g.source === "play").length})</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <Link
            key={g.id}
            href={g.href}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            aria-label={`Play: ${g.title}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="m-0 text-base font-semibold text-slate-900 truncate">{g.title}</p>
                <p className="mt-1 text-sm text-slate-700 line-clamp-2">{g.description}</p>
              </div>
              <span className="text-sm font-semibold text-slate-900" aria-hidden="true">
                Play →
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="slate">{g.source === "play" ? "Play" : "Games"}</Badge>
              <Badge tone="indigo">{g.minutes} min</Badge>
              <Badge>{g.difficulty}</Badge>
              {(g.badges || [])
                .filter((b) => b.label !== "Games" && b.label !== "Play" && !b.label.endsWith(" min"))
                .slice(0, 1)
                .map((b) => (
                  <Badge key={b.label} tone={(b.tone as Tone) || "slate"}>
                    {b.label}
                  </Badge>
                ))}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700" role="status" aria-live="polite">
          No games match your search/filter.
        </div>
      ) : null}
    </section>
  );
}

