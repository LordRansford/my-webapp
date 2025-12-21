"use client";

import React, { useMemo, useState } from "react";
import { Timer } from "lucide-react";

type Stage = {
  id: number;
  name: string;
  latencyMs: number;
};

function clampLatency(v: number) {
  if (!Number.isFinite(v) || v < 0) return 0;
  if (v > 100000) return 100000;
  return v;
}

export function LatencyBudgetLab() {
  const [targetMs, setTargetMs] = useState("250");
  const [stages, setStages] = useState<Stage[]>([
    { id: 1, name: "Browser and network", latencyMs: 60 },
    { id: 2, name: "API gateway", latencyMs: 20 },
    { id: 3, name: "Application service", latencyMs: 80 },
    { id: 4, name: "Database", latencyMs: 70 },
  ]);

  const totalLatency = useMemo(
    () => stages.reduce((sum, s) => sum + clampLatency(s.latencyMs), 0),
    [stages]
  );

  const target = (() => {
    const n = Number(targetMs);
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();

  const overBudget = totalLatency > target;
  const slack = Math.max(target - totalLatency, 0);

  const handleStageChange = (id: number, value: string) => {
    const n = Number(value);
    setStages((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, latencyMs: clampLatency(n) } : s
      )
    );
  };

  const addStage = () => {
    const nextId = stages.length ? Math.max(...stages.map((s) => s.id)) + 1 : 1;
    setStages((prev) => [
      ...prev,
      { id: nextId, name: "New stage", latencyMs: 10 },
    ]);
  };

  const removeStage = (id: number) => {
    if (stages.length <= 1) return;
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <section
      aria-labelledby="latency-budget-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Timer className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2
              id="latency-budget-title"
              className="text-lg sm:text-xl font-semibold text-slate-900"
            >
              Latency budget planner
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Break a request into stages and see how much latency each part can
              spend. This makes the performance budget visible before you design
              APIs or databases.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="space-y-1">
            <label
              htmlFor="latency-target"
              className="text-xs font-semibold text-slate-700"
            >
              End to end target (milliseconds)
            </label>
            <input
              id="latency-target"
              type="number"
              min={1}
              value={targetMs}
              onChange={(e) => setTargetMs(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <p className="text-xs text-slate-500">
              Many teams aim for around 100 to 300 milliseconds for core user
              actions so the interface feels responsive.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">
                Stages in the path
              </p>
              <button
                type="button"
                onClick={addStage}
                className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                aria-label="Add stage"
              >
                Add stage
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-slate-700 border border-slate-200"
                >
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) =>
                      setStages((prev) =>
                        prev.map((s) =>
                          s.id === stage.id ? { ...s, name: e.target.value } : s
                        )
                      )
                    }
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <input
                    type="number"
                    min={0}
                    value={stage.latencyMs}
                    onChange={(e) => handleStageChange(stage.id, e.target.value)}
                    className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <span className="text-sm text-slate-500">ms</span>
                  <button
                    type="button"
                    onClick={() => removeStage(stage.id)}
                    className="text-sm px-2 py-1 rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    aria-label="Remove stage"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Budget overview
            </h3>
            <p className="text-sm text-slate-700">
              Total latency for this path is{" "}
              <span className="font-semibold text-slate-900">{totalLatency} ms</span> against a
              target of <span className="font-semibold text-slate-900">{target.toFixed(0)} ms</span>.
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full ${
                  overBudget ? "bg-rose-500" : "bg-emerald-500"
                } transition-all`}
                style={{
                  width: `${Math.min((totalLatency / target) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-600">
              {overBudget
                ? "You are over budget. Decide which stages can be simplified, cached or moved closer to the user."
                : `You have approximately ${slack.toFixed(
                    0
                  )} ms of slack. Keep some margin for network variability.`}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              How to use this in real work
            </h3>
            <p className="text-sm text-slate-700">
              Before you design APIs or choose databases, sketch a latency
              budget. It gives you a shared number that front end engineers,
              back end engineers and database specialists can use to reason
              together.
            </p>
            <p className="text-sm text-slate-700">
              Teams often discover that one stage quietly uses most of the
              budget. That stage is your first candidate for redesign or
              caching.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
