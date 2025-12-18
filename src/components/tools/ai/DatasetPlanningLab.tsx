"use client";

import React, { useMemo, useState } from "react";
import { Database } from "lucide-react";

type SplitPercentages = {
  train: number;
  validation: number;
  test: number;
};

type ClassItem = {
  id: number;
  label: string;
  count: number;
};

function clampPercent(v: number) {
  if (!Number.isFinite(v) || v < 0) return 0;
  if (v > 100) return 100;
  return v;
}

function clampCount(v: number) {
  if (!Number.isFinite(v) || v < 0) return 0;
  if (!Number.isInteger(v)) return Math.round(v);
  return v;
}

export function DatasetPlanningLab() {
  const [totalSize, setTotalSize] = useState("1000");
  const [splits, setSplits] = useState<SplitPercentages>({
    train: 70,
    validation: 15,
    test: 15,
  });
  const [classes, setClasses] = useState<ClassItem[]>([
    { id: 1, label: "Class A", count: 600 },
    { id: 2, label: "Class B", count: 300 },
    { id: 3, label: "Class C", count: 100 },
  ]);

  const numericTotal = (() => {
    const n = Number(totalSize);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
  })();

  const splitSum = splits.train + splits.validation + splits.test;
  const splitWarning =
    Math.abs(splitSum - 100) > 0.1
      ? "Split percentages do not add up to 100 percent. Adjust them so they sum to 100."
      : "";

  const classTotal = useMemo(() => classes.reduce((sum, c) => sum + clampCount(c.count), 0), [classes]);

  const imbalanceInfo = useMemo(() => {
    if (!classTotal) {
      return { mostLabel: "", mostPercent: 0, leastLabel: "", leastPercent: 0 };
    }
    const sorted = [...classes].sort((a, b) => clampCount(b.count) - clampCount(a.count));
    const most = sorted[0];
    const least = sorted[sorted.length - 1];
    const mostPercent = (clampCount(most.count) / classTotal) * 100;
    const leastPercent = (clampCount(least.count) / classTotal) * 100;
    return {
      mostLabel: most.label,
      mostPercent,
      leastLabel: least.label,
      leastPercent,
    };
  }, [classes, classTotal]);

  const handleSplitChange = (key: keyof SplitPercentages, value: string) => {
    const n = Number(value);
    setSplits((prev) => ({ ...prev, [key]: clampPercent(n) }));
  };

  const updateClass = (id: number, patch: Partial<ClassItem>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addClass = () => {
    const nextId = classes.length ? Math.max(...classes.map((c) => c.id)) + 1 : 1;
    setClasses((prev) => [...prev, { id: nextId, label: "New class", count: 50 }]);
  };

  const removeClass = (id: number) => {
    if (classes.length <= 1) return;
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const splitCounts = useMemo(() => {
    if (!numericTotal) {
      return { train: 0, validation: 0, test: 0 };
    }
    return {
      train: Math.round((splits.train / 100) * numericTotal),
      validation: Math.round((splits.validation / 100) * numericTotal),
      test: Math.round((splits.test / 100) * numericTotal),
    };
  }, [numericTotal, splits]);

  return (
    <section
      aria-labelledby="dataset-planning-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <Database className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2 id="dataset-planning-title" className="text-lg sm:text-xl font-semibold text-slate-900">
              Dataset planning lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Plan your dataset splits and inspect class balance before you train. This helps you avoid common mistakes
              like leaking test data or training on a heavily skewed sample.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="space-y-1">
            <label htmlFor="dataset-size" className="text-xs font-semibold text-slate-700">
              Total labelled examples
            </label>
            <input
              id="dataset-size"
              type="number"
              min={0}
              value={totalSize}
              onChange={(e) => setTotalSize(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <p className="text-xs text-slate-500">
              This is the number of examples you have after cleaning and labelling.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Train percent</label>
              <input
                type="number"
                min={0}
                max={100}
                value={splits.train}
                onChange={(e) => handleSplitChange("train", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Validation percent</label>
              <input
                type="number"
                min={0}
                max={100}
                value={splits.validation}
                onChange={(e) => handleSplitChange("validation", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Test percent</label>
              <input
                type="number"
                min={0}
                max={100}
                value={splits.test}
                onChange={(e) => handleSplitChange("test", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>
          {splitWarning && <p className="text-xs text-rose-600">{splitWarning}</p>}

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p>
              Train: <span className="font-semibold text-slate-900">{splitCounts.train}</span> examples
            </p>
            <p>
              Validation: <span className="font-semibold text-slate-900">{splitCounts.validation}</span> examples
            </p>
            <p>
              Test: <span className="font-semibold text-slate-900">{splitCounts.test}</span> examples
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">Class distribution</p>
            <button
              type="button"
              onClick={addClass}
              className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Add class
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {classes.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={c.label}
                    onChange={(e) => updateClass(c.id, { label: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
                  />
                  <input
                    type="number"
                    min={0}
                    value={c.count}
                    onChange={(e) =>
                      updateClass(c.id, {
                        count: clampCount(Number(e.target.value)),
                      })
                    }
                    className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-right text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeClass(c.id)}
                    aria-label="Remove class"
                    className="text-[11px] px-2 py-1 rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    ✕
                  </button>
                </div>
                {classTotal > 0 && (
                  <p className="text-[11px] text-slate-500">
                    This class is approximately{" "}
                    <span className="font-semibold">{((clampCount(c.count) / classTotal) * 100).toFixed(1)} percent</span>{" "}
                    of your dataset.
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p>
              Total examples across classes: <span className="font-semibold text-slate-900">{classTotal}</span>
            </p>
            {classTotal > 0 && (
              <p className="text-slate-600">
                Largest class:{" "}
                <span className="font-semibold">
                  {imbalanceInfo.mostLabel} ({imbalanceInfo.mostPercent.toFixed(1)} percent)
                </span>
                . Smallest class:{" "}
                <span className="font-semibold">
                  {imbalanceInfo.leastLabel} ({imbalanceInfo.leastPercent.toFixed(1)} percent)
                </span>
                .
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              If one class dominates, you may need rebalancing techniques such as resampling or different evaluation
              metrics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
