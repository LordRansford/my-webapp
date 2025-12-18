"use client";

import { useEffect, useMemo, useState } from "react";

const scenarios = [
  {
    id: "meeting",
    title: "Plan a team meeting",
    steps: [
      "Clarify goal and attendees",
      "Check calendar tool for open slots",
      "Draft agenda in notes tool",
      "Send a short summary to the team",
    ],
  },
  {
    id: "report",
    title: "Summarise a weekly report",
    steps: [
      "Read the report document",
      "Extract key metrics and risks",
      "Draft a two paragraph summary",
      "Flag open questions for review",
    ],
  },
];

export default function AgentToyLabTool() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) || scenarios[0],
    [scenarioId]
  );

  useEffect(() => {
    if (!running) return undefined;
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= scenario.steps.length - 1) {
          clearInterval(interval);
          setRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [running, scenario.steps.length]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <label className="block text-xs font-semibold text-gray-600">Goal</label>
      <select
        value={scenarioId}
        onChange={(e) => {
          setScenarioId(e.target.value);
          setActiveStep(-1);
          setRunning(false);
        }}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      >
        {scenarios.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setRunning(true)}
        disabled={running}
        className="rounded-full border border-blue-500 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 disabled:opacity-60"
      >
        {running ? "Running steps" : "Run steps"}
      </button>

      <ol className="space-y-2">
        {scenario.steps.map((step, index) => {
          const complete = index <= activeStep;
          return (
            <li key={step} className="rounded-xl border border-gray-200 bg-white/70 p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-800">{step}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    complete ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {complete ? "Done" : "Pending"}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
