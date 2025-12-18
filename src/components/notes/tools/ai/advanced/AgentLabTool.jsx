"use client";

import { useMemo, useState } from "react";
import { Bot, Search, Calculator, Code } from "lucide-react";

const SCENARIOS = [
  {
    id: "research",
    title: "Research assistant",
    goal: "Summarise the top three risks in a new market.",
    steps: [
      { type: "tool", label: "Search recent reports", icon: Search },
      { type: "tool", label: "Extract key themes", icon: Bot },
      { type: "tool", label: "Draft short summary", icon: Code },
    ],
  },
  {
    id: "support",
    title: "Support helper",
    goal: "Draft a response to a billing question.",
    steps: [
      { type: "tool", label: "Lookup account history", icon: Search },
      { type: "tool", label: "Check policy rules", icon: Code },
      { type: "tool", label: "Draft response", icon: Bot },
    ],
  },
  {
    id: "analysis",
    title: "Cost planner",
    goal: "Estimate monthly compute spend for a new service.",
    steps: [
      { type: "tool", label: "Pull usage assumptions", icon: Search },
      { type: "tool", label: "Run calculations", icon: Calculator },
      { type: "tool", label: "Explain the estimate", icon: Bot },
    ],
  },
];

export default function AgentLabTool() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [ran, setRan] = useState(false);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0],
    [scenarioId]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Build a tiny agent</p>
          <p className="text-xs text-slate-600">Pick a goal and watch the plan take shape.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="text-xs font-semibold text-slate-600">Scenario</span>
          <select
            value={scenarioId}
            onChange={(event) => {
              setScenarioId(event.target.value);
              setRan(false);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs"
          >
            {SCENARIOS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-600">Goal: {scenario.goal}</p>
        </label>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-600">Agent settings</p>
          <div className="mt-2 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Tool access</span>
              <span className="font-semibold text-slate-800">Restricted</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Max steps</span>
              <span className="font-semibold text-slate-800">{scenario.steps.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Logging</span>
              <span className="font-semibold text-slate-800">On</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setRan(true)}
        className="mt-4 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
      >
        Run plan
      </button>

      <div className="mt-4 grid gap-2">
        {scenario.steps.map((step, index) => {
          const Icon = step.icon;
          const active = ran || index === 0;
          return (
            <div
              key={`${scenario.id}-${step.label}`}
              className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-xs ${
                active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50/70 text-slate-600"
              }`}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white text-slate-600">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              Step {index + 1}: {step.label}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What to notice</p>
        <p className="mt-2">
          Agents are safest when they have clear goals, a small set of tools, and a strict step limit.
        </p>
      </div>
    </div>
  );
}
