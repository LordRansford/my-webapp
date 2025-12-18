"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, CheckCircle2 } from "lucide-react";

const CORRECT = [
  { id: "data", label: "Collect raw data" },
  { id: "clean", label: "Clean and validate" },
  { id: "features", label: "Create features" },
  { id: "train", label: "Train the model" },
  { id: "eval", label: "Evaluate metrics" },
  { id: "serve", label: "Serve and monitor" },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function PipelineBuilderGame() {
  const [steps, setSteps] = useState(() => shuffle(CORRECT));
  const [status, setStatus] = useState("idle");

  const move = (index, direction) => {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setStatus("idle");
  };

  const check = () => {
    const correct = steps.every((step, index) => step.id === CORRECT[index].id);
    setStatus(correct ? "correct" : "wrong");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Build a tiny pipeline</p>
          <p className="text-xs text-slate-600">Put the steps in a sensible order.</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-2">
            <span className="flex-1 text-xs font-semibold text-slate-700">{step.label}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:border-slate-300"
                aria-label="Move step up"
              >
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:border-slate-300"
                aria-label="Move step down"
              >
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={check}
          className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Check order
        </button>
        {status === "correct" && <span className="text-xs font-semibold text-emerald-700">Great. The flow is correct.</span>}
        {status === "wrong" && <span className="text-xs font-semibold text-amber-700">Close. Try again.</span>}
      </div>
    </div>
  );
}
