"use client";

import { useMemo, useState } from "react";

export default function ConfusionMatrixExplorer() {
  const [threshold, setThreshold] = useState(0.5);
  const [positiveRate, setPositiveRate] = useState(0.1);
  const [score, setScore] = useState(0.7);

  const cm = useMemo(() => {
    // Simple synthetic confusion matrix based on score and threshold
    const positives = 1000 * positiveRate;
    const negatives = 1000 - positives;
    const tp = Math.round(positives * Math.max(0, score - threshold + 0.5));
    const fn = Math.max(0, positives - tp);
    const fp = Math.round(negatives * Math.max(0, score - threshold));
    const tn = Math.max(0, negatives - fp);
    return { tp, fp, fn, tn };
  }, [score, threshold, positiveRate]);

  const precision = cm.tp + cm.fp === 0 ? null : cm.tp / (cm.tp + cm.fp);
  const recall = cm.tp + cm.fn === 0 ? null : cm.tp / (cm.tp + cm.fn);

  const fmt = (v) => (v === null ? "n/a" : `${Math.round(v * 1000) / 10}%`);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div className="rn-grid rn-grid-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Threshold</span>
          <input type="range" min="0" max="1" step="0.01" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
          <span className="text-xs text-gray-600">Current: {threshold.toFixed(2)}</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Predicted score</span>
          <input type="range" min="0" max="1" step="0.01" value={score} onChange={(e) => setScore(Number(e.target.value))} />
          <span className="text-xs text-gray-600">Current: {score.toFixed(2)}</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Positive rate</span>
          <input type="range" min="0.01" max="0.5" step="0.01" value={positiveRate} onChange={(e) => setPositiveRate(Number(e.target.value))} />
          <span className="text-xs text-gray-600">Current: {(positiveRate * 100).toFixed(1)}%</span>
        </label>
      </div>

      <div className="rn-grid rn-grid-2">
        <div className="rn-mini">
          <div className="rn-mini-title">Confusion matrix (synthetic)</div>
          <div className="rn-matrix">
            <div className="rn-matrix-cell">TP {cm.tp}</div>
            <div className="rn-matrix-cell">FP {cm.fp}</div>
            <div className="rn-matrix-cell">FN {cm.fn}</div>
            <div className="rn-matrix-cell">TN {cm.tn}</div>
          </div>
        </div>
        <div className="rn-mini">
          <div className="rn-mini-title">Metrics</div>
          <div>Precision: <strong>{fmt(precision)}</strong></div>
          <div>Recall: <strong>{fmt(recall)}</strong></div>
        </div>
      </div>

      <p className="text-xs text-gray-600">
        This is a teaching tool. Real confusion matrices come from real predictions. Notice how threshold and class balance change the shape of mistakes.
      </p>
    </div>
  );
}
