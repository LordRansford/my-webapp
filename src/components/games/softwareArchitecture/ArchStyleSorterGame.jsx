"use client";

import { useMemo, useState } from "react";

const SCENARIOS = [
  {
    id: "small-tool",
    prompt: "A small internal tool for one team with a simple workflow",
    answer: "simple layered monolith",
    options: ["simple layered monolith", "modular monolith", "microservices", "event driven", "strangler pattern"],
  },
  {
    id: "global-app",
    prompt: "A global consumer app with many independent features and teams",
    answer: "microservices",
    options: ["simple layered monolith", "modular monolith", "microservices", "event driven", "strangler pattern"],
  },
  {
    id: "event-heavy",
    prompt: "An event heavy system that needs to react to sensor updates in near real time",
    answer: "event driven",
    options: ["simple layered monolith", "modular monolith", "microservices", "event driven", "strangler pattern"],
  },
  {
    id: "legacy-modernise",
    prompt: "A legacy system we want to modernise in stages without stopping the business",
    answer: "strangler pattern",
    options: ["simple layered monolith", "modular monolith", "microservices", "event driven", "strangler pattern"],
  },
  {
    id: "growing-teams",
    prompt: "A medium product with a few teams, shared data models, and emerging boundaries",
    answer: "modular monolith",
    options: ["simple layered monolith", "modular monolith", "microservices", "event driven", "strangler pattern"],
  },
];

const EXPLAINS = {
  "simple layered monolith": "Best when the team is small, scope is focused, and deployment needs to stay simple.",
  "modular monolith": "Keeps one deployment but enforces clear module boundaries to manage growth.",
  microservices: "Fits large teams and independent feature delivery, but adds ops and coordination overhead.",
  "event driven": "Great for decoupling producers/consumers and reacting to events, but needs strong observability.",
  "strangler pattern": "Ideal for incrementally replacing legacy without halting business operations.",
};

export default function ArchStyleSorterGame() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");

  const current = SCENARIOS[index];

  const score = useMemo(
    () => Object.entries(answers).filter(([id, choice]) => SCENARIOS.find((s) => s.id === id)?.answer === choice).length,
    [answers]
  );

  const select = (choice) => {
    setAnswers((prev) => ({ ...prev, [current.id]: choice }));
    const correct = current.answer === choice;
    setFeedback(correct ? EXPLAINS[choice] : `Better fit: ${current.answer}. ${EXPLAINS[current.answer]}`);
  };

  const next = () => setIndex((i) => Math.min(SCENARIOS.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    setAnswers({});
    setFeedback("");
    setIndex(0);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>
          Scenario {index + 1} / {SCENARIOS.length}
        </span>
        <span className="font-semibold text-slate-900">
          Score: {score}/{Object.keys(answers).length || SCENARIOS.length}
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <p className="text-base font-semibold text-slate-900">{current.prompt}</p>
        <div className="mt-3 grid gap-2">
          {current.options.map((opt) => {
            const chosen = answers[current.id];
            const correct = current.answer === opt;
            const selected = chosen === opt;
            const stateClass =
              chosen && selected
                ? correct
                  ? "border-emerald-200 bg-emerald-50 text-slate-900"
                  : "border-amber-200 bg-amber-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-900 hover:border-sky-200";
            return (
              <button
                key={opt}
                onClick={() => select(opt)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${stateClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-sm text-slate-800">
          {feedback || "Pick a style that fits this scenario."}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={prev}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          onClick={next}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          disabled={index === SCENARIOS.length - 1}
        >
          Next
        </button>
        <button
          onClick={restart}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
