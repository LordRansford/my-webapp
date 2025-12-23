"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";

type Scenario = {
  id: string;
  title: string;
  steps: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "tea",
    title: "Make a cup of tea",
    steps: ["Boil water", "Put a teabag in a cup", "Pour hot water", "Steep for a moment", "Remove teabag", "Add milk or sugar if you want"],
  },
  {
    id: "email",
    title: "Send a clear email",
    steps: ["Write a short subject", "State the purpose in the first sentence", "Add key details", "Ask for the next action", "Proofread", "Send"],
  },
  {
    id: "laundry",
    title: "Do laundry",
    steps: ["Sort clothes", "Load the washing machine", "Add detergent", "Choose a cycle", "Start the wash", "Dry or hang clothes"],
  },
];

const LS_KEY = "rn_play_sequence_builder_best_v1";

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

const DIFFICULTIES: Record<DifficultyId, { label: string; steps: number }> = {
  easy: { label: "Easy", steps: 4 },
  standard: { label: "Standard", steps: 5 },
  hard: { label: "Hard", steps: 6 },
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SequenceBuilderPage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [started, setStarted] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [pool, setPool] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [best, setBest] = useState<any>(null);
  const startedAtRef = useRef<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setScenario(null);
    setPool([]);
    setOrder([]);
    setAttempts(0);
    startedAtRef.current = null;
    setTimeMs(null);
  };

  const start = () => {
    reset();
    const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const steps = s.steps.slice(0, DIFFICULTIES[difficulty].steps);
    setScenario({ ...s, steps });
    setPool(shuffle(steps));
    setOrder([]);
    setAttempts(0);
    setStarted(true);
    startedAtRef.current = Date.now();
  };

  const canSubmit = started && scenario && order.length === scenario.steps.length;

  const submit = () => {
    if (!scenario) return;
    if (!canSubmit) return;
    setAttempts((a) => a + 1);
    const ok = order.every((step, idx) => step === scenario.steps[idx]);
    if (!ok) return;

    const ms = startedAtRef.current ? Date.now() - startedAtRef.current : null;
    setTimeMs(ms);
    const score = Math.max(0, Math.round(1000 - (ms ? ms / 10 : 0) - attempts * 50));
    const entry = { bestScore: score, bestTimeMs: ms, at: new Date().toLocaleString(), difficulty };
    const current = safeReadJson<any>(LS_KEY);
    const better =
      !current ||
      (typeof current.bestScore === "number" && score > current.bestScore) ||
      (score === current?.bestScore && typeof current.bestTimeMs === "number" && ms != null && ms < current.bestTimeMs);
    if (better) {
      safeWriteJson(LS_KEY, entry);
      setBest(entry);
    }
  };

  const moveToOrder = (step: string) => {
    if (!started) return;
    if (!scenario) return;
    if (order.includes(step)) return;
    setPool((p) => p.filter((x) => x !== step));
    setOrder((o) => [...o, step]);
  };

  const removeFromOrder = (step: string) => {
    if (!started) return;
    if (!scenario) return;
    setOrder((o) => o.filter((x) => x !== step));
    setPool((p) => [...p, step]);
  };

  const solved = useMemo(() => {
    if (!scenario) return false;
    if (timeMs == null) return false;
    return order.length === scenario.steps.length && order.every((s, i) => s === scenario.steps[i]);
  }, [scenario, order, timeMs]);

  const status = useMemo(() => {
    if (!started) return "Press Start to get a scenario.";
    if (!scenario) return "Loading scenario.";
    if (solved) return "Correct order. Nice work. Replay to try another scenario.";
    return "Build the correct order, then press Check.";
  }, [started, scenario, solved]);

  return (
    <NotesLayout
      meta={{
        title: "Sequence builder",
        description: "Arrange everyday steps in the correct order.",
        level: "Summary",
        slug: "/play/sequence-builder",
        section: "ai",
      }}
      activeLevelId="summary"
    >
      <GameShell
        title="Sequence builder"
        description="Arrange steps in the correct order. This trains sequencing and careful attention."
        howToPlay={{
          objective: "Place all steps in the correct order.",
          how: ["Press Start.", "Tap steps to add them to the order.", "Tap a placed step to remove it.", "Press Check when you are done."],
          improves: ["Sequencing", "Planning and checking", "Careful reading under light time pressure"],
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
          score: solved ? best?.bestScore ?? null : null,
          timeMs,
          accuracy: null,
          personalBest: best ? { score: best.bestScore, timeMs: best.bestTimeMs, at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-700">Scenario</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{scenario ? scenario.title : "Not started"}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Steps to place</p>
              <div className="flex flex-col gap-2">
                {pool.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => moveToOrder(s)}
                    disabled={!started || solved}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    {s}
                  </button>
                ))}
                {pool.length === 0 ? <p className="text-sm text-slate-600">All steps placed.</p> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Your order</p>
              <ol className="space-y-2">
                {order.map((s, idx) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => removeFromOrder(s)}
                      disabled={!started || solved}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                      aria-label={`Step ${idx + 1}: ${s}. Tap to remove.`}
                    >
                      <span className="mr-2 text-xs font-semibold text-slate-600">{idx + 1}.</span>
                      <span className="font-semibold">{s}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {order.length === 0 ? <p className="text-sm text-slate-600">Tap steps on the left to build the order.</p> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="button primary" onClick={submit} disabled={!canSubmit || solved}>
              Check
            </button>
            <p className="text-xs text-slate-600">Best score is stored locally in your browser.</p>
          </div>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


