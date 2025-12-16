"use client";

import { useMemo, useState } from "react";

const SAMPLE = [
  { score: 0.9, label: 1 },
  { score: 0.8, label: 1 },
  { score: 0.7, label: 1 },
  { score: 0.6, label: 1 },
  { score: 0.55, label: 0 },
  { score: 0.5, label: 0 },
  { score: 0.45, label: 0 },
  { score: 0.4, label: 0 },
  { score: 0.3, label: 0 },
  { score: 0.2, label: 1 },
  { score: 0.1, label: 0 },
];

export default function ThresholdPlaygroundTool() {
  const [threshold, setThreshold] = useState(0.5);

  const metrics = useMemo(() => {
    let tp = 0,
      fp = 0,
      tn = 0,
      fn = 0;
    SAMPLE.forEach(({ score, label }) => {
      const pred = score >= threshold ? 1 : 0;
      if (pred === 1 && label === 1) tp++;
      if (pred === 1 && label === 0) fp++;
      if (pred === 0 && label === 0) tn++;
      if (pred === 0 && label === 1) fn++;
    });
    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    return { tp, fp, tn, fn, precision: Number(precision.toFixed(2)), recall: Number(recall.toFixed(2)) };
  }, [threshold]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <p className="text-sm text-gray-700">Move the threshold and see how false positives and false negatives change.</p>
      <div>
        <label className="block text-xs font-semibold text-gray-600">Threshold: {threshold.toFixed(2)}</label>
        <input
          type="range"
          min="0.1"
          max="0.9"
          step="0.05"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-2xl border bg-white/70 p-3">
          <div className="text-xs uppercase tracking-wide text-gray-600">Confusion counts</div>
          <p className="mt-1 text-sm">TP {metrics.tp} / FP {metrics.fp}</p>
          <p className="text-sm">TN {metrics.tn} / FN {metrics.fn}</p>
        </div>
        <div className="rounded-2xl border bg-white/70 p-3">
          <div className="text-xs uppercase tracking-wide text-gray-600">Precision & recall</div>
          <p className="mt-1 text-sm">Precision {metrics.precision}</p>
          <p className="text-sm">Recall {metrics.recall}</p>
        </div>
      </div>
      <p className="text-xs text-gray-600">
        Lower thresholds catch more positives but increase false alarms. Higher thresholds miss positives but reduce noise.
      </p>
    </div>
  );
}
