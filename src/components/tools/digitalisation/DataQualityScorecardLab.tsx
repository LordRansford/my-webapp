"use client";

import React, { useMemo, useState } from "react";
import { Gauge } from "lucide-react";

type Dimension = {
  id: number;
  name: string;
  description: string;
  score: number;
};

function clampScore(v: number) {
  if (!Number.isFinite(v) || v < 0) return 0;
  if (v > 5) return 5;
  return v;
}

export function DataQualityScorecardLab() {
  const [dimensions, setDimensions] = useState<Dimension[]>([
    {
      id: 1,
      name: "Completeness",
      description: "How often required fields are present.",
      score: 3.5,
    },
    {
      id: 2,
      name: "Accuracy",
      description: "How often the data reflects reality.",
      score: 3,
    },
    {
      id: 3,
      name: "Timeliness",
      description: "How current the data is when used.",
      score: 2.5,
    },
    {
      id: 4,
      name: "Consistency",
      description: "How often values agree across systems.",
      score: 3,
    },
  ]);

  const averageScore = useMemo(() => {
    if (!dimensions.length) return 0;
    const sum = dimensions.reduce((acc, d) => acc + clampScore(d.score), 0);
    return sum / dimensions.length;
  }, [dimensions]);

  const updateScore = (id: number, value: string) => {
    const n = Number(value);
    setDimensions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, score: clampScore(n) } : d))
    );
  };

  const scoreColour =
    averageScore >= 4
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : averageScore >= 2.5
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return (
    <section
      aria-labelledby="data-quality-scorecard-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Gauge className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2
              id="data-quality-scorecard-title"
              className="text-lg sm:text-xl font-semibold text-slate-900"
            >
              Data quality scorecard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Rate a few core datasets against quality dimensions and see where
              investment will have the biggest impact on digitalisation.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">
            Quality dimensions (0 to 5)
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {dimensions.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2 text-xs text-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{d.name}</p>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.5}
                    value={d.score}
                    onChange={(e) => updateScore(d.id, e.target.value)}
                    className="w-16 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <p className="text-sm text-slate-700">{d.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            These scores are not precise measurements. They are a shared
            reference to start a conversation about where data is letting your
            processes down.
          </p>
        </div>

        <div className="space-y-4">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${scoreColour}`}
          >
            <p className="text-xs uppercase tracking-wide mb-1">
              Overall quality mood
            </p>
            <p>
              Average quality score is{" "}
              <span className="font-semibold text-slate-900">
                {averageScore.toFixed(1)} out of 5
              </span>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              How to use this
            </h3>
            <p className="text-sm text-slate-700">
              Pick one or two dimensions that are most painful for your users.
              For example, if timeliness is low, focus on near real time feeds.
              If consistency is low, focus on reference data and shared
              identifiers.
            </p>
            <p className="text-sm text-slate-700">
              Digitalisation projects often fail when they ignore quality and
              jump straight to dashboards and automation. This scorecard keeps
              quality visible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
