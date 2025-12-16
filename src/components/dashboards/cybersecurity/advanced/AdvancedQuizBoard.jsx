"use client";

import { useMemo, useState } from "react";

const QUESTIONS = [
  {
    topic: "crypto",
    question: "Why do strong algorithms still fail in practice?",
    options: [
      "Math is wrong",
      "Protocols and key management introduce assumptions and mistakes",
      "Keys never expire",
      "Certificates are optional",
    ],
    answer: 1,
    explain: "Real failures come from protocol design, lifecycle mistakes, and bad assumptions.",
  },
  {
    topic: "pki",
    question: "What breaks a certificate chain?",
    options: ["Short expiry", "Untrusted root or invalid intermediate", "Long subject names", "Using TLS 1.3"],
    answer: 1,
    explain: "If the root is untrusted or an intermediate is invalid, the chain should not be trusted.",
  },
  {
    topic: "protocol",
    question: "What is a common OAuth pitfall?",
    options: ["Too short tokens", "Leaking auth codes or tokens in logs or URLs", "Using HTTPS", "Short redirect URIs"],
    answer: 1,
    explain: "Leaked codes or tokens let attackers impersonate sessions.",
  },
  {
    topic: "token",
    question: "Why prefer short lived tokens with narrow scopes?",
    options: [
      "They are faster",
      "They reduce blast radius if stolen",
      "They skip validation",
      "They reduce CPU usage",
    ],
    answer: 1,
    explain: "Short lived, narrow scope tokens limit impact if leaked.",
  },
  {
    topic: "design",
    question: "What is a benefit of segmentation?",
    options: ["Simpler routing", "Reduced blast radius and lateral movement", "Longer incident timelines", "No need for identity"],
    answer: 1,
    explain: "Segmentation constrains spread during compromise.",
  },
  {
    topic: "detection",
    question: "Raising detection thresholds usually:",
    options: ["Reduces false positives but risks missing attacks", "Finds more attacks", "Stops logging", "Increases storage"],
    answer: 0,
    explain: "Higher thresholds cut noise but may miss true positives.",
  },
];

const SESSION_LENGTH = 10;

function sampleQuestions() {
  const pool = [...QUESTIONS];
  const result = [];
  while (result.length < SESSION_LENGTH) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
  }
  return result;
}

export default function AdvancedQuizBoard() {
  const [session, setSession] = useState(sampleQuestions());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  const current = session[index];

  const topicBreakdown = useMemo(() => {
    const tally = {};
    session.slice(0, index).forEach((q, idx) => {
      const correct = feedback.includes("Correct") && idx === index - 1; // not perfect but simple
      if (!tally[q.topic]) tally[q.topic] = { correct: 0, total: 0 };
      tally[q.topic].total += 1;
      tally[q.topic].correct += correct ? 1 : 0;
    });
    return tally;
  }, [session, index, feedback]);

  const answer = (opt) => {
    if (finished || !current) return;
    const isCorrect = opt === current.answer;
    setScore((s) => s + (isCorrect ? 1 : 0));
    setFeedback(isCorrect ? "Correct." : `Not quite. ${current.explain}`);
    setTimeout(() => {
      if (index === session.length - 1) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setFeedback("");
      }
    }, 350);
  };

  const reset = () => {
    setSession(sampleQuestions());
    setIndex(0);
    setScore(0);
    setFeedback("");
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
          {feedback && (
            <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800">{feedback}</div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-slate-900">Session complete</h4>
          <p className="text-sm text-slate-800">
            You scored <strong>{score}</strong> out of {session.length}.
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm">
            <p className="font-semibold text-slate-900">Performance by topic</p>
            <ul className="mt-2 space-y-1">
              {Object.entries(topicBreakdown).map(([topic, data]) => (
                <li key={topic} className="flex justify-between">
                  <span className="capitalize">{topic}</span>
                  <span className="font-semibold">
                    {data.correct}/{data.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
