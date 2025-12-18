"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Shuffle } from "lucide-react";

const TERMS = [
  {
    id: "feature",
    term: "Feature",
    options: [
      "A model output used for decisions",
      "An input signal the model learns from",
      "A rule written by a developer",
    ],
    answer: "An input signal the model learns from",
  },
  {
    id: "loss",
    term: "Loss",
    options: [
      "A measure of how wrong the model is",
      "The number of features in the data",
      "A type of model architecture",
    ],
    answer: "A measure of how wrong the model is",
  },
  {
    id: "drift",
    term: "Drift",
    options: [
      "A change in real world data patterns",
      "A model that overfits the data",
      "A method for improving accuracy",
    ],
    answer: "A change in real world data patterns",
  },
  {
    id: "precision",
    term: "Precision",
    options: [
      "How many predicted positives were correct",
      "How many actual positives were found",
      "How many predictions were made",
    ],
    answer: "How many predicted positives were correct",
  },
];

export default function ConceptMatchGame() {
  const [answers, setAnswers] = useState({});

  const correctCount = useMemo(
    () => TERMS.filter((item) => answers[item.id] === item.answer).length,
    [answers]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Shuffle className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Concept match and memory</p>
          <p className="text-xs text-slate-600">Pick the best meaning for each AI term.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {TERMS.map((item) => (
          <label key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <span className="text-xs font-semibold text-slate-900">{item.term}</span>
            <select
              value={answers[item.id] || ""}
              onChange={(event) => setAnswers((prev) => ({ ...prev, [item.id]: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs"
            >
              <option value="">Select a match</option>
              {item.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          {correctCount} of {TERMS.length} correct
        </p>
        <p className="mt-2 text-xs text-slate-600">Aim for full marks before moving on.</p>
      </div>
    </div>
  );
}
