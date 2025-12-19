"use client";

import { useState } from "react";

const scenarios = [
  {
    id: 1,
    text: "A dashboard is showing inconsistent numbers. Someone needs to trace the source and fix the pipeline.",
    answer: "Data engineer",
  },
  {
    id: 2,
    text: "A new dataset is about to be shared with a partner. Someone must decide who can access it and why.",
    answer: "Data owner",
  },
  {
    id: 3,
    text: "Metadata is messy and no one knows what fields mean. Someone has to define and maintain standards.",
    answer: "Data steward",
  },
  {
    id: 4,
    text: "Leadership asks for patterns in customer complaints across channels.",
    answer: "Data analyst",
  },
];

const roles = ["Data owner", "Data steward", "Data engineer", "Data analyst", "Data consumer"];

export default function RoleMatcherTool() {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Match each scenario to the role best suited to handle it. This keeps accountability clear.
      </p>
      <div className="grid gap-3">
        {scenarios.map((scenario) => {
          const selected = answers[scenario.id] || "";
          const correct = selected && selected === scenario.answer;
          const attempted = Boolean(selected);
          return (
            <div key={scenario.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{scenario.text}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`role-${scenario.id}`}>
                  Choose role
                </label>
                <select
                  id={`role-${scenario.id}`}
                  value={selected}
                  onChange={(e) => handleChange(scenario.id, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-sky-200 sm:w-60"
                >
                  <option value="">Choose role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {attempted ? (
                  <span className={`text-xs font-semibold ${correct ? "text-emerald-700" : "text-amber-700"}`}>
                    {correct ? "Good match" : `Better match: ${scenario.answer}`}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
