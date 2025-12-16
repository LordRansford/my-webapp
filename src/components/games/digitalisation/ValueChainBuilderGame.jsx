"use client";

import { useMemo, useState } from "react";

const IDEAL_CHAIN = [
  {
    id: "capture",
    label: "Capture data",
    detail: "Collect data at the source with context so it can be trusted later.",
    value: 20,
    risk: "If it is wrong or missing, everything above it suffers.",
  },
  {
    id: "store",
    label: "Store and govern data",
    detail: "Keep data usable with clear ownership, quality checks, and lineage.",
    value: 20,
    risk: "Poor stewardship leads to mistrust and rework.",
  },
  {
    id: "share",
    label: "Share with the right parties",
    detail: "Make data discoverable and sharable with the right controls.",
    value: 15,
    risk: "Bottlenecks stop teams; over-sharing creates risk.",
  },
  {
    id: "analyse",
    label: "Analyse and model",
    detail: "Generate insights and models that answer real questions.",
    value: 25,
    risk: "If questions are wrong, analysis is wasted effort.",
  },
  {
    id: "embed",
    label: "Embed insights into decisions and automation",
    detail: "Put insights into everyday tools, processes, and automation.",
    value: 20,
    risk: "Insights only matter if they drive decisions and action.",
  },
];

export default function ValueChainBuilderGame() {
  const [steps, setSteps] = useState(shuffle(IDEAL_CHAIN));
  const [checked, setChecked] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const move = (index, delta) => {
    const next = [...steps];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
  };

  const reset = () => {
    setSteps(shuffle(IDEAL_CHAIN));
    setChecked(false);
    setShowIdeal(false);
  };

  const accuracy = useMemo(() => {
    const correct = steps.filter((s, idx) => s.id === IDEAL_CHAIN[idx].id).length;
    return Math.round((correct / IDEAL_CHAIN.length) * 100);
  }, [steps]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-2">
          <h4 className="text-base font-semibold text-slate-900">Arrange the steps</h4>
          <p className="text-sm text-slate-700">Move steps to form a strong data and digital value chain.</p>
          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isCorrect = step.id === IDEAL_CHAIN[idx].id;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm shadow-sm ${
                    checked ? (isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50") : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{step.label}</div>
                    <div className="text-sm text-slate-700">{step.detail}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      className="rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-40"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                    >
                      ↑
                    </button>
                    <button
                      className="rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-40"
                      onClick={() => move(idx, 1)}
                      disabled={idx === steps.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
              onClick={() => setChecked(true)}
            >
              Check order
            </button>
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
              onClick={() => setShowIdeal((v) => !v)}
            >
              {showIdeal ? "Hide ideal chain" : "Show ideal chain"}
            </button>
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
              onClick={reset}
            >
              Reset
            </button>
          </div>

          {checked && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              Accuracy: <strong>{accuracy}%</strong>. Green = correct position, amber = needs adjustment.
            </div>
          )}
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h5 className="text-sm font-semibold text-slate-900">Where value appears</h5>
            <div className="mt-2 space-y-2">
              {IDEAL_CHAIN.map((step) => (
                <div key={step.id}>
                  <div className="flex items-center justify-between text-sm text-slate-800">
                    <span>{step.label}</span>
                    <span className="font-medium">{step.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-sky-400" style={{ width: `${step.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showIdeal && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-900 shadow-sm">
              <h5 className="mb-2 text-sm font-semibold text-emerald-800">Ideal chain</h5>
              <ol className="space-y-1 list-decimal list-inside">
                {IDEAL_CHAIN.map((step) => (
                  <li key={step.id}>{step.label}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
