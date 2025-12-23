"use client";

import React from "react";
import HowToPlayDrawer, { type HowToPlayContent } from "@/components/play/HowToPlayDrawer";
import ScorePanel, { type ScoreSummary } from "@/components/play/ScorePanel";

export type DifficultyTag = "Foundations" | "Intermediate" | "Advanced" | "Casual";

export type DifficultyOption = {
  id: string;
  label: string;
  hint?: string;
};

export type GameShellProps = {
  title: string;
  description: string;
  howToPlay: HowToPlayContent;
  onStart?: () => void;
  onReset?: () => void;
  startLabel?: string;
  resetLabel?: string;
  score?: ScoreSummary;
  difficulty?: {
    label?: string;
    options: DifficultyOption[];
    value: string;
    onChange: (value: string) => void;
  };
  children: React.ReactNode;
};

export default function GameShell({
  title,
  description,
  howToPlay,
  onStart,
  onReset,
  startLabel = "Start",
  resetLabel = "Reset",
  score,
  difficulty,
  children,
}: GameShellProps) {
  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="eyebrow">Play</p>
            <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="text-slate-700 max-w-3xl">{description}</p>
            <HowToPlayDrawer content={howToPlay} />
          </div>
        </div>
      </header>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {difficulty ? (
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span className="text-slate-700">{difficulty.label || "Difficulty"}</span>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  value={difficulty.value}
                  onChange={(e) => difficulty.onChange(e.target.value)}
                >
                  {difficulty.options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {onReset ? (
              <button type="button" className="button" onClick={onReset}>
                {resetLabel}
              </button>
            ) : null}
            {onStart ? (
              <button type="button" className="button primary" onClick={onStart}>
                {startLabel}
              </button>
            ) : null}
          </div>
        </div>

        {score ? <ScorePanel summary={score} /> : null}

        <div>{children}</div>
      </section>
    </div>
  );
}


