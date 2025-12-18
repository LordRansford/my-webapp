"use client";

import React, { useMemo, useState } from "react";

type Counts = {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
};

function safeNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function computeMetrics(counts: Counts) {
  const { tp, fp, tn, fn } = counts;
  const total = tp + fp + tn + fn || 1;

  const accuracy = (tp + tn) / total;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 =
    precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return { total, accuracy, precision, recall, f1 };
}

export function MetricsCalculatorLab() {
  const [tp, setTp] = useState("50");
  const [fp, setFp] = useState("10");
  const [tn, setTn] = useState("80");
  const [fn, setFn] = useState("5");

  const metrics = useMemo(
    () =>
      computeMetrics({
        tp: safeNumber(tp),
        fp: safeNumber(fp),
        tn: safeNumber(tn),
        fn: safeNumber(fn),
      }),
    [tp, fp, tn, fn]
  );

  const formatPct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <section
      aria-labelledby="metrics-calculator-title"
      className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 p-6 sm:p-8 space-y-6"
    >
      <header className="space-y-2">
        <h2
          id="metrics-calculator-title"
          className="text-lg sm:text-xl font-semibold text-slate-900"
        >
          Evaluation metrics lab
        </h2>
        <p className="text-sm text-slate-600 max-w-xl">
          Enter counts for true positives, false positives, true negatives and
          false negatives. The tool calculates accuracy, precision, recall and
          F1 so you can see how a model behaves.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Confusion matrix
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="space-y-1">
              <label className="font-semibold">True positives (TP)</label>
              <input
                type="number"
                min={0}
                value={tp}
                onChange={(e) => setTp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">False positives (FP)</label>
              <input
                type="number"
                min={0}
                value={fp}
                onChange={(e) => setFp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">True negatives (TN)</label>
              <input
                type="number"
                min={0}
                value={tn}
                onChange={(e) => setTn(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">False negatives (FN)</label>
              <input
                type="number"
                min={0}
                value={fn}
                onChange={(e) => setFn(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Try changing FP and FN and watch how precision and recall move in
            different directions. This makes the trade off visible.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Metrics overview
            </h3>
            <dl className="grid grid-cols-2 gap-y-2 text-xs text-slate-700">
              <dt className="font-semibold">Samples</dt>
              <dd>{metrics.total}</dd>
              <dt className="font-semibold">Accuracy</dt>
              <dd>{formatPct(metrics.accuracy)}</dd>
              <dt className="font-semibold">Precision</dt>
              <dd>{formatPct(metrics.precision)}</dd>
              <dt className="font-semibold">Recall</dt>
              <dd>{formatPct(metrics.recall)}</dd>
              <dt className="font-semibold">F1 score</dt>
              <dd>{formatPct(metrics.f1)}</dd>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              How to read this
            </h3>
            <p>
              Precision answers “When the model predicts positive, how often is
              it right”.
            </p>
            <p>
              Recall answers “Out of all real positives, how many did the model
              catch”.
            </p>
            <p>
              F1 balances both. It is helpful when classes are imbalanced or
              when missing positives is expensive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
