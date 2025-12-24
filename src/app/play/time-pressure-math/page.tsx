"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";

const LS_KEY = "rn_play_time_pressure_math_best_v1";

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

const DIFFICULTIES: Record<
  DifficultyId,
  { label: string; secondsPerQuestion: number; maxStreak: number; maxA: number; maxB: number; ops: ("+" | "-" | "×")[] }
> = {
  easy: { label: "Easy", secondsPerQuestion: 10, maxStreak: 20, maxA: 20, maxB: 10, ops: ["+", "-"] },
  standard: { label: "Standard", secondsPerQuestion: 9, maxStreak: 25, maxA: 50, maxB: 20, ops: ["+", "-", "×"] },
  hard: { label: "Hard", secondsPerQuestion: 8, maxStreak: 30, maxA: 99, maxB: 30, ops: ["+", "-", "×"] },
};

type Question = { a: number; b: number; op: "+" | "-" | "×"; answer: number };

function randInt(maxInclusive: number) {
  return 1 + Math.floor(Math.random() * maxInclusive);
}

function makeQuestion(cfg: (typeof DIFFICULTIES)[DifficultyId], level: number): Question {
  const op = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];
  const scale = 1 + Math.min(2, Math.floor(level / 5));
  const a = randInt(Math.min(cfg.maxA, cfg.maxA * scale));
  const b = randInt(Math.min(cfg.maxB, cfg.maxB * scale));
  if (op === "+") return { a, b, op, answer: a + b };
  if (op === "-") return { a, b, op, answer: a - b };
  return { a, b, op, answer: a * b };
}

export default function TimePressureMathPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [best, setBest] = useState<any>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const clearTimer = () => {
    if (timerRef.current != null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const reset = () => {
    clearTimer();
    setStarted(false);
    setQuestion(null);
    setInput("");
    setStreak(0);
    setCorrect(0);
    setTotal(0);
    setSecondsLeft(null);
  };

  const next = (newStreak: number) => {
    const cfg = DIFFICULTIES[difficulty];
    const q = makeQuestion(cfg, Math.max(1, newStreak + 1));
    setQuestion(q);
    setInput("");
    setSecondsLeft(cfg.secondsPerQuestion);
  };

  const start = () => {
    reset();
    setStarted(true);
    next(0);
    clearTimer();
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s == null) return s;
        if (s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!started) return;
    if (secondsLeft == null) return;
    if (secondsLeft > 0) return;
    // time up: treat as incorrect and move on
    setTotal((t) => t + 1);
    setStreak(0);
    next(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, started]);

  const submit = () => {
    if (!started) return;
    if (!question) return;
    const g = Number(input);
    if (!Number.isFinite(g)) return;
    setTotal((t) => t + 1);
    const ok = g === question.answer;
    if (ok) {
      setCorrect((c) => c + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      next(newStreak);
      const current = safeReadJson<any>(LS_KEY);
      if (!current || typeof current.bestStreak !== "number" || newStreak > current.bestStreak) {
        const entry = { bestStreak: newStreak, at: new Date().toLocaleString(), difficulty };
        safeWriteJson(LS_KEY, entry);
        setBest(entry);
      }
    } else {
      setStreak(0);
      next(0);
    }
  };

  const accuracy = useMemo(() => {
    if (total <= 0) return null;
    return correct / total;
  }, [correct, total]);

  const status = useMemo(() => {
    if (!started) return "Press Start. Answer each question before the timer reaches zero.";
    return "Keep a steady pace. If you miss one, your streak resets.";
  }, [started]);

  return (
    <NotesLayout
      meta={{
        title: "Time pressure math",
        description: "Solve mental arithmetic under gentle time windows.",
        level: "Summary",
        slug: "/play/time-pressure-math",
        section: "ai",
      }}
      activeLevelId="summary"
      useAppShell
    >
      <GameShell
        title="Time pressure math"
        description="Mental arithmetic with gentle time windows. The goal is steady accuracy and a growing streak."
        howToPlay={{
          objective: "Build a streak of correct answers under a time window.",
          how: ["Press Start.", "Solve the question.", "Submit before time runs out.", "Keep going to improve your streak."],
          improves: ["Mental arithmetic", "Accuracy under light time pressure", "Staying calm while working quickly"],
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
          scoreLabel: "Streak",
          score: streak,
          timeMs: null,
          accuracy,
          personalBest: best ? { score: best.bestStreak, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
              <p className="text-xs font-semibold text-slate-700">Question</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {question ? `${question.a} ${question.op} ${question.b}` : "Not started"}
              </p>
              <p className="mt-1 text-xs text-slate-600">Streak resets on an incorrect answer or timeout.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">Time left</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{secondsLeft == null ? "Not started" : `${secondsLeft}s`}</p>
              <p className="mt-1 text-xs text-slate-600">Timer starts only after Start.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <label className="flex-1 min-w-[220px] space-y-1">
              <span className="text-xs font-semibold text-slate-700">Answer</span>
              <input
                value={input}
                inputMode="numeric"
                onChange={(e) => setInput(e.target.value)}
                disabled={!started}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Type the answer"
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
              />
            </label>
            <button type="button" onClick={submit} disabled={!started || input.trim() === ""} className="button primary">
              Submit
            </button>
          </div>

          <p className="text-xs text-slate-600">Best streak is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


