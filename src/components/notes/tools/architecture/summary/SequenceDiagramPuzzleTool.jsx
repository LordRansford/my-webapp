"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, CheckCircle2, RefreshCcw } from "lucide-react";

const CORRECT_STEPS = [
  { id: "request", label: "User sends request to API gateway" },
  { id: "auth", label: "Gateway checks auth and routes request" },
  { id: "service", label: "Service processes and calls database" },
  { id: "response", label: "Service returns response to user" },
];

const shuffleSteps = (steps) => {
  const copy = [...steps];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function SequenceDiagramPuzzleTool() {
  const [steps, setSteps] = useState(() => shuffleSteps(CORRECT_STEPS));
  const [status, setStatus] = useState("idle");

  const moveStep = (index, direction) => {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setStatus("idle");
  };

  const checkOrder = () => {
    const isCorrect = steps.every((step, index) => step.id === CORRECT_STEPS[index].id);
    setStatus(isCorrect ? "correct" : "wrong");
  };

  const reset = () => {
    setSteps(shuffleSteps(CORRECT_STEPS));
    setStatus("idle");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Sequence diagram puzzle</p>
          <p className="text-xs text-slate-600">Reorder the steps so the flow makes sense.</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-2">
            <div className="flex-1 text-xs font-semibold text-slate-700">{step.label}</div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveStep(index, -1)}
                className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:border-slate-300"
                aria-label="Move step up"
              >
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveStep(index, 1)}
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
          onClick={checkOrder}
          className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Check order
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        >
          <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Shuffle
        </button>
        {status === "correct" && (
          <span className="text-xs font-semibold text-emerald-700">Nice. The flow is correct.</span>
        )}
        {status === "wrong" && (
          <span className="text-xs font-semibold text-amber-700">Close. Two steps are still out of place.</span>
        )}
      </div>
    </div>
  );
}
