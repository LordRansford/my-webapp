"use client";

import { useEffect, useMemo, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";

const LS_KEY = "rn_play_number_estimation_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string; rounds: number; max: number }> = {
  easy: { label: "Easy", rounds: 6, max: 100 },
  standard: { label: "Standard", rounds: 8, max: 500 },
  hard: { label: "Hard", rounds: 10, max: 5000 },
};

function randomInt(maxInclusive: number) {
  return 1 + Math.floor(Math.random() * maxInclusive);
}

export default function NumberEstimationPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [errors, setErrors] = useState<number[]>([]);
  const [best, setBest] = useState<any>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setRound(0);
    setTarget(null);
    setGuess("");
    setErrors([]);
  };

  const start = () => {
    reset();
    setStarted(true);
    setRound(1);
    setTarget(randomInt(DIFFICULTIES[difficulty].max));
  };

  const done = started && round > DIFFICULTIES[difficulty].rounds;

  const avgError = useMemo(() => {
    if (errors.length === 0) return null;
    const avg = errors.reduce((a, b) => a + b, 0) / errors.length;
    return Math.round(avg * 10) / 10;
  }, [errors]);

  const onSubmit = () => {
    if (!started) return;
    if (target == null) return;
    const g = Number(guess);
    if (!Number.isFinite(g)) return;

    const errPct = Math.abs(g - target) / Math.max(1, target);
    setErrors((prev) => [...prev, errPct]);

    setGuess("");
    const nextRound = round + 1;
    setRound(nextRound);
    if (nextRound <= DIFFICULTIES[difficulty].rounds) {
      setTarget(randomInt(DIFFICULTIES[difficulty].max));
    } else {
      // finished
      const finalAvg = [...errors, errPct].reduce((a, b) => a + b, 0) / (errors.length + 1);
      const entry = { bestAvgErrorPct: finalAvg, at: new Date().toLocaleString(), difficulty };
      const current = safeReadJson<any>(LS_KEY);
      if (!current || typeof current.bestAvgErrorPct !== "number" || finalAvg < current.bestAvgErrorPct) {
        safeWriteJson(LS_KEY, entry);
        setBest(entry);
      }
    }
  };

  const scoreValue = useMemo(() => {
    if (!done) return null;
    if (avgError == null) return null;
    // Lower error is better. Use a score that is easy to read.
    const score = Math.max(0, Math.round(100 - avgError * 100));
    return score;
  }, [done, avgError]);

  const status = useMemo(() => {
    if (!started) return "Press Start to begin. The goal is to be close, not perfect.";
    if (done) return "All rounds complete. Replay to try to reduce your average error.";
    return `Round ${round} of ${DIFFICULTIES[difficulty].rounds}.`;
  }, [started, done, round, difficulty]);

  return (
    <NotesLayout
      meta={{
        title: "Number estimation",
        description: "Make quick guesses and learn your error margin.",
        level: "Summary",
        slug: "/play/number-estimation",
        section: "ai",
      }}
      activeLevelId="summary"
      useAppShell
    >
      <GameShell
        title="Number estimation"
        description="Estimate a number quickly and see your error margin. This trains calibration and intuition."
        howToPlay={{
          objective: "Keep your average error as low as possible across the rounds.",
          how: ["Press Start.", "Enter a guess.", "Submit to see the answer and your error.", "Finish all rounds and replay to improve."],
          improves: ["Approximation and calibration", "Intuition under uncertainty", "Comfort with quick numeric judgement"],
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
          score: scoreValue,
          timeMs: null,
          accuracy: null,
          personalBest: best ? { score: Math.max(0, Math.round(100 - best.bestAvgErrorPct * 100)), at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
              <p className="text-xs font-semibold text-slate-700">Target</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{started && !done ? target : "Not started"}</p>
              <p className="mt-1 text-xs text-slate-600">
                Range: 1 to {DIFFICULTIES[difficulty].max}. Try to be close without overthinking.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">Average error</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{avgError == null ? "Not yet" : `${Math.round(avgError * 100)}%`}</p>
              <p className="mt-1 text-xs text-slate-600">Lower is better.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <label className="flex-1 min-w-[220px] space-y-1">
              <span className="text-xs font-semibold text-slate-700">Your guess</span>
              <input
                value={guess}
                inputMode="numeric"
                onChange={(e) => setGuess(e.target.value)}
                disabled={!started || done}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Type a number"
              />
            </label>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!started || done || guess.trim() === ""}
              className="button primary"
            >
              Submit
            </button>
          </div>

          <p className="text-xs text-slate-600">Personal best is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


