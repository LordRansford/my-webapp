"use client";

import { useMemo, useState } from "react";
import { Sparkle } from "lucide-react";

const SETS = [
  {
    id: "context",
    title: "Context and tokens",
    items: ["Token", "Context window", "Vector store", "Packet sniffer"],
    answer: "Packet sniffer",
  },
  {
    id: "metrics",
    title: "Evaluation",
    items: ["Precision", "Recall", "F1", "Dockerfile"],
    answer: "Dockerfile",
  },
  {
    id: "safety",
    title: "Safety",
    items: ["Guardrail", "Red teaming", "Model card", "Overflow stack"],
    answer: "Overflow stack",
  },
];

export default function OddOneOutGame() {
  const [answers, setAnswers] = useState({});

  const score = useMemo(
    () => SETS.reduce((total, set) => total + (answers[set.id] === set.answer ? 1 : 0), 0),
    [answers]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 ring-1 ring-purple-100">
          <Sparkle className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Odd one out</p>
          <p className="text-xs text-slate-600">Pick the item that does not fit the AI idea.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {SETS.map((set) => (
          <div key={set.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <p className="text-xs font-semibold text-slate-900">{set.title}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-4">
              {set.items.map((item) => {
                const active = answers[set.id] === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [set.id]: item }))}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      active ? "border-purple-300 bg-white text-purple-800" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold text-slate-900">
          Score: {score} of {SETS.length}
        </p>
        <p className="mt-1 text-sm text-slate-600">If you miss one, check which concept set you mixed up.</p>
      </div>
    </div>
  );
}
