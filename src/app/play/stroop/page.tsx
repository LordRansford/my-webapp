"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";
type Round = { word: string; ink: string; isCongruent: boolean };

const COLORS = [
  { id: "red", label: "Red", css: "text-rose-600" },
  { id: "green", label: "Green", css: "text-emerald-600" },
  { id: "blue", label: "Blue", css: "text-sky-600" },
  { id: "yellow", label: "Yellow", css: "text-amber-600" },
] as const;

const LS_KEY = "rn_play_stroop_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string; rounds: number; congruentPct: number }> = {
  easy: { label: "Easy", rounds: 12, congruentPct: 0.7 },
  standard: { label: "Standard", rounds: 16, congruentPct: 0.5 },
  hard: { label: "Hard", rounds: 20, congruentPct: 0.3 },
};

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeRound(congruent: boolean): Round {
  const word = pick(COLORS).label;
  const ink = congruent ? word : pick(COLORS.filter((c) => c.label !== word)).label;
  return { word, ink, isCongruent: congruent };
}

export default function StroopPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [started, setStarted] = useState(false);
  const [roundIdx, setRoundIdx] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [best, setBest] = useState<any>(null);
  const startedAtRef = useRef<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setRoundIdx(0);
    setRound(null);
    setCorrect(0);
    setTotal(0);
    startedAtRef.current = null;
    setTimeMs(null);
  };

  const nextRound = (nextIdx: number) => {
    const cfg = DIFFICULTIES[difficulty];
    const congruent = Math.random() < cfg.congruentPct;
    setRound(makeRound(congruent));
    setRoundIdx(nextIdx);
  };

  const start = () => {
    reset();
    setStarted(true);
    startedAtRef.current = Date.now();
    nextRound(1);
  };

  const done = started && roundIdx > DIFFICULTIES[difficulty].rounds;

  const choose = (inkLabel: string) => {
    if (!started) return;
    if (!round) return;
    if (done) return;
    setTotal((t) => t + 1);
    const ok = inkLabel === round.ink;
    if (ok) setCorrect((c) => c + 1);

    const next = roundIdx + 1;
    if (next <= DIFFICULTIES[difficulty].rounds) {
      nextRound(next);
    } else {
      const ms = startedAtRef.current ? Date.now() - startedAtRef.current : null;
      setTimeMs(ms);
      const finalCorrect = ok ? correct + 1 : correct;
      const finalTotal = total + 1;
      const acc = finalTotal > 0 ? finalCorrect / finalTotal : 0;
      const score = Math.max(0, Math.round(1000 * acc - (ms ? ms / 20 : 0)));
      const entry = { bestScore: score, bestAcc: acc, bestTimeMs: ms, at: new Date().toLocaleString(), difficulty };
      const current = safeReadJson<any>(LS_KEY);
      const better =
        !current ||
        (typeof current.bestScore === "number" && score > current.bestScore) ||
        (score === current?.bestScore && typeof current.bestTimeMs === "number" && ms != null && ms < current.bestTimeMs);
      if (better) {
        safeWriteJson(LS_KEY, entry);
        setBest(entry);
      }
      setRoundIdx(DIFFICULTIES[difficulty].rounds + 1);
    }
  };

  const acc = useMemo(() => {
    if (total === 0) return null;
    return correct / total;
  }, [correct, total]);

  const inkCss = useMemo(() => {
    if (!round) return "text-slate-900";
    const m = COLORS.find((c) => c.label === round.ink);
    return m?.css || "text-slate-900";
  }, [round]);

  const status = useMemo(() => {
    if (!started) return "Press Start, then choose the ink colour, not the word.";
    if (done) return "Complete. Replay to try again.";
    return `Round ${roundIdx} of ${DIFFICULTIES[difficulty].rounds}.`;
  }, [started, done, roundIdx, difficulty]);

  const scoreNow = useMemo(() => {
    if (!done) return null;
    if (best?.difficulty !== difficulty) return best?.bestScore ?? null;
    return best?.bestScore ?? null;
  }, [done, best, difficulty]);

  return (
    <NotesLayout
      meta={{
        title: "Stroop style challenge",
        description: "Pick the ink colour, not the word, to practice cognitive control.",
        level: "Summary",
        slug: "/play/stroop",
        section: "ai",
      }}
      activeLevelId="summary"
      useAppShell
    >
      <GameShell
        title="Stroop style challenge"
        description="Choose the ink colour. Ignore the word meaning. This is a classic cognitive control task."
        howToPlay={{
          objective: "Pick the correct ink colour as accurately as you can.",
          how: ["Press Start.", "Look at the ink colour.", "Tap the matching colour button.", "Finish the rounds and replay to improve."],
          improves: ["Cognitive control", "Attention under interference", "Accuracy under a simple time pressure"],
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
          score: scoreNow,
          timeMs,
          accuracy: done ? best?.bestAcc ?? acc : acc,
          personalBest: best ? { score: best.bestScore, timeMs: best.bestTimeMs, accuracy: best.bestAcc, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-xs font-semibold text-slate-700">Word</p>
            <p className={`mt-2 text-5xl font-extrabold ${inkCss}`}>{round?.word ?? "Not started"}</p>
            <p className="mt-2 text-xs text-slate-600">Choose the ink colour, not the word.</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c.label)}
                disabled={!started || done}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                {c.label}
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


