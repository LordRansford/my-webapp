"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Shuffle } from "lucide-react";

const STYLES = ["Monolith", "Modular monolith", "Microservices", "Serverless"];

const SCENARIOS = [
  {
    id: "small-team",
    prompt: "A small team shipping one product with tight deadlines.",
    answer: "Monolith",
    hint: "Keep it simple and deploy as one unit while the product is young.",
  },
  {
    id: "shared-core",
    prompt: "A large codebase where teams need clear boundaries but shared release cycles.",
    answer: "Modular monolith",
    hint: "Modular boundaries reduce chaos without adding distributed system overhead.",
  },
  {
    id: "independent-services",
    prompt: "Multiple teams need to deploy and scale features independently.",
    answer: "Microservices",
    hint: "Independent deployment and ownership matter more than simple deployment.",
  },
  {
    id: "event-spikes",
    prompt: "Spiky workloads with short lived tasks and unpredictable traffic.",
    answer: "Serverless",
    hint: "Event driven compute avoids paying for idle capacity.",
  },
];

const feedbackFor = (scenario, choice) => {
  if (!choice) {
    return { tone: "text-slate-500", text: "Pick a style to see feedback." };
  }
  if (choice === scenario.answer) {
    return { tone: "text-emerald-700", text: "Good fit. This matches the scenario." };
  }
  return { tone: "text-amber-700", text: scenario.hint };
};

export default function StyleMatcherTool() {
  const [answers, setAnswers] = useState({});

  const correctCount = useMemo(
    () => SCENARIOS.filter((scenario) => answers[scenario.id] === scenario.answer).length,
    [answers]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <Shuffle className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Style matcher</p>
          <p className="text-xs text-slate-600">Match each situation to a sensible architecture style.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {SCENARIOS.map((scenario) => {
          const feedback = feedbackFor(scenario, answers[scenario.id]);
          return (
            <div key={scenario.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <p className="text-xs font-semibold text-slate-900">{scenario.prompt}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="text-xs font-semibold text-slate-600" htmlFor={`${scenario.id}-style`}>
                  Pick a style
                </label>
                <select
                  id={`${scenario.id}-style`}
                  value={answers[scenario.id] || ""}
                  onChange={(event) =>
                    setAnswers((prev) => ({ ...prev, [scenario.id]: event.target.value }))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Select</option>
                  {STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
              <p className={`mt-2 text-xs ${feedback.tone}`}>{feedback.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
        <span className="flex items-center gap-2 font-semibold text-slate-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {correctCount} of {SCENARIOS.length} correct
        </span>
        <button
          type="button"
          onClick={() => setAnswers({})}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
