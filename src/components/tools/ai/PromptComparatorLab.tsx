"use client";

import React, { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";

type EvaluationCriteria = {
  id: number;
  name: string;
  description: string;
};

const DEFAULT_CRITERIA: EvaluationCriteria[] = [
  {
    id: 1,
    name: "Clarity",
    description: "Is the instruction clear and unambiguous for the model and for a human?",
  },
  {
    id: 2,
    name: "Specificity",
    description: "Does it state the format, length or constraints you actually need?",
  },
  {
    id: 3,
    name: "Safety",
    description: "Does it avoid asking for harmful or sensitive content?",
  },
  {
    id: 4,
    name: "Evaluation hook",
    description: "Does it say how the output will be judged or scored?",
  },
];

function scoreLabel(score: number) {
  if (score >= 4) return "Strong";
  if (score >= 3) return "Workable";
  if (score >= 2) return "Needs revision";
  if (score > 0) return "Confusing";
  return "Not scored";
}

export function PromptComparatorLab() {
  const [task, setTask] = useState(
    "Explain overfitting to a non technical colleague using a concrete example."
  );
  const [promptA, setPromptA] = useState("Explain overfitting simply.");
  const [promptB, setPromptB] = useState(
    "You are an experienced teacher. Explain overfitting to a non technical colleague using a real world analogy and a short table that contrasts underfitting, good fit and overfitting."
  );
  const [scoresA, setScoresA] = useState<Record<number, number>>({});
  const [scoresB, setScoresB] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");

  const averageA = useMemo(() => {
    const values = Object.values(scoresA);
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [scoresA]);

  const averageB = useMemo(() => {
    const values = Object.values(scoresB);
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [scoresB]);

  const handleScoreChange = (which: "A" | "B", criterionId: number, value: string) => {
    const numeric = Number(value);
    const score = Number.isFinite(numeric) && numeric >= 0 && numeric <= 5 ? numeric : 0;
    if (which === "A") {
      setScoresA((prev) => ({ ...prev, [criterionId]: score }));
    } else {
      setScoresB((prev) => ({ ...prev, [criterionId]: score }));
    }
  };

  return (
    <section
      aria-labelledby="prompt-comparator-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2
              id="prompt-comparator-title"
              className="text-lg sm:text-xl font-semibold text-slate-900"
            >
              Prompt comparison lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Compare two prompts for the same task, score them against criteria and capture what you would change. This
              helps you build a prompt library that is deliberate rather than random.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="space-y-1">
          <label htmlFor="prompt-task" className="text-xs font-semibold text-slate-700">
            Underlying task
          </label>
          <textarea
            id="prompt-task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none min-h-[60px]"
          />
          <p className="text-xs text-slate-500">
            State the real job here - for example, “design a marking rubric for a coding assignment” or “summarise a
            policy for busy executives”.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="prompt-a" className="text-xs font-semibold text-slate-700">
              Prompt A
            </label>
            <textarea
              id="prompt-a"
              value={promptA}
              onChange={(e) => setPromptA(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none min-h-[90px]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="prompt-b" className="text-xs font-semibold text-slate-700">
              Prompt B
            </label>
            <textarea
              id="prompt-b"
              value={promptB}
              onChange={(e) => setPromptB(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none min-h-[90px]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Score each prompt (0 to 5)</p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {DEFAULT_CRITERIA.map((criterion) => (
              <div
                key={criterion.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-2"
              >
                <p className="font-semibold">{criterion.name}</p>
                <p className="text-slate-600">{criterion.description}</p>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Prompt A</p>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={scoresA[criterion.id] ?? ""}
                      onChange={(e) => handleScoreChange("A", criterion.id, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-right text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">Prompt B</p>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={scoresB[criterion.id] ?? ""}
                      onChange={(e) => handleScoreChange("B", criterion.id, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-right text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Use this like a marking scheme for prompts. It gives you a repeatable way to improve them.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Summary</h3>
            <p className="text-xs text-slate-700">
              Prompt A average score:{" "}
              <span className="font-semibold text-slate-900">{averageA.toFixed(1)}</span> - {scoreLabel(averageA)}
            </p>
            <p className="text-xs text-slate-700 mt-1">
              Prompt B average score:{" "}
              <span className="font-semibold text-slate-900">{averageB.toFixed(1)}</span> - {scoreLabel(averageB)}
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Keep a record of high scoring prompts in your own prompt library. This helps lecturers, analysts and
              engineers reuse what works.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">What would you change next?</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write down how you would improve the weaker prompt. For example: be more explicit about the audience or the format."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none min-h-[70px]"
            />
            <p className="text-xs text-slate-500">
              You can share these notes with students or colleagues as a prompt design exercise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
