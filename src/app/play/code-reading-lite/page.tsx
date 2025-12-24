"use client";

import { useEffect, useMemo, useState } from "react";
import NotesLayout from "@/components/notes/Layout";
import GameShell from "@/components/play/GameShell";
import GameFooter from "@/components/play/GameFooter";

type DifficultyId = "easy" | "standard" | "hard";

type Question = {
  id: string;
  prompt: string;
  code: string;
  options: string[];
  answer: string;
  explanation: string;
};

const LS_KEY = "rn_play_code_reading_lite_best_v1";

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

const QUESTIONS: Record<DifficultyId, Question[]> = {
  easy: [
    {
      id: "e1",
      prompt: "What does this output",
      code: `x = 2\nx = x + 3\nprint(x)`,
      options: ["2", "3", "5", "6"],
      answer: "5",
      explanation: "x starts at 2, then becomes 5 after adding 3.",
    },
    {
      id: "e2",
      prompt: "What does this output",
      code: `sum = 0\nfor i in [1,2,3]:\n  sum = sum + i\nprint(sum)`,
      options: ["3", "6", "7", "10"],
      answer: "6",
      explanation: "It adds 1 + 2 + 3.",
    },
  ],
  standard: [
    {
      id: "s1",
      prompt: "What does this output",
      code: `items = [3,1,4]\ncount = 0\nfor n in items:\n  if n > 2:\n    count = count + 1\nprint(count)`,
      options: ["1", "2", "3", "4"],
      answer: "2",
      explanation: "3 and 4 are greater than 2.",
    },
    {
      id: "s2",
      prompt: "What does this output",
      code: `x = 10\nif x % 2 == 0:\n  x = x / 2\nelse:\n  x = x + 1\nprint(x)`,
      options: ["5", "6", "10", "11"],
      answer: "5",
      explanation: "10 is even, so x becomes 10/2 = 5.",
    },
  ],
  hard: [
    {
      id: "h1",
      prompt: "What does this output",
      code: `function f(n):\n  if n <= 1:\n    return 1\n  return n * f(n-1)\nprint(f(4))`,
      options: ["4", "8", "12", "24"],
      answer: "24",
      explanation: "This is factorial: 4*3*2*1.",
    },
    {
      id: "h2",
      prompt: "What does this output",
      code: `items = [1,2,3,4]\nout = []\nfor n in items:\n  if n % 2 == 0:\n    out.push(n)\nprint(out)`,
      options: ["[1,3]", "[2,4]", "[1,2,3,4]", "[]"],
      answer: "[2,4]",
      explanation: "It keeps the even numbers.",
    },
  ],
};

export default function CodeReadingLitePage() {
  const [difficulty, setDifficulty] = useState<DifficultyId>("standard");
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [best, setBest] = useState<any>(null);

  useEffect(() => {
    setBest(safeReadJson(LS_KEY));
  }, []);

  const questions = QUESTIONS[difficulty];
  const q = questions[idx] || questions[0];
  const done = started && total >= questions.length;

  const reset = () => {
    setStarted(false);
    setIdx(0);
    setSelected(null);
    setShowAnswer(false);
    setCorrect(0);
    setTotal(0);
  };

  const start = () => {
    reset();
    setStarted(true);
  };

  useEffect(() => {
    reset();
  }, [difficulty]);

  const submit = () => {
    if (!started) return;
    if (!q) return;
    if (selected == null) return;
    if (showAnswer) return;
    const ok = selected === q.answer;
    setShowAnswer(true);
    setTotal((t) => t + 1);
    if (ok) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (!started) return;
    setSelected(null);
    setShowAnswer(false);
    setIdx((i) => i + 1);
  };

  useEffect(() => {
    if (!done) return;
    const acc = total > 0 ? correct / total : 0;
    const entry = { bestAcc: acc, bestCorrect: correct, bestTotal: total, at: new Date().toLocaleString(), difficulty };
    const current = safeReadJson<any>(LS_KEY);
    if (!current || typeof current.bestAcc !== "number" || acc > current.bestAcc) {
      safeWriteJson(LS_KEY, entry);
      setBest(entry);
    }
  }, [done, correct, total, difficulty]);

  const accuracy = useMemo(() => {
    if (total <= 0) return null;
    return correct / total;
  }, [correct, total]);

  const status = useMemo(() => {
    if (!started) return "Press Start. Read the pseudocode and predict what it outputs.";
    if (done) return "Complete. Replay to improve your accuracy.";
    return `Question ${Math.min(idx + 1, questions.length)} of ${questions.length}.`;
  }, [started, done, idx, questions.length]);

  return (
    <NotesLayout
      meta={{
        title: "Code reading lite",
        description: "Read pseudocode and predict outputs.",
        level: "Summary",
        slug: "/play/code-reading-lite",
        section: "ai",
      }}
      activeLevelId="summary"
      useAppShell
    >
      <GameShell
        title="Code reading lite"
        description="Practice reading short pseudocode and predicting outputs. Syntax is neutral and language-agnostic."
        howToPlay={{
          objective: "Pick the correct output for each snippet.",
          how: ["Press Start.", "Read the code carefully.", "Choose the output.", "Submit to see the explanation."],
          improves: ["Logical comprehension", "Careful reading", "Predicting program behaviour"],
        }}
        difficulty={{
          options: (["easy", "standard", "hard"] as DifficultyId[]).map((id) => ({ id, label: id === "standard" ? "Standard" : id[0].toUpperCase() + id.slice(1) })),
          value: difficulty,
          onChange: (v) => setDifficulty(v as DifficultyId),
        }}
        onStart={start}
        onReset={reset}
        startLabel="Start"
        resetLabel="Reset"
        score={{
          scoreLabel: "Correct",
          score: started ? correct : null,
          timeMs: null,
          accuracy,
          personalBest: best ? { score: Math.round(best.bestAcc * 100), at: best.at } : null,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-800">{status}</p>

          {started && !done ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-700">{q.prompt}</p>
                <pre className="mt-2 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">{q.code}</pre>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((o) => {
                  const picked = selected === o;
                  const isCorrect = showAnswer && o === q.answer;
                  const isWrong = showAnswer && picked && o !== q.answer;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setSelected(o)}
                      disabled={!started || showAnswer}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                        isCorrect
                          ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                          : isWrong
                            ? "border-rose-300 bg-rose-50 text-rose-900"
                            : picked
                              ? "border-slate-400 bg-slate-50 text-slate-900"
                              : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="button primary" onClick={submit} disabled={selected == null || showAnswer}>
                  Submit
                </button>
                <button type="button" className="button" onClick={next} disabled={!showAnswer}>
                  Next
                </button>
              </div>

              {showAnswer ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-800">
                  <p className="font-semibold text-slate-900">Explanation</p>
                  <p className="mt-1">{q.explanation}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <p className="text-xs text-slate-600">Best accuracy is stored locally in your browser.</p>
        </div>
      </GameShell>
      <GameFooter onReplay={start} />
    </NotesLayout>
  );
}


