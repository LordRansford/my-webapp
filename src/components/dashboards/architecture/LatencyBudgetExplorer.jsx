"use client";

import { useMemo, useState } from "react";

export function LatencyBudgetExplorer() {
  const [budgetMs, setBudgetMs] = useState(300);
  const [frontendMs, setFrontendMs] = useState(80);
  const [networkMs, setNetworkMs] = useState(70);
  const [backendMs, setBackendMs] = useState(120);

  const stats = useMemo(() => {
    const totalAllocated = frontendMs + networkMs + backendMs;
    const slack = budgetMs - totalAllocated;
    const overBudget = slack < 0;

    let message;
    if (overBudget) {
      message =
        "You have allocated more time than your budget allows. Simplify, optimise, or move work off the critical path.";
    } else if (slack < 30) {
      message =
        "You are within the budget but have very little slack. Small regressions could break the target.";
    } else {
      message =
        "You have some slack in your latency budget. Use it to keep room for new features and natural drift.";
    }

    return {
      totalAllocated,
      slack,
      overBudget,
      message,
    };
  }, [budgetMs, frontendMs, networkMs, backendMs]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Decide how to spend your latency budget across frontend, network, and backend work. This is for conversation and intuition,
        not as a perf testing tool.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <label className="block text-xs text-slate-600">
            User facing latency budget
            <input
              type="range"
              min={150}
              max={1000}
              step={10}
              value={budgetMs}
              onChange={(e) => setBudgetMs(Number(e.target.value) || 150)}
              className="mt-1 w-full"
            />
            <span className="mt-1 inline-block text-xs text-slate-700">
              Target total time: <span className="font-semibold">{budgetMs} ms</span>
            </span>
          </label>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <LatencySlider label="Frontend" value={frontendMs} setValue={setFrontendMs} colourClass="bg-sky-100" />
            <LatencySlider label="Network" value={networkMs} setValue={setNetworkMs} colourClass="bg-violet-100" />
            <LatencySlider label="Backend" value={backendMs} setValue={setBackendMs} colourClass="bg-emerald-100" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Budget summary</p>
            <p className="text-xs text-slate-700">
              Total allocated: <span className="font-semibold">{stats.totalAllocated.toFixed(0)} ms</span>
            </p>
            <p className="text-xs text-slate-700">
              Slack:{" "}
              <span className={"font-semibold " + (stats.overBudget ? "text-rose-600" : "text-emerald-700")}>
                {stats.slack.toFixed(0)} ms
              </span>
            </p>
            <p className="mt-2 text-xs text-slate-600">{stats.message}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Questions to explore</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Which layer is hardest for your team to optimise.</li>
              <li>Can you move some work to background tasks or pre-computation.</li>
              <li>Do your monitoring dashboards reflect the same budget split.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LatencySlider({ label, value, setValue, colourClass }) {
  return (
    <div className={`rounded-2xl ${colourClass} p-3`}>
      <p className="text-xs font-semibold text-slate-800">{label}</p>
      <input
        type="range"
        min={20}
        max={600}
        step={10}
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 20)}
        className="mt-1 w-full"
      />
      <p className="mt-1 text-xs text-slate-700">{value.toFixed(0)} ms allocated</p>
    </div>
  );
}
