"use client";

import { useMemo, useState } from "react";

const QUESTIONS = [
  {
    level: "beginner",
    topic: "cia",
    question: "What does confidentiality aim to protect?",
    options: ["Keeping data available", "Keeping data unchanged", "Keeping data secret from the wrong people", "Keeping logs centralised"],
    answer: 2,
    explain: "Confidentiality is about restricting access to those who are authorised.",
  },
  {
    level: "beginner",
    topic: "auth",
    question: "Why use multi-factor authentication (MFA)?",
    options: ["To speed logins", "To reduce password complexity", "To add an extra proof beyond the password", "To avoid auditing"],
    answer: 2,
    explain: "MFA adds an additional factor so stolen passwords alone are insufficient.",
  },
  {
    level: "intermediate",
    topic: "logs",
    question: "What makes a log line more useful for investigations?",
    options: ["Short messages", "Including correlation/trace IDs", "Removing timestamps", "Rotating logs hourly"],
    answer: 1,
    explain: "Correlation IDs let you link events across services.",
  },
  {
    level: "intermediate",
    topic: "crypto",
    question: "Why salt passwords before hashing?",
    options: ["To speed hashing", "To make rainbow tables ineffective", "To reduce entropy", "To avoid using hashes"],
    answer: 1,
    explain: "Salts make precomputed hash tables useless against stored passwords.",
  },
  {
    level: "advanced",
    topic: "risk",
    question: "Which best describes risk?",
    options: ["The number of servers you own", "Threat × vulnerability × impact", "Only regulatory fines", "A fixed score"],
    answer: 1,
    explain: "Risk is often thought of as likelihood (threat/vulnerability) times impact.",
  },
  {
    level: "advanced",
    topic: "network",
    question: "Why segment networks?",
    options: ["To increase broadcast domains", "To limit blast radius and lateral movement", "To reduce password resets", "To speed CI/CD"],
    answer: 1,
    explain: "Segmentation limits the spread of compromise.",
  },
  {
    level: "intermediate",
    topic: "threat-model",
    question: "A good threat model outcome is:",
    options: ["More features", "List of plausible attacks and mitigations", "Fewer logs", "Fewer teams"],
    answer: 1,
    explain: "Threat modelling surfaces likely attacks and prioritised mitigations.",
  },
  {
    level: "beginner",
    topic: "phishing",
    question: "A common phishing clue is:",
    options: ["Consistent branding", "Legit domain", "Urgent language plus odd links", "Expected sender"],
    answer: 2,
    explain: "Urgency and strange links/senders are classic phishing tells.",
  },
];

const SESSION_LENGTH = 10;
const TIMER_SECONDS = 90;

function sampleQuestions() {
  const pool = [...QUESTIONS];
  const result = [];
  while (result.length < SESSION_LENGTH && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

export default function QuickFireQuizGame() {
  const [session, setSession] = useState(sampleQuestions());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(() => Date.now());

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

  const timeRemaining = useMemo(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    return Math.max(0, Math.round(TIMER_SECONDS - elapsed));
  }, [startTime, answered, index]);

  const answer = (optionIndex) => {
    if (finished || !current) return;
    const isCorrect = optionIndex === current.answer;
    setScore((s) => s + (isCorrect ? 1 : 0));
    setAnswered((prev) => [...prev, { level: current.level, isCorrect }]);

    setTimeout(() => {
      if (index === session.length - 1 || timeRemaining <= 0) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 250);
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
            <span className="font-semibold text-slate-900">Score: {score}</span>
            <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800">
              {timeRemaining}s left
            </span>
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
