"use client";

import { useMemo, useState } from "react";

const STEPS = [
  {
    id: "ad-hoc",
    title: "Ad hoc and manual",
    description: "Work is manual, data sits in spreadsheets, and change depends on heroes.",
    signals: ["spreadsheets emailed around", "no shared glossary", "changes happen via side chats"],
    actions: ["Pick one process to stabilise", "Create a single glossary for key terms"],
  },
  {
    id: "repeatable",
    title: "Repeatable and documented",
    description: "Key processes are written down, and the same task is done the same way.",
    signals: ["basic runbooks exist", "simple access controls", "starter API standards"],
    actions: ["Automate a high-volume task", "Create a shared data catalogue"],
  },
  {
    id: "integrated",
    title: "Measured and integrated",
    description: "Systems connect through APIs, metrics are tracked, and teams share platforms.",
    signals: ["dashboards with clear owners", "versioned APIs", "incident reviews"],
    actions: ["Add SLOs for key services", "Invest in shared identity and logging"],
  },
  {
    id: "optimised",
    title: "Optimised and data driven",
    description: "Teams ship small changes often, use experiments, and steer with trusted data.",
    signals: ["feature flags", "A/B tests", "automated quality gates", "clear product owners"],
    actions: ["Expand experimentation safely", "Fund platform capabilities as products"],
  },
];

export default function MaturityPathGame() {
  const [index, setIndex] = useState(0);
  const [slider, setSlider] = useState(0);

  const current = useMemo(() => STEPS[index], [index]);
  const sliderStep = useMemo(() => STEPS[Math.round(slider)], [slider]);

  const next = () => setIndex((i) => Math.min(STEPS.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-3">
          <h4 className="text-base font-semibold text-slate-900">Step through maturity</h4>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">{current.title}</span>
              <span className="text-xs text-slate-700">
                {index + 1} / {STEPS.length}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-800">{current.description}</p>
            <div className="mt-2 text-sm text-slate-800">
              <span className="font-semibold">Signals:</span>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {current.signals.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2 text-sm text-slate-800">
              <span className="font-semibold">Next actions:</span>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {current.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={prev}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
                disabled={index === 0}
              >
                Previous
              </button>
              <button
                onClick={next}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
                disabled={index === STEPS.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h5 className="text-sm font-semibold text-slate-900">Where are you now?</h5>
            <input
              type="range"
              min={0}
              max={STEPS.length - 1}
              step={1}
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="mt-2 w-full accent-sky-500"
              aria-label="Set current maturity level"
            />
            <div className="mt-2 text-sm text-slate-800">
              You set: <strong>{sliderStep.title}</strong>
            </div>
            <div className="mt-1 text-sm text-slate-700">
              Suggested next actions:
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {sliderStep.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
