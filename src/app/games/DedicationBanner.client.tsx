"use client";

import { useEffect, useMemo, useState } from "react";
import { GAMES_HUB_DEDICATION_LINE } from "@/games/dedication";

const SESSION_KEY = "rn_games_dedication_seen";

export default function DedicationBanner() {
  const [shouldShow, setShouldShow] = useState(false);
  const stableId = useMemo(() => `games-dedication-${Math.random().toString(16).slice(2)}`, []);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(SESSION_KEY);
      if (!seen) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setShouldShow(true);
      }
    } catch {
      // If storage is blocked, we can safely fall back to always showing this once.
      setShouldShow(true);
    }
  }, []);

  if (!shouldShow) return null;

  return (
    <section
      aria-label="Dedication"
      className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
    >
      <p className="m-0 text-sm font-semibold text-slate-900" id={stableId}>
        {GAMES_HUB_DEDICATION_LINE}
      </p>
    </section>
  );
}


