"use client";

import { useMemo, useState } from "react";

const EMAILS = [
  {
    id: 1,
    from: "IT Support <it-support@example.com>",
    subject: "Action required: reset your password today",
    body: "Hi,\nWe detected unusual sign-in attempts. Please reset your password using the secure portal.\n\nThanks,\nIT",
    label: "phishing",
    explain: "Urgent language and unexpected reset request. Verify through official portal.",
  },
  {
    id: 2,
    from: "Finance <finance@example.com>",
    subject: "Invoice for review",
    body: "Hello,\nPlease review the attached invoice for the last sprint.\nWe used the standard template.\n\nThank you.",
    label: "safe",
    explain: "Normal tone, expected context, no odd links.",
  },
  {
    id: 3,
    from: "Cloud Admin <cloud-admin@cloud-security.com>",
    subject: "Your account will be closed",
    body: "We are closing inactive accounts today. Click here now to keep access.",
    label: "phishing",
    explain: "External sender, urgency, and generic link request.",
  },
  {
    id: 4,
    from: "Colleague <ada@example.com>",
    subject: "Slides for tomorrow",
    body: "Here are the slides we discussed. Let me know if you want me to trim sections 3 and 4.",
    label: "safe",
    explain: "Expected collaboration and normal tone.",
  },
];

export default function PhishingSpotterGame() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);

  const current = EMAILS[index];

  const decide = (choice) => {
    if (!current) return;
    const correct = choice === current.label;
    setScore((s) => s + (correct ? 1 : 0));
    setAnswered((prev) => [...prev, { id: current.id, correct }]);
  };

  const next = () => {
    setIndex((i) => Math.min(EMAILS.length - 1, i + 1));
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setAnswered([]);
  };

  const lastAnswer = useMemo(() => answered.find((a) => a.id === current?.id), [answered, current]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>
          Email {index + 1} / {EMAILS.length}
        </span>
        <span className="font-semibold text-slate-900">Score: {score}</span>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="text-sm text-slate-800">
          <div className="font-semibold text-slate-900">From: {current.from}</div>
          <div className="font-semibold text-slate-900">Subject: {current.subject}</div>
        </div>
        <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900">
          {current.body}
        </pre>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {["safe", "phishing"].map((choice) => (
            <button
              key={choice}
              onClick={() => decide(choice)}
              disabled={!!lastAnswer}
              className={`w-full rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                lastAnswer
                  ? choice === current.label
                    ? "border-emerald-200 bg-emerald-50 text-slate-900"
                    : "border-slate-200 bg-white text-slate-900"
                  : "border-slate-200 bg-white text-slate-900 hover:border-sky-200"
              }`}
            >
              {choice === "safe" ? "Looks safe" : "Looks suspicious"}
            </button>
          ))}
        </div>

        {lastAnswer && (
          <div
            className={`mt-3 rounded-lg border p-3 text-sm ${
              lastAnswer.correct ? "border-emerald-200 bg-emerald-50 text-slate-900" : "border-amber-200 bg-amber-50 text-slate-900"
            }`}
          >
            {lastAnswer.correct ? "Correct." : "Worth a closer look."} {current.explain}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={next}
            disabled={index === EMAILS.length - 1}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          >
            Next email
          </button>
          <button
            onClick={restart}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Restart set
          </button>
        </div>
      </div>
    </div>
  );
}
