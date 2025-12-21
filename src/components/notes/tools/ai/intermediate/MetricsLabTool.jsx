"use client";

import { useMemo, useState } from "react";
import { Target, AlertTriangle, CheckCircle2 } from "lucide-react";

const toNumber = (value) => Math.max(0, Number(value) || 0);

const metric = (num, denom) => (denom === 0 ? 0 : num / denom);

export default function MetricsLabTool() {
  const [tp, setTp] = useState(32);
  const [fp, setFp] = useState(8);
  const [tn, setTn] = useState(40);
  const [fn, setFn] = useState(10);

  const total = tp + fp + tn + fn;

  const accuracy = useMemo(() => metric(tp + tn, total), [tp, tn, total]);
  const precision = useMemo(() => metric(tp, tp + fp), [tp, fp]);
  const recall = useMemo(() => metric(tp, tp + fn), [tp, fn]);
  const f1 = useMemo(() => metric(2 * precision * recall, precision + recall), [precision, recall]);

  const hint = useMemo(() => {
    if (precision < 0.6 && recall > 0.7) return "High recall, low precision. You catch most positives but with many false alarms.";
    if (precision > 0.8 && recall < 0.6) return "High precision, low recall. You are accurate when you predict positive, but you miss many cases.";
    if (accuracy < 0.7) return "Accuracy is low. Check data quality and feature balance.";
    return "Balanced metrics. Confirm this matches the real world risk.";
  }, [precision, recall, accuracy]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <Target className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Metrics explainer lab</p>
          <p className="text-xs text-slate-600">Adjust the confusion matrix and watch the metrics change.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold text-slate-600">Confusion matrix</p>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 text-xs text-slate-700">
            <label className="rounded-xl border border-slate-200 bg-white p-2">
              <span className="text-sm font-semibold text-slate-500">True positives</span>
              <input
                type="number"
                min={0}
                value={tp}
                onChange={(event) => setTp(toNumber(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
              />
            </label>
            <label className="rounded-xl border border-slate-200 bg-white p-2">
              <span className="text-sm font-semibold text-slate-500">False positives</span>
              <input
                type="number"
                min={0}
                value={fp}
                onChange={(event) => setFp(toNumber(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
              />
            </label>
            <label className="rounded-xl border border-slate-200 bg-white p-2">
              <span className="text-sm font-semibold text-slate-500">True negatives</span>
              <input
                type="number"
                min={0}
                value={tn}
                onChange={(event) => setTn(toNumber(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
              />
            </label>
            <label className="rounded-xl border border-slate-200 bg-white p-2">
              <span className="text-sm font-semibold text-slate-500">False negatives</span>
              <input
                type="number"
                min={0}
                value={fn}
                onChange={(event) => setFn(toNumber(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-600">Metric readout</p>
          <div className="mt-3 grid gap-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
              <span>Accuracy</span>
              <span className="font-semibold">{(accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
              <span>Precision</span>
              <span className="font-semibold">{(precision * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
              <span>Recall</span>
              <span className="font-semibold">{(recall * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
              <span>F1 score</span>
              <span className="font-semibold">{(f1 * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          {accuracy >= 0.7 ? (
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Interpretation
        </p>
        <p className="mt-2 text-xs text-slate-600">{hint}</p>
      </div>
    </div>
  );
}
