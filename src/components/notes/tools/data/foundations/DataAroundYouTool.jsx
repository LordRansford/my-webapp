"use client";

import { useState } from "react";

const samples = [
  { id: 1, text: "Temperature reading: 21°C at 09:00", answer: "data" },
  { id: 2, text: "Chart showing daily sales trend", answer: "information" },
  { id: 3, text: "Advice to stock more umbrellas next week", answer: "knowledge" },
  { id: 4, text: "Heart rate sensor stream from a smartwatch", answer: "data" },
  { id: 5, text: "Doctor explains likely recovery plan", answer: "knowledge" },
  { id: 6, text: "API JSON response with account balance numbers", answer: "data" },
];

const options = [
  { value: "data", label: "Data" },
  { value: "information", label: "Information" },
  { value: "knowledge", label: "Knowledge" },
];

export default function DataAroundYouTool() {
  const [choices, setChoices] = useState({});

  const setChoice = (id, value) => {
    setChoices((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Pick whether each example is data, information, or knowledge. Answers are revealed as you choose.
      </p>
      <div className="grid gap-3">
        {samples.map((sample) => {
          const selected = choices[sample.id];
          const correct = selected && selected === sample.answer;
          const attempted = Boolean(selected);
          return (
            <div
              key={sample.id}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-900">{sample.text}</p>
                <label className="text-xs text-slate-700">
                  <span className="sr-only">Select type for {sample.text}</span>
                  <select
                    value={selected || ""}
                    onChange={(e) => setChoice(sample.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-sky-200 sm:w-40"
                  >
                    <option value="">Choose...</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {attempted ? (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    correct ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {correct ? "Correct" : `It is ${sample.answer}.`}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
