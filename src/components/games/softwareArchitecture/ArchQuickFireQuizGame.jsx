"use client";

import { useMemo, useState } from "react";

const QUESTIONS = [
  {
    level: "beginner",
    question: "What is a monolith?",
    options: [
      "A set of independent services",
      "A single deployable application containing many responsibilities",
      "An API gateway",
      "A data warehouse",
    ],
    answer: 1,
    explain: "A monolith ships as one deployable unit and often includes many concerns.",
    link: "/software-architecture/beginner",
  },
  {
    level: "beginner",
    question: "What does a layered architecture separate?",
    options: ["UI, business logic, and data access", "Frontend and mobile", "Caching and logging", "Dev and ops"],
    answer: 0,
    explain: "Layers split UI, business logic, and data access with one-way dependencies.",
    link: "/software-architecture/beginner",
  },
  {
    level: "intermediate",
    question: "Which quality attribute focuses on handling more load?",
    options: ["Reliability", "Scalability", "Modifiability", "Usability"],
    answer: 1,
    explain: "Scalability is about sustaining performance as load grows.",
    link: "/software-architecture/intermediate",
  },
  {
    level: "intermediate",
    question: "What pattern helps slowly replace a legacy system without a big bang?",
    options: ["Big rewrite", "Strangler pattern", "Shared database", "Batch exports only"],
    answer: 1,
    explain: "The strangler pattern carves off pieces gradually while the legacy keeps running.",
    link: "/software-architecture/intermediate",
  },
  {
    level: "advanced",
    question: "What is a common risk in microservices?",
    options: ["Too little autonomy", "Operational and integration complexity", "Single deploy unit", "No need for monitoring"],
    answer: 1,
    explain: "Microservices add operational overhead and demand strong observability and integration discipline.",
    link: "/software-architecture/advanced",
  },
  {
    level: "advanced",
    question: "Event-driven systems primarily help with:",
    options: ["Tightly coupling services", "Decoupling producers and consumers", "Removing the need for logs", "Avoiding retries"],
    answer: 1,
    explain: "Events decouple producers and consumers in time and scale, but need monitoring.",
    link: "/software-architecture/advanced",
  },
  {
    level: "intermediate",
    question: "Why track correlation or trace IDs?",
    options: ["To enforce auth", "To connect logs/traces across services", "To speed up the DB", "To reduce CPU"],
    answer: 1,
    explain: "Correlation IDs let you follow a request across services for debugging and observability.",
    link: "/software-architecture/intermediate",
  },
  {
    level: "beginner",
    question: "What is a quality attribute trade-off example?",
    options: [
      "Improving latency can increase complexity",
      "Improving latency always improves security",
      "Improving modifiability never impacts reliability",
      "Trade-offs don't exist",
    ],
    answer: 0,
    explain: "Optimizing one quality often affects another, e.g., caching improves latency but adds complexity.",
    link: "/software-architecture/beginner",
  },
];

const SESSION_LENGTH = 10;

function sampleQuestions() {
  const pool = [...QUESTIONS];
  const result = [];
  while (result.length < SESSION_LENGTH && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

export default function ArchQuickFireQuizGame() {
  const [session, setSession] = useState(sampleQuestions());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);

  const current = session[index];

  const levelBreakdown = useMemo(() => {
    const tally = {};
    answered.forEach((a) => {
      if (!tally[a.level]) tally[a.level] = { correct: 0, total: 0 };
      tally[a.level].total += 1;
      tally[a.level].correct += a.isCorrect ? 1 : 0;
    });
    return tally;
  }, [answered]);

  const answer = (optionIndex) => {
    if (finished || !current) return;
    const isCorrect = optionIndex === current.answer;
    setScore((s) => s + (isCorrect ? 1 : 0));
    setAnswered((prev) => [...prev, { level: current.level, isCorrect }]);

    setTimeout(() => {
      if (index === session.length - 1 || session.length === 0) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 300);
  };

  const reset = () => {
    setSession(sampleQuestions());
    setIndex(0);
    setScore(0);
    setAnswered([]);
    setFinished(false);
  };

  if (!current && !finished) return null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      {!finished ? (
        <>
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>
              Question {index + 1} / {session.length}
            </span>
            <span className="font-medium">Score: {score}</span>
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
        </>
      ) : (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-slate-900">Session complete</h4>
          <p className="text-sm text-slate-800">
            You scored <strong>{score}</strong> out of {session.length}.
          </p>
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm">
            <p className="font-semibold text-slate-900">Performance by level</p>
            {["beginner", "intermediate", "advanced"].map((level) => {
              const data = levelBreakdown[level] || { correct: 0, total: 0 };
              return (
                <div key={level} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{level}</span>
                  <span className="font-medium">
                    {data.correct} / {data.total || 0}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-slate-800">
            Suggested review:{" "}
            {Object.entries(levelBreakdown)
              .sort((a, b) => (a[1].correct / (a[1].total || 1)) - (b[1].correct / (b[1].total || 1)))
              .map(([level]) => level)[0] || "beginner"}{" "}
            notes.
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
