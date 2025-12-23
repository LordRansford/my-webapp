"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type Person = "Ava" | "Ben" | "Cara";
type Pet = "Cat" | "Dog" | "Fish";

type DifficultyId = "easy";

type GridState = Record<Person, Pet | "">;

const PEOPLE: Person[] = ["Ava", "Ben", "Cara"];
const PETS: Pet[] = ["Cat", "Dog", "Fish"];

const LS_KEY = "rn_play_logic_grid_mini_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string }> = {
  easy: { label: "Easy presets" },
};

const PUZZLES = [
  {
    id: "pets-1",
    title: "Who has which pet",
    description: "Assign one unique pet to each person using three short constraints.",
    clues: [
      "Ava does not have the cat.",
      "Ben has the dog.",
      "Cara does not have the dog.",
    ],
    solution: { Ava: "Fish", Ben: "Dog", Cara: "Cat" } as Record<Person, Pet>,
  },
  {
    id: "pets-2",
    title: "Pets, again",
    description: "Another tiny logic grid. One pet per person.",
    clues: [
      "Cara has the fish.",
      "Ava does not have the fish.",
      "Ben does not have the cat.",
    ],
    solution: { Ava: "Cat", Ben: "Dog", Cara: "Fish" } as Record<Person, Pet>,
  },
] as const;

function emptyState(): GridState {
  return { Ava: "", Ben: "", Cara: "" };
}

function isValidPartial(state: GridState) {
  const chosen = Object.values(state).filter(Boolean);
  return new Set(chosen).size === chosen.length;
}

export default function LogicGridMiniPage() {
  const [difficulty] = useState<DifficultyId>("easy");
  const [started, setStarted] = useState(false);
  const [puzzleId, setPuzzleId] = useState<(typeof PUZZLES)[number]["id"]>(PUZZLES[0].id);
  const puzzle = useMemo(() => PUZZLES.find((p) => p.id === puzzleId)!, [puzzleId]);
  const [state, setState] = useState<GridState>(emptyState());
  const [checked, setChecked] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [best, setBest] = useState<any>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setState(emptyState());
    setChecked(false);
    startedAtRef.current = null;
    setTimeMs(null);
  };

  const start = () => {
    reset();
    setStarted(true);
    startedAtRef.current = Date.now();
  };

  const setPet = (person: Person, pet: Pet | "") => {
    if (!started) return;
    setChecked(false);
    setState((s) => {
      const next = { ...s, [person]: pet };
      if (!isValidPartial(next)) return s;
      return next;
    });
  };

  const complete = useMemo(() => PEOPLE.every((p) => state[p] !== ""), [state]);

  const solved = useMemo(() => {
    if (!checked) return false;
    return PEOPLE.every((p) => state[p] === puzzle.solution[p]);
  }, [checked, state, puzzle.solution]);

  const check = () => {
    if (!started) return;
    if (!complete) return;
    setChecked(true);
    const ok = PEOPLE.every((p) => state[p] === puzzle.solution[p]);
    if (!ok) return;

    const ms = startedAtRef.current ? Date.now() - startedAtRef.current : null;
    setTimeMs(ms);
    if (ms != null) {
      const entry = { bestMs: ms, at: new Date().toLocaleString(), puzzleId };
      const current = safeReadJson<any>(LS_KEY);
      if (!current || typeof current.bestMs !== "number" || ms < current.bestMs) {
        safeWriteJson(LS_KEY, entry);
        setBest(entry);
      }
    }
  };

  const status = useMemo(() => {
    if (!started) return "Press Start, then use the dropdowns to assign one pet to each person.";
    if (solved) return "Solved. Replay or switch puzzle to try again.";
    if (checked) return "Not quite. Adjust the grid and check again.";
    return "Use the clues, then press Check.";
  }, [started, solved, checked]);

  return (
    <NotesLayout
      meta={{
        title: "Logic grid mini",
        description: "Use a few constraints to solve a tiny grid puzzle.",
        level: "Summary",
        slug: "/play/logic-grid-mini",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Logic grid mini"
        description="A tiny logic grid puzzle with easy presets. Use the clues to deduce the unique mapping."
        howToPlay={{
          objective: "Assign one unique pet to each person that satisfies the clues.",
          how: ["Press Start.", "Read the clues.", "Assign one pet to each person.", "Press Check to verify your solution."],
          improves: ["Deductive reasoning", "Constraint thinking", "Careful checking before committing"],
        }}
        difficulty={{
          options: [{ id: "easy", label: DIFFICULTIES.easy.label }],
          value: difficulty,
          onChange: () => {},
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

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <label className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">Puzzle</span>
              <select
                value={puzzleId}
                onChange={(e) => {
                  setPuzzleId(e.target.value as any);
                  reset();
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                {PUZZLES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm font-semibold text-slate-900">{puzzle.description}</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {puzzle.clues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-700">Grid</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {PEOPLE.map((person) => (
                <label key={person} className="space-y-1">
                  <span className="text-sm font-semibold text-slate-900">{person}</span>
                  <select
                    value={state[person]}
                    onChange={(e) => setPet(person, e.target.value as any)}
                    disabled={!started || solved}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    <option value="">Choose</option>
                    {PETS.map((pet) => (
                      <option key={pet} value={pet}>
                        {pet}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="button primary" onClick={check} disabled={!started || !complete || solved}>
              Check
            </button>
            <p className="text-xs text-slate-600">Personal best is stored locally in your browser.</p>
          </div>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


