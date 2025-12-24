"use client";

import { useEffect, useMemo, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";

const LS_KEY = "rn_play_risk_vs_reward_best_v1";

function safeReadJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWriteJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const DIFFICULTIES: Record<DifficultyId, { label: string; bustChance: number; rewardRange: [number, number] }> = {
  easy: { label: "Easy", bustChance: 0.12, rewardRange: [10, 30] },
  standard: { label: "Standard", bustChance: 0.18, rewardRange: [10, 35] },
  hard: { label: "Hard", bustChance: 0.24, rewardRange: [10, 40] },
};

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export default function RiskVsRewardPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [started, setStarted] = useState(false);
  const [banked, setBanked] = useState(0);
  const [runPoints, setRunPoints] = useState(0);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState("Press Start. You can take points or bank them.");
  const [best, setBest] = useState<any>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setBanked(0);
    setRunPoints(0);
    setRound(0);
    setStatus("Press Start. You can take points or bank them.");
  };

  const start = () => {
    reset();
    setStarted(true);
    setStatus("Choose Take to earn points, or Bank to lock in your current run.");
  };

  const done = !started;

  const take = () => {
    if (!started) return;
    const cfg = DIFFICULTIES[difficulty];
    const bust = Math.random() < cfg.bustChance;
    setRound((r) => r + 1);
    if (bust) {
      setRunPoints(0);
      setStatus("Bust. You lost the run points. You can keep playing or bank what you already have.");
      return;
    }
    const gain = randInt(cfg.rewardRange[0], cfg.rewardRange[1]);
    setRunPoints((p) => p + gain);
    setStatus(`Safe. You gained ${gain} points. Continue or bank.`);
  };

  const bank = () => {
    if (!started) return;
    const final = banked + runPoints;
    setBanked(final);
    setRunPoints(0);
    setStatus("Banked. Continue to build a higher total, or stop when you are satisfied.");
  };

  const stop = () => {
    if (!started) return;
    const final = banked + runPoints;
    const entry = { bestScore: final, at: new Date().toLocaleString(), difficulty };
    const current = safeReadJson<any>(LS_KEY);
    if (!current || typeof current.bestScore !== "number" || final > current.bestScore) {
      safeWriteJson(LS_KEY, entry);
      setBest(entry);
    }
    setStarted(false);
    setStatus(`Run finished. Final score: ${final}. Replay to try again.`);
  };

  const finalScore = useMemo(() => banked + runPoints, [banked, runPoints]);

  return (
    <NotesLayout
      meta={{
        title: "Risk vs reward",
        description: "Decide when to stop and bank points under uncertainty.",
        level: "Summary",
        slug: "/play/risk-vs-reward",
        section: "ai",
      }}
      activeLevelId="summary"
      useAppShell
    >
      <GameShell
        title="Risk vs reward"
        description="A judgement game. Continue to take points with risk, or bank points to lock them in."
        howToPlay={{
          objective: "Finish with a strong score by choosing when to bank and when to stop.",
          how: ["Press Start.", "Press Take to gain points with a chance to bust.", "Press Bank to lock in your run points.", "Press Stop to finish the run."],
          improves: ["Judgement and restraint", "Staying calm under uncertainty", "Risk awareness without panic"],
        }}
        difficulty={{
          options: (Object.keys(DIFFICULTIES) as DifficultyId[]).map((id) => ({ id, label: DIFFICULTIES[id].label })),
          value: difficulty,
          onChange: (v) => setDifficulty(v as DifficultyId),
        }}
        onStart={start}
        onReset={reset}
        startLabel="Start"
        resetLabel="Reset"
        score={{
          scoreLabel: "Score",
          score: done ? (best?.bestScore ?? null) : finalScore,
          timeMs: null,
          accuracy: null,
          personalBest: best ? { score: best.bestScore, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">Banked</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{banked}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">Run points</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{runPoints}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">Total</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{finalScore}</p>
              <p className="mt-1 text-xs text-slate-600">Rounds played: {round}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="button primary" onClick={take} disabled={!started}>
              Take
            </button>
            <button type="button" className="button" onClick={bank} disabled={!started || runPoints <= 0}>
              Bank
            </button>
            <button type="button" className="button" onClick={stop} disabled={!started}>
              Stop
            </button>
          </div>

          <p className="text-xs text-slate-600">Best score is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


