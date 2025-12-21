"use client";

import { useMemo, useState } from "react";
import { Stethoscope } from "lucide-react";

const SCENARIOS = [
  {
    id: "spam",
    title: "Spam filter for support email",
    model: "Classification",
    data: "Text",
    metric: "Precision",
  },
  {
    id: "forecast",
    title: "Energy demand forecast",
    model: "Regression",
    data: "Time series",
    metric: "MAE",
  },
  {
    id: "recommend",
    title: "Content recommendations",
    model: "Ranking",
    data: "Clicks",
    metric: "Recall",
  },
];

const OPTIONS = {
  model: ["Classification", "Regression", "Ranking"],
  data: ["Text", "Images", "Time series", "Clicks"],
  metric: ["Precision", "Recall", "F1", "MAE"],
};

export default function ScenarioClinicGame() {
  const [answers, setAnswers] = useState({});

  const score = useMemo(() => {
    return SCENARIOS.reduce((count, scenario) => {
      const result = answers[scenario.id];
      if (!result) return count;
      const correct =
        result.model === scenario.model &&
        result.data === scenario.data &&
        result.metric === scenario.metric;
      return correct ? count + 1 : count;
    }, 0);
  }, [answers]);

  const update = (id, key, value) => {
    setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Stethoscope className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">AI scenario clinic</p>
          <p className="text-xs text-slate-600">Choose the model, data, and metric that fit.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {SCENARIOS.map((scenario) => (
          <div key={scenario.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <p className="text-xs font-semibold text-slate-900">{scenario.title}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {["model", "data", "metric"].map((key) => (
                <label key={`${scenario.id}-${key}`} className="text-sm font-semibold text-slate-600">
                  {key}
                  <select
                    value={answers[scenario.id]?.[key] || ""}
                    onChange={(event) => update(scenario.id, key, event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                  >
                    <option value="">Select</option>
                    {OPTIONS[key].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Suggested: {scenario.model} | {scenario.data} | {scenario.metric}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold text-slate-700">
          Score: {score} of {SCENARIOS.length}
        </p>
        <p className="mt-2 text-xs text-slate-600">Pick the combo that best matches the real world risk.</p>
      </div>
    </div>
  );
}
