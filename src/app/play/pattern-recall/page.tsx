"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";
type Phase = "idle" | "showing" | "input" | "result";

const SYMBOLS = ["●", "■", "▲", "◆", "★", "✚"] as const;
const LS_KEY = "rn_play_pattern_recall_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string; startLen: number; revealMs: number }> = {
  easy: { label: "Easy", startLen: 3, revealMs: 700 },
  standard: { label: "Standard", startLen: 4, revealMs: 550 },
  hard: { label: "Hard", startLen: 5, revealMs: 450 },
};

function randomSequence(len: number) {
  const out: string[] = [];
  for (let i = 0; i < len; i += 1) {
    out.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }
  return out;
}

export default function PatternRecallPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [input, setInput] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<any>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const clearTimer = () => {
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const reset = () => {
    clearTimer();
    setPhase("idle");
    setSequence([]);
    setInput([]);
    setIndex(0);
    setStreak(0);
  };

  const start = () => {
    clearTimer();
    const initial = randomSequence(DIFFICULTIES[difficulty].startLen);
    setSequence(initial);
    setInput([]);
    setIndex(0);
    setStreak(0);
    setPhase("showing");
    timeoutRef.current = window.setTimeout(() => setPhase("input"), initial.length * DIFFICULTIES[difficulty].revealMs + 200);
  };

  const revealText = useMemo(() => {
    if (phase !== "showing") return "";
    if (sequence.length === 0) return "";
    const step = Math.min(sequence.length - 1, Math.floor(index));
    return sequence[step];
  }, [phase, sequence, index]);

  useEffect(() => {
    if (phase !== "showing") return;
    if (sequence.length === 0) return;
    const interval = window.setInterval(() => setIndex((i) => i + 1), DIFFICULTIES[difficulty].revealMs);
    return () => window.clearInterval(interval);
  }, [phase, sequence.length, difficulty]);

  const choose = (sym: string) => {
    if (phase !== "input") return;
    const next = [...input, sym];
    setInput(next);
    const expected = sequence[next.length - 1];
    if (sym !== expected) {
      setPhase("result");
      const entry = { bestStreak: Math.max(streak, best?.bestStreak || 0), at: new Date().toLocaleString() };
      if (!best || typeof best.bestStreak !== "number" || streak > best.bestStreak) {
        safeWriteJson(LS_KEY, { bestStreak: streak, at: entry.at });
        setBest({ bestStreak: streak, at: entry.at });
      }
      return;
    }
    if (next.length === sequence.length) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const nextSeq = randomSequence(sequence.length + 1);
      setSequence(nextSeq);
      setInput([]);
      setIndex(0);
      setPhase("showing");
      clearTimer();
      timeoutRef.current = window.setTimeout(() => setPhase("input"), nextSeq.length * DIFFICULTIES[difficulty].revealMs + 200);

      if (!best || typeof best.bestStreak !== "number" || newStreak > best.bestStreak) {
        const entry = { bestStreak: newStreak, at: new Date().toLocaleString() };
        safeWriteJson(LS_KEY, entry);
        setBest(entry);
      }
    }
  };

  const status = useMemo(() => {
    if (phase === "idle") return "Press Start to see a short sequence.";
    if (phase === "showing") return "Watch the sequence.";
    if (phase === "input") return "Repeat the sequence.";
    return "Round finished. Replay to try again.";
  }, [phase]);

  return (
    <NotesLayout
      meta={{
        title: "Pattern recall",
        description: "Remember a short symbol sequence and repeat it back.",
        level: "Summary",
        slug: "/play/pattern-recall",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Pattern recall"
        description="Watch a short symbol sequence, then repeat it. The sequence gets longer when you succeed."
        howToPlay={{
          objective: "Repeat the full symbol sequence from memory.",
          how: ["Press Start.", "Watch the symbols.", "Repeat by tapping symbols in order.", "Keep going to increase the sequence length."],
          improves: ["Short-term memory", "Recall under a small delay", "Attention to order and sequence"],
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
          accuracy: null,
          personalBest: best ? { score: best.bestStreak, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-xs font-semibold text-slate-700">Sequence</p>
            <p className="mt-2 text-5xl font-semibold text-slate-900">{phase === "showing" ? revealText : "•"}</p>
            <p className="mt-2 text-xs text-slate-600">
              Current length: {sequence.length || DIFFICULTIES[difficulty].startLen} · Best streak: {best?.bestStreak ?? 0}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {SYMBOLS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => choose(s)}
                disabled={phase !== "input"}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-4 text-2xl font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                aria-label={`Choose ${s}`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-600">Personal best streak is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


