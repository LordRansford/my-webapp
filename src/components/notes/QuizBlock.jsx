"use client";

import { useEffect, useState } from "react";

export default function QuizBlock({ title = "Quiz", questions = [] }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("quiz-block") : null;
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("quiz-block", JSON.stringify(answers));
    }
  }, [answers]);

  return (
    <section className="my-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <div className="mt-3 space-y-3">
        {questions.map((q, idx) => {
          const isOpen = answers[idx]?.open;
          return (
            <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900">{q.q}</p>
              <button
                className="mt-2 rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [idx]: { open: !isOpen },
                  }))
                }
              >
                {isOpen ? "Hide answer" : "Show answer"}
              </button>
              {isOpen ? <p className="mt-2 text-sm text-gray-800">{q.a}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
