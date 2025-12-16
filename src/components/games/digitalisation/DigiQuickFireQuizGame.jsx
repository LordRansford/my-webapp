"use client";

import { useMemo, useState } from "react";

const QUESTIONS = [
  {
    level: "beginner",
    question: "What distinguishes digitalisation from buying new technology?",
    options: [
      "It replaces people with machines",
      "It changes how value is created using data, software, and process together",
      "It only moves services online",
      "It only reduces cost",
    ],
    answer: 1,
    explain: "Digitalisation changes how the organisation works and delivers value; tools are only one part.",
    link: "/digitalisation/beginner",
  },
  {
    level: "beginner",
    question: "Where does most value emerge in a digital value chain?",
    options: ["At capture", "At governance", "When insights are embedded into decisions and action", "At storage"],
    answer: 2,
    explain: "Insights matter when they change decisions and action.",
    link: "/digitalisation/beginner",
  },
  {
    level: "intermediate",
    question: "What is a digital spine?",
    options: [
      "A central server",
      "Shared platforms, data, and services other teams build on",
      "An outsourced IT contract",
      "A single website",
    ],
    answer: 1,
    explain: "A digital spine is reusable shared capability that lets teams move faster together.",
    link: "/digitalisation/intermediate",
  },
  {
    level: "intermediate",
    question: "Why do federated operating models often use shared standards?",
    options: ["To slow teams", "To ensure local teams can plug into common platforms safely", "To centralize all work", "To avoid budgeting"],
    answer: 1,
    explain: "Standards keep interoperability and trust while allowing local autonomy.",
    link: "/digitalisation/intermediate",
  },
  {
    level: "advanced",
    question: "What is a common risk when digitalising across an ecosystem?",
    options: ["Too much local ownership", "Fragmented interfaces and duplicated data", "Too few vendors", "Excess documentation"],
    answer: 1,
    explain: "Ecosystem digitalisation fails when interfaces and data are inconsistent or duplicated.",
    link: "/digitalisation/advanced",
  },
  {
    level: "advanced",
    question: "Which lever helps sector-wide digitalisation stay aligned?",
    options: ["Hidden APIs", "Short term pilots only", "Regulatory or funding levers that reward shared standards", "Ignoring interoperability"],
    answer: 2,
    explain: "Aligned incentives and standards keep many organisations moving together.",
    link: "/digitalisation/advanced",
  },
  {
    level: "intermediate",
    question: "What is a good sign of healthy governance for digital products?",
    options: [
      "Approvals are ad hoc",
      "High-risk changes are clear and have known approvers",
      "No change control exists",
      "Only procurement decides priorities",
    ],
    answer: 1,
    explain: "Clear paths for high-risk changes keep speed and safety in balance.",
    link: "/digitalisation/intermediate",
  },
  {
    level: "beginner",
    question: "Why should data capture include context?",
    options: ["It reduces storage", "Context ensures data can be trusted and reused later", "It speeds up emails", "It avoids governance"],
    answer: 1,
    explain: "Context makes data reusable and trustworthy across the chain.",
    link: "/digitalisation/beginner",
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

export default function DigiQuickFireQuizGame() {
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
    const entry = { level: current.level, isCorrect };
    setAnswered((prev) => [...prev, entry]);

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
          {answered.length > 0 && answered[answered.length - 1].level === current.level ? null : null}
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
