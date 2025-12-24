"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "level-1" | "level-2" | "level-3";

const LS_KEY = "rn_play_insight_puzzle_best_v1";

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

type RuleId = "even-sum" | "sorted" | "unique" | "palindrome";

const RULES: Record<RuleId, { title: string; description: string; check: (arr: number[]) => boolean }> = {
  "even-sum": {
    title: "Even sum",
    description: "A set is valid if the sum of numbers is even.",
    check: (a) => a.reduce((x, y) => x + y, 0) % 2 === 0,
  },
  sorted: {
    title: "Sorted",
    description: "A set is valid if numbers are in non-decreasing order.",
    check: (a) => a.every((v, i) => i === 0 || a[i - 1] <= v),
  },
  unique: {
    title: "Unique",
    description: "A set is valid if it contains no duplicates.",
    check: (a) => new Set(a).size === a.length,
  },
  palindrome: {
    title: "Palindrome",
    description: "A set is valid if it reads the same forward and backward.",
    check: (a) => a.join(",") === [...a].reverse().join(","),
  },
};

const DIFFICULTIES: Record<DifficultyId, { label: string; rule: RuleId; len: number; domain: number }> = {
  "level-1": { label: "Level 1", rule: "even-sum", len: 3, domain: 9 },
  "level-2": { label: "Level 2", rule: "unique", len: 4, domain: 9 },
  "level-3": { label: "Level 3", rule: "palindrome", len: 5, domain: 5 },
};

function randInt(maxInclusive: number) {
  return 0 + Math.floor(Math.random() * (maxInclusive + 1));
}

function makeExample(rule: (arr: number[]) => boolean, len: number, domain: number, want: boolean) {
  for (let tries = 0; tries < 5000; tries += 1) {
    const arr = Array.from({ length: len }, () => randInt(domain));
    if (rule(arr) === want) return arr;
  }
  return Array.from({ length: len }, () => 0);
}

export default function InsightPuzzlePage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("level-1");
  const cfg = DIFFICULTIES[difficulty];
  const rule = RULES[cfg.rule];

  const [started, setStarted] = useState(false);
  const [examplesIn, setExamplesIn] = useState<number[][]>([]);
  const [examplesOut, setExamplesOut] = useState<number[][]>([]);
  const [candidate, setCandidate] = useState<number[]>([]);
  const [guess, setGuess] = useState<"in" | "out" | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [best, setBest] = useState<any>(null);
  const startedAtRef = useRef<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const reset = () => {
    setStarted(false);
    setExamplesIn([]);
    setExamplesOut([]);
    setCandidate([]);
    setGuess(null);
    setResult(null);
    startedAtRef.current = null;
    setTimeMs(null);
  };

  const start = () => {
    reset();
    setStarted(true);
    startedAtRef.current = Date.now();
    const inA = [makeExample(rule.check, cfg.len, cfg.domain, true), makeExample(rule.check, cfg.len, cfg.domain, true)];
    const outA = [makeExample(rule.check, cfg.len, cfg.domain, false), makeExample(rule.check, cfg.len, cfg.domain, false)];
    setExamplesIn(inA);
    setExamplesOut(outA);
    setCandidate(makeExample(rule.check, cfg.len, cfg.domain, Math.random() < 0.5));
  };

  useEffect(() => {
    reset();
  }, [difficulty]);

  const submit = () => {
    if (!started) return;
    if (guess == null) return;
    const isIn = rule.check(candidate);
    const ok = (guess === "in" && isIn) || (guess === "out" && !isIn);
    setResult(ok ? "Correct. Replay to try a new one." : "Not quite. Review the examples and try again.");
    if (ok && startedAtRef.current) {
      const ms = Date.now() - startedAtRef.current;
      setTimeMs(ms);
      const entry = { bestMs: ms, at: new Date().toLocaleString(), difficulty };
      const current = safeReadJson<any>(LS_KEY);
      if (!current || typeof current.bestMs !== "number" || ms < current.bestMs) {
        safeWriteJson(LS_KEY, entry);
        setBest(entry);
      }
    }
  };

  const status = useMemo(() => {
    if (!started) return "Press Start. Discover the hidden rule from examples, then classify a candidate.";
    if (result) return result;
    return "Study the examples, then decide whether the candidate belongs in the set.";
  }, [started, result]);

  return (
    <NotesLayout
      meta={{
        title: "Insight puzzle",
        description: "Discover a hidden rule from examples and apply it.",
        level: "Summary",
        slug: "/play/insight-puzzle",
        section: "ai",
      }}
      activeLevelId="summary"
      useAppShell
    >
      <GameShell
        title="Insight puzzle"
        description="A non-verbal rule discovery puzzle. Infer the rule from examples, then classify a candidate."
        howToPlay={{
          objective: "Classify the candidate correctly by inferring the hidden rule.",
          how: ["Press Start.", "Study IN and OUT examples.", "Choose whether the candidate is IN or OUT.", "Submit to check."],
          improves: ["Pattern recognition", "Hypothesis testing", "Calm reasoning under uncertainty"],
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

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">IN examples</p>
              <div className="space-y-2">
                {examplesIn.map((e, i) => (
                  <div key={i} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                    {e.join(" ")}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">OUT examples</p>
              <div className="space-y-2">
                {examplesOut.map((e, i) => (
                  <div key={i} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900">
                    {e.join(" ")}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Candidate</p>
            <p className="text-3xl font-semibold text-slate-900">{candidate.length ? candidate.join(" ") : "Not started"}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setGuess("in")}
                disabled={!started || !!result}
                className={`button ${guess === "in" ? "primary" : ""}`}
              >
                IN
              </button>
              <button
                type="button"
                onClick={() => setGuess("out")}
                disabled={!started || !!result}
                className={`button ${guess === "out" ? "primary" : ""}`}
              >
                OUT
              </button>
              <button type="button" onClick={submit} disabled={!started || guess == null || !!result} className="button">
                Submit
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Hint: difficulty changes the hidden rule. It is always consistent within a run.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-800">
            <p className="font-semibold text-slate-900">After you solve it</p>
            <p className="mt-1">
              Explain the rule in one sentence. This helps transfer the skill to real pattern recognition tasks.
            </p>
          </div>

          <p className="text-xs text-slate-600">Best time is stored locally in your browser.</p>

          {/* Developer note: future versions could store solved rules and attempt history server-side, but this phase stays local only. */}
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


