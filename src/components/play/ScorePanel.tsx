"use client";

import React from "react";

export type ScoreSummary = {
  scoreLabel?: string;
  score?: number | null;
  timeMs?: number | null;
  accuracy?: number | null; // 0..1
  personalBest?: {
    score?: number | null;
    timeMs?: number | null;
    accuracy?: number | null;
    at?: string | null;
  } | null;
};

function formatMs(ms: number) {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

function formatAccuracy(v: number) {
  const pct = Math.round(Math.max(0, Math.min(1, v)) * 100);
  return `${pct}%`;
}

export default function ScorePanel({ summary }: { summary: ScoreSummary }) {
  const hasAny = summary.score != null || summary.timeMs != null || summary.accuracy != null || summary.personalBest != null;
  if (!hasAny) return null;

  const best = summary.personalBest;
  const empty = "Not yet";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold text-slate-700">{summary.scoreLabel || "Score"}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{summary.score == null ? empty : summary.score}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Time</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{summary.timeMs == null ? empty : formatMs(summary.timeMs)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Accuracy</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{summary.accuracy == null ? empty : formatAccuracy(summary.accuracy)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Personal best (local)</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {best?.score != null ? `${best.score}` : empty}
            {best?.timeMs != null ? ` · ${formatMs(best.timeMs)}` : ""}
            {best?.accuracy != null ? ` · ${formatAccuracy(best.accuracy)}` : ""}
          </p>
          {best?.at ? <p className="mt-1 text-xs text-slate-600">Last best: {best.at}</p> : null}
        </div>
      </div>
    </div>
  );
}


