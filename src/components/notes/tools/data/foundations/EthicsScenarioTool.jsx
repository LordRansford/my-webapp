"use client";

import { useState } from "react";

const scenarios = [
  {
    id: 1,
    text: "You have customer addresses collected for deliveries. Marketing asks to use them for a new campaign.",
    options: [
      "Use them because the team already has the data.",
      "Check consent and purpose before sharing.",
      "Send a test campaign to see if anyone complains.",
    ],
    answer: 1,
    note: "Purpose matters. Check consent and limit use to what was agreed.",
  },
  {
    id: 2,
    text: "A model performs worse for a small community group. Data is limited.",
    options: [
      "Ship anyway; the average accuracy is fine.",
      "Flag the gap, look for safe ways to improve data, and be transparent.",
      "Hide the problem to avoid delays.",
    ],
    answer: 1,
    note: "Raise the risk, improve data carefully, and keep transparency.",
  },
  {
    id: 3,
    text: "Logs contain user IDs. An engineer wants to copy them to a personal laptop to debug at home.",
    options: [
      "Allow it to speed up the fix.",
      "Scrub IDs or use a safe environment; never move raw logs to personal devices.",
      "Email the logs to the whole team.",
    ],
    answer: 1,
    note: "Keep data safe and minimise copies. Use a controlled environment.",
  },
];

export default function EthicsScenarioTool() {
  const [choices, setChoices] = useState({});

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Choose the most responsible option for each scenario. Ethics starts with everyday decisions.
      </p>
      <div className="grid gap-3">
        {scenarios.map((scenario) => {
          const chosen = choices[scenario.id];
          const correct = typeof chosen === "number" && chosen === scenario.answer;
          const attempted = typeof chosen === "number";
          return (
            <div key={scenario.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{scenario.text}</p>
              <div className="mt-2 space-y-2">
                {scenario.options.map((option, idx) => {
                  const value = idx;
                  const selected = chosen === value;
                  return (
                    <label
                      key={option}
                      className={`flex items-start gap-2 rounded-lg border px-2 py-2 text-sm ${
                        selected ? "border-sky-400 bg-sky-50" : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`ethics-${scenario.id}`}
                        value={value}
                        checked={selected}
                        onChange={() => setChoices((prev) => ({ ...prev, [scenario.id]: value }))}
                        className="mt-1"
                      />
                      <span className="text-slate-800">{option}</span>
                    </label>
                  );
                })}
              </div>
              {attempted ? (
                <p className={`mt-2 text-xs font-semibold ${correct ? "text-emerald-700" : "text-amber-700"}`}>
                  {correct ? "Responsible choice" : "Safer option highlighted above."} {scenario.note}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
