"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";
type Phase = "idle" | "showing" | "distract" | "recall" | "result";

const LS_KEY = "rn_play_memory_interference_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string; items: number; showMs: number; distractMs: number }> = {
  easy: { label: "Easy", items: 4, showMs: 600, distractMs: 1600 },
  standard: { label: "Standard", items: 5, showMs: 520, distractMs: 1800 },
  hard: { label: "Hard", items: 6, showMs: 450, distractMs: 2000 },
};

const WORDS = ["river", "cloud", "paper", "stone", "glass", "leaf", "bridge", "signal", "window", "forest"];
const DISTRACT = ["3 + 4", "8 - 5", "2 × 6", "7 + 1", "9 - 2", "5 + 5", "4 × 2"];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uniqueWords(count: number) {
  const pool = [...WORDS];
  const out: string[] = [];
  while (out.length < count && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

export default function MemoryInterferencePage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<string[]>([]);
  const [showIdx, setShowIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState<number | null>(null);
  const [best, setBest] = useState<any>(null);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const clear = () => {
    if (tRef.current != null) window.clearTimeout(tRef.current);
    tRef.current = null;
  };

  useEffect(() => {
    return () => clear();
  }, []);

  const reset = () => {
    clear();
    setPhase("idle");
    setTarget([]);
    setShowIdx(0);
    setChoices([]);
    setPicked([]);
    setCorrectCount(null);
  };

  const start = () => {
    reset();
    const count = DIFFICULTIES[difficulty].items;
    const words = uniqueWords(count);
    setTarget(words);
    setShowIdx(0);
    setPhase("showing");
  };

  useEffect(() => {
    if (phase !== "showing") return;
    if (target.length === 0) return;
    const showMs = DIFFICULTIES[difficulty].showMs;
    if (showIdx >= target.length) {
      setPhase("distract");
      clear();
      tRef.current = window.setTimeout(() => {
        // build choices: target + same number distractors
        const distractors = uniqueWords(target.length * 2).filter((w) => !target.includes(w)).slice(0, target.length);
        const all = [...target, ...distractors].sort();
        setChoices(all);
        setPhase("recall");
      }, DIFFICULTIES[difficulty].distractMs);
      return;
    }
    clear();
    tRef.current = window.setTimeout(() => setShowIdx((i) => i + 1), showMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, showIdx, target.length, difficulty]);

  const togglePick = (w: string) => {
    if (phase !== "recall") return;
    setPicked((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]));
  };

  const submit = () => {
    if (phase !== "recall") return;
    const correct = picked.filter((w) => target.includes(w)).length;
    setCorrectCount(correct);
    setPhase("result");
    const acc = correct / Math.max(1, target.length);
    const entry = { bestAcc: acc, bestCorrect: correct, total: target.length, at: new Date().toLocaleString(), difficulty };
    const current = safeReadJson<any>(LS_KEY);
    if (!current || typeof current.bestAcc !== "number" || acc > current.bestAcc) {
      safeWriteJson(LS_KEY, entry);
      setBest(entry);
    }
  };

  const status = useMemo(() => {
    if (phase === "idle") return "Press Start. Remember the words even when distractions appear.";
    if (phase === "showing") return "Watch and remember each word.";
    if (phase === "distract") return "Distraction phase. Keep the words in mind.";
    if (phase === "recall") return "Select the words you saw, then submit.";
    return "Round complete. Replay to try again.";
  }, [phase]);

  const showingWord = phase === "showing" && target[showIdx] ? target[showIdx] : null;
  const distraction = phase === "distract" ? pick(DISTRACT) : null;

  return (
    <NotesLayout
      meta={{
        title: "Memory interference test",
        description: "Remember items while distractions appear.",
        level: "Summary",
        slug: "/play/memory-interference",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Memory interference test"
        description="Remember a short list while irrelevant information appears. Keep it calm and steady."
        howToPlay={{
          objective: "Recall as many target words as you can.",
          how: ["Press Start.", "Watch the word list.", "Hold it in mind during the distraction phase.", "Select the words you saw and submit."],
          improves: ["Focus under distraction", "Working memory", "Staying steady when attention is pulled away"],
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
          scoreLabel: "Correct",
          score: correctCount,
          timeMs: null,
          accuracy: correctCount == null ? null : correctCount / Math.max(1, target.length),
          personalBest: best ? { score: Math.round(best.bestAcc * 100), at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-xs font-semibold text-slate-700">Focus area</p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">
              {showingWord ? showingWord : phase === "distract" ? distraction : phase === "recall" ? "Recall" : "Ready"}
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Items: {DIFFICULTIES[difficulty].items} · Best accuracy: {best ? `${Math.round(best.bestAcc * 100)}%` : "Not yet"}
            </p>
          </div>

          {phase === "recall" ? (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-3">
                {choices.map((w) => {
                  const on = picked.includes(w);
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => togglePick(w)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                        on ? "border-indigo-300 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
              <button type="button" className="button primary" onClick={submit} disabled={picked.length === 0}>
                Submit
              </button>
            </div>
          ) : null}

          {phase === "result" ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-800">
              <p className="font-semibold text-slate-900">Result</p>
              <p className="mt-1">
                Correct: {correctCount} of {target.length}. Target words were: {target.join(", ")}.
              </p>
            </div>
          ) : null}

          <p className="text-xs text-slate-600">Best accuracy is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


