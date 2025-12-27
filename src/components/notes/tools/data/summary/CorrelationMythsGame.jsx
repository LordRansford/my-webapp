"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  {
    id: "ice_cream",
    prompt: "Ice cream sales rise when drownings rise.",
    options: ["Causal", "Correlated via a third factor", "Not enough evidence"],
    answer: 1,
    explanation:
      "Hot weather increases both. The relationship is real but not causal in the way people assume.",
  },
  {
    id: "marketing",
    prompt: "After a marketing campaign, signups increase.",
    options: ["Causal", "Correlated via a third factor", "Not enough evidence"],
    answer: 2,
    explanation:
      "It might be causal, but you need a control. Seasonality, news, or product changes could drive the increase.",
  },
  {
    id: "more_logins",
    prompt: "Accounts with more logins have more fraud alerts.",
    options: ["Causal", "Correlated via a third factor", "Not enough evidence"],
    answer: 1,
    explanation:
      "High activity accounts can attract attackers and can also trigger more monitoring. The alert volume may reflect behaviour and detection, not fraud itself.",
  },
  {
    id: "training_score",
    prompt: "A model with higher training accuracy performs worse in production.",
    options: ["Causal", "Correlated via a third factor", "Not enough evidence"],
    answer: 1,
    explanation:
      "Overfitting is the hidden factor. The model learns shortcuts in training data and fails on real inputs.",
  },
];

export default function CorrelationMythsGame() {
  const [answers, setAnswers] = useState({});

  const score = useMemo(() => {
    let correct = 0;
    for (const q of QUESTIONS) {
      if (answers[q.id] === q.answer) correct += 1;
    }
    return { correct, total: QUESTIONS.length };
  }, [answers]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Pick the best interpretation. The goal is not to be clever. The goal is to avoid confident mistakes.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold text-slate-600">Score</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {score.correct} / {score.total}
        </p>
      </div>

      <div className="grid gap-3">
        {QUESTIONS.map((q) => {
          const chosen = answers[q.id];
          const attempted = typeof chosen === "number";
          const correct = attempted && chosen === q.answer;

          return (
            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{q.prompt}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt, idx) => {
                  const selected = chosen === idx;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring focus:ring-blue-200 ${
                        selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                      aria-pressed={selected}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {attempted ? (
                <div
                  className={`mt-3 rounded-2xl border p-3 text-xs ${
                    correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                >
                  <p className="flex items-center gap-2 text-xs font-semibold">
                    {correct ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <AlertTriangle className="h-4 w-4" aria-hidden="true" />}
                    {correct ? "Good call" : "Check the reasoning"}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed">{q.explanation}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

