"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "level-3" | "level-4" | "level-5";

const LS_KEY = "rn_play_tower_of_logic_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string; discs: number }> = {
  "level-3": { label: "Level 1 (3 pieces)", discs: 3 },
  "level-4": { label: "Level 2 (4 pieces)", discs: 4 },
  "level-5": { label: "Level 3 (5 pieces)", discs: 5 },
};

type Peg = 0 | 1 | 2;
type Board = number[][]; // each peg is a stack of disc sizes, smallest is 1

function makeStartBoard(discs: number): Board {
  return [Array.from({ length: discs }, (_, i) => discs - i), [], []];
}

function isMoveValid(board: Board, from: Peg, to: Peg) {
  if (from === to) return false;
  const fromStack = board[from];
  const toStack = board[to];
  if (fromStack.length === 0) return false;
  const moving = fromStack[fromStack.length - 1];
  const top = toStack[toStack.length - 1];
  if (top == null) return true;
  return moving < top;
}

function applyMove(board: Board, from: Peg, to: Peg): Board {
  const next: Board = board.map((s) => [...s]);
  const disc = next[from].pop();
  if (disc == null) return next;
  next[to].push(disc);
  return next;
}

function optimalMoves(discs: number) {
  return Math.pow(2, discs) - 1;
}

export default function TowerOfLogicPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("level-3");
  const discs = DIFFICULTIES[difficulty].discs;
  const [started, setStarted] = useState(false);
  const [board, setBoard] = useState<Board>(() => makeStartBoard(discs));
  const [selectedPeg, setSelectedPeg] = useState<Peg | null>(null);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<any>(null);
  const startedAtRef = useRef<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setBoard(makeStartBoard(discs));
    setSelectedPeg(null);
    setMoves(0);
    startedAtRef.current = null;
    setTimeMs(null);
  };

  const start = () => {
    reset();
    setStarted(true);
    startedAtRef.current = Date.now();
  };

  useEffect(() => {
    // Difficulty change resets the board.
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const solved = useMemo(() => {
    return board[2].length === discs;
  }, [board, discs]);

  useEffect(() => {
    if (!solved) return;
    if (!startedAtRef.current) return;
    const ms = Date.now() - startedAtRef.current;
    setTimeMs(ms);

    const optimal = optimalMoves(discs);
    const entry = { bestMoves: moves, optimalMoves: optimal, bestTimeMs: ms, at: new Date().toLocaleString(), difficulty };
    const current = safeReadJson<any>(LS_KEY);
    const better =
      !current ||
      (current.difficulty === difficulty &&
        ((typeof current.bestMoves === "number" && moves < current.bestMoves) ||
          (moves === current.bestMoves && typeof current.bestTimeMs === "number" && ms < current.bestTimeMs)));
    if (better) {
      safeWriteJson(LS_KEY, entry);
      setBest(entry);
    }
  }, [solved, moves, discs, difficulty]);

  const clickPeg = (peg: Peg) => {
    if (!started) return;
    if (solved) return;
    if (selectedPeg == null) {
      if (board[peg].length === 0) return;
      setSelectedPeg(peg);
      return;
    }
    const from = selectedPeg;
    const to = peg;
    if (!isMoveValid(board, from, to)) {
      // Gentle feedback: keep selection and let user try another target.
      return;
    }
    setBoard((b) => applyMove(b, from, to));
    setMoves((m) => m + 1);
    setSelectedPeg(null);
  };

  const status = useMemo(() => {
    if (!started) return "Press Start. Move all pieces to the right peg. You can only place a smaller piece on a larger one.";
    if (solved) return "Solved. Replay to try a higher level or beat your move count.";
    if (selectedPeg != null) return "Choose a destination peg.";
    return "Choose a peg to pick up the top piece.";
  }, [started, solved, selectedPeg]);

  const optimal = optimalMoves(discs);

  return (
    <NotesLayout
      meta={{
        title: "Tower of logic",
        description: "Move pieces with strict rules to reach the goal with few moves.",
        level: "Summary",
        slug: "/play/tower-of-logic",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Tower of logic"
        description="A planning puzzle with strict rules. Solve it in as few moves as you can."
        howToPlay={{
          objective: "Move the full stack to the right peg using legal moves only.",
          how: ["Press Start.", "Select a peg to pick up the top piece.", "Select a destination peg.", "Repeat until all pieces are on the right."],
          improves: ["Planning and foresight", "Working memory", "Staying calm while solving a multi-step problem"],
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
          scoreLabel: "Moves",
          score: moves,
          timeMs,
          accuracy: null,
          personalBest: best ? { score: best.bestMoves, timeMs: best.bestTimeMs, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-700">
              Optimal moves for this level: <span className="font-semibold text-slate-900">{optimal}</span>
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3" aria-label="Tower pegs">
            {[0, 1, 2].map((peg) => {
              const p = peg as Peg;
              const stack = board[p];
              const isSelected = selectedPeg === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => clickPeg(p)}
                  disabled={!started}
                  className={`rounded-2xl border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                    isSelected ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
                  }`}
                  aria-label={`Peg ${p + 1}`}
                >
                  <p className="text-xs font-semibold text-slate-700">Peg {p + 1}</p>
                  <div className="mt-3 flex flex-col-reverse items-stretch gap-2">
                    {stack.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">Empty</div>
                    ) : (
                      stack.map((disc) => (
                        <div
                          key={disc}
                          className="rounded-xl bg-slate-900/90 text-white text-sm font-semibold px-3 py-2"
                          style={{ width: `${45 + disc * 10}%` }}
                        >
                          Piece {disc}
                        </div>
                      ))
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-600">Best performance is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


