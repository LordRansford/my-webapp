"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    question: "What makes an entry point part of attack surface?",
    options: ["It is internal only", "It accepts input or actions from outside", "It has no users"],
    answer: 1,
    explain: "Any place data or control enters is part of the surface to secure.",
  },
  {
    question: "Why do sessions fail?",
    options: ["They always expire", "Session IDs can be predicted or stolen", "Tokens are encrypted"],
    answer: 1,
    explain: "Predictable or leaked session identifiers let attackers impersonate users.",
  },
  {
    question: "What is a good log signal?",
    options: ["Every request", "Contextual events like privilege changes with user and device info", "All debug traces"],
    answer: 1,
    explain: "Signals need context and actionability, not just volume.",
  },
  {
    question: "How does control strength affect residual risk?",
    options: ["It removes risk entirely", "It reduces risk but cannot make it zero", "It increases impact"],
    answer: 1,
    explain: "Controls reduce likelihood or impact, but some residual risk remains.",
  },
  {
    question: "What is threat modelling for?",
    options: ["Listing CVEs", "Structuring assets, attackers, entry points, and assumptions", "Replacing testing"],
    answer: 1,
    explain: "It is a structured way to reason about what matters and where it can fail.",
  },
];

export default function IntermediateQuizBoard() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[index];

  const answer = (opt) => {
    if (finished) return;
    const correct = opt === current.answer;
    setScore((s) => s + (correct ? 1 : 0));
    setFeedback(correct ? "Correct." : current.explain);
    setTimeout(() => {
      if (index === QUESTIONS.length - 1) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setFeedback("");
      }
    }, 300);
  };

  const reset = () => {
    setIndex(0);
    setScore(0);
    setFeedback("");
    setFinished(false);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      {!finished ? (
        <>
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>
              Question {index + 1} / {QUESTIONS.length}
            </span>
            <span className="font-semibold text-slate-900">Score: {score}</span>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <p className="text-base font-semibold text-slate-900">{current.question}</p>
            <div className="mt-3 grid gap-2">
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => answer(idx)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-900 transition hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {feedback && <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800">{feedback}</div>}
        </>
      ) : (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-slate-900">Session complete</h4>
          <p className="text-sm text-slate-800">
            You scored <strong>{score}</strong> out of {QUESTIONS.length}.
          </p>
          <button
            onClick={reset}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
