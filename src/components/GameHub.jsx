"use client";

import { useEffect, useMemo, useState } from "react";

export default function GameHub({ storageKey, title, subtitle, games }) {
  const [active, setActive] = useState(null);

  const gameIds = useMemo(() => new Set((games || []).map((g) => g.id)), [games]);

  const setHashGame = (gameId) => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      if (gameId) params.set("game", gameId);
      else params.delete("game");
      const next = params.toString();
      window.history.replaceState(null, "", next ? `#${next}` : window.location.pathname + window.location.search);
    } catch {
      // ignore hash write failures so the UI keeps working
    }
  };

  const open = (id) => {
    setActive(id);
    setHashGame(id);
    if (storageKey && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : { events: [] };
        parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
        parsed.events.push({ type: "game_opened", game: id, at: Date.now() });
        window.localStorage.setItem(storageKey, JSON.stringify(parsed));
      } catch {
        // ignore storage errors so the UI keeps working
      }
    }
  };

  const close = () => {
    setActive(null);
    setHashGame(null);
  };

  const activeGame = (games || []).find((g) => g.id === active);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const gameFromHash = params.get("game");
      if (gameFromHash && gameIds.has(gameFromHash)) setActive(gameFromHash);
    } catch {
      // ignore hash read failures
    }
  }, [gameIds]);

  return (
    <section className="space-y-4">
      {title ? (
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-700">{subtitle}</p> : null}
        </header>
      ) : subtitle ? (
        <p className="text-sm text-slate-700">{subtitle}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(games || []).map((g) => (
          <a
            key={g.id}
            href={`#game=${encodeURIComponent(g.id)}`}
            className={`group rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              active === g.id ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200"
            }`}
            onClick={(e) => {
              e.preventDefault();
              open(g.id);
            }}
            aria-label={`Play ${g.title}`}
          >
            <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">{g.level}</span>
                <span className="text-slate-500">|</span>
                <span>{g.minutes} min</span>
              </span>
              <span className="inline-flex items-center gap-2 text-blue-700 group-hover:text-blue-900">
                Open <span aria-hidden="true">-&gt;</span>
              </span>
            </div>
            <div className="mt-3 text-base font-semibold text-slate-900">{g.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">{g.summary}</div>
          </a>
        ))}
      </div>

      {activeGame ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Now playing</div>
              <div className="mt-1 text-lg font-semibold text-slate-900 break-words">{activeGame.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                type="button"
                onClick={async () => {
                  if (typeof window === "undefined") return;
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                  } catch {
                    // ignore clipboard failures
                  }
                }}
              >
                Copy link
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                type="button"
                onClick={close}
              >
                Close
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 break-words">{activeGame.component}</div>
        </div>
      ) : null}
    </section>
  );
}
