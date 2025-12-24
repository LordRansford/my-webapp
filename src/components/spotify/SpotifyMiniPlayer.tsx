"use client";

import { useEffect, useState } from "react";

const KEY = "rn_spotify_enabled_v1";

export default function SpotifyMiniPlayer() {
  const [enabled, setEnabled] = useState(false);
  const embedUrl = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_SPOTIFY_EMBED_URL || "") : "";

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      setEnabled(raw === "1");
    } catch {
      setEnabled(false);
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      // ignore
    }
  };

  if (!embedUrl) return null;

  return (
    <div className="fixed bottom-4 left-4 z-30 max-w-[92vw]">
      <div className="rounded-2xl border border-[color:var(--line)] bg-[var(--surface)] p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-600">Music</p>
            <p className="m-0 text-sm font-semibold text-[var(--text-body)]">Spotify player</p>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-900 hover:border-slate-400"
            aria-pressed={enabled}
          >
            {enabled ? "Hide" : "Play"}
          </button>
        </div>
        {enabled ? (
          <div className="mt-3">
            <iframe
              title="Spotify player"
              src={embedUrl}
              width="320"
              height="152"
              style={{ borderRadius: 12, border: "0", width: "min(360px, 82vw)" }}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        ) : null}
        <p className="mt-2 mb-0 text-xs text-slate-600">Opt-in only. Does not affect sign in.</p>
      </div>
    </div>
  );
}


