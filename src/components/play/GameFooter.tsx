"use client";

import React from "react";
import Link from "next/link";

export default function GameFooter({ onReplay }: { onReplay?: () => void }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
      <div className="flex flex-wrap gap-2">
        {onReplay ? (
          <button type="button" className="button primary" onClick={onReplay}>
            Replay
          </button>
        ) : null}
        <Link href="/play" className="button">
          Return to Play hub
        </Link>
      </div>
      <p className="text-xs text-slate-600">Progress is stored locally in your browser.</p>
    </div>
  );
}


