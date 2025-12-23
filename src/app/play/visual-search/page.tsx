"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";
type Item = { id: string; label: string; isTarget: boolean };

const LS_KEY = "rn_play_visual_search_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string; grid: number; distractors: string[] }> = {
  easy: { label: "Easy", grid: 5, distractors: ["O", "0"] },
  standard: { label: "Standard", grid: 7, distractors: ["O", "0", "Q"] },
  hard: { label: "Hard", grid: 9, distractors: ["O", "0", "Q", "D"] },
};

function randomId() {
  return Math.random().toString(16).slice(2);
}

export default function VisualSearchPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [found, setFound] = useState(false);
  const [best, setBest] = useState<any>(null);
  const startedAtRef = useRef<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setItems([]);
    setFound(false);
    startedAtRef.current = null;
    setTimeMs(null);
  };

  const start = () => {
    reset();
    setStarted(true);
    setFound(false);
    const grid = DIFFICULTIES[difficulty].grid;
    const total = grid * grid;
    const targetIndex = Math.floor(Math.random() * total);
    const distractors = DIFFICULTIES[difficulty].distractors;

    const next: Item[] = [];
    for (let i = 0; i < total; i += 1) {
      const isTarget = i === targetIndex;
      const label = isTarget ? "X" : distractors[Math.floor(Math.random() * distractors.length)];
      next.push({ id: `${i}-${randomId()}`, label, isTarget });
    }
    // Deterministic ordering given the generated state, no shuffling input from users.
    setItems(next);
    startedAtRef.current = Date.now();
  };

  const onPick = (it: Item) => {
    if (!started || found) return;
    if (!it.isTarget) return;
    setFound(true);
    const ms = startedAtRef.current ? Date.now() - startedAtRef.current : null;
    setTimeMs(ms);
    if (ms != null) {
      const entry = { bestMs: ms, at: new Date().toLocaleString(), difficulty };
      const current = safeReadJson<any>(LS_KEY);
      if (!current || typeof current.bestMs !== "number" || ms < current.bestMs) {
        safeWriteJson(LS_KEY, entry);
        setBest(entry);
      }
    }
  };

  const status = useMemo(() => {
    if (!started) return "Press Start, then find the X.";
    if (found) return `Found. Time: ${timeMs ?? 0} ms. Replay to try again.`;
    return "Find the X as quickly as you can.";
  }, [started, found, timeMs]);

  const grid = DIFFICULTIES[difficulty].grid;

  return (
    <NotesLayout
      meta={{
        title: "Visual search",
        description: "Find a target among distractors to practice scanning and focus.",
        level: "Summary",
        slug: "/play/visual-search",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Visual search"
        description="Find the X among distractors. It is short and designed to encourage focused scanning."
        howToPlay={{
          objective: "Find the X as quickly as you can.",
          how: ["Press Start.", "Scan the grid.", "Tap the X when you find it.", "Replay to try to beat your best time."],
          improves: ["Visual scanning", "Sustained attention", "Speed with simple search tasks"],
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
          scoreLabel: "Best time (ms)",
          score: best?.bestMs ?? null,
          timeMs,
          accuracy: null,
          personalBest: best ? { score: best.bestMs, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div
            className="grid gap-1 rounded-2xl border border-slate-200 bg-white p-3"
            style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }}
            aria-label="Visual search grid"
          >
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => onPick(it)}
                disabled={!started || found}
                className={`aspect-square rounded-lg border text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                  it.isTarget && found ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-900"
                }`}
                aria-label={it.isTarget ? "Target X" : "Distractor"}
              >
                {it.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-600">Personal best is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


