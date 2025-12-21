"use client";

import { useMemo, useState } from "react";

export default function EvaluationMetricsExplorer() {
  const [tp, setTp] = useState(30);
  const [fp, setFp] = useState(10);
  const [tn, setTn] = useState(40);
  const [fn, setFn] = useState(5);

  const metrics = useMemo(() => {
    const acc = (tp + tn) / Math.max(tp + tn + fp + fn, 1);
    const precision = tp / Math.max(tp + fp, 1);
    const recall = tp / Math.max(tp + fn, 1);
    const specificity = tn / Math.max(tn + fp, 1);
    const f1 = (2 * precision * recall) / Math.max(precision + recall, 1);
    return {
      acc: (acc * 100).toFixed(1),
      precision: (precision * 100).toFixed(1),
      recall: (recall * 100).toFixed(1),
      specificity: (specificity * 100).toFixed(1),
      f1: (f1 * 100).toFixed(1),
    };
  }, [tp, fp, tn, fn]);

  const inputs = [
    { label: "True positives", value: tp, setter: setTp },
    { label: "False positives", value: fp, setter: setFp },
    { label: "True negatives", value: tn, setter: setTn },
    { label: "False negatives", value: fn, setter: setFn },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        {inputs.map((item) => (
          <label key={item.label} className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{item.label}</span>
            <input
              type="range"
              min="0"
              max="80"
              value={item.value}
              onChange={(e) => item.setter(Number(e.target.value))}
              className="mt-1 w-full accent-blue-600"
            />
            <span className="text-xs text-slate-600">{item.value}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {Object.entries(metrics).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
            <p className="font-semibold text-slate-900 uppercase tracking-wide text-sm">{k}</p>
            <p>{v}%</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-700">
        Move the counts to see how precision, recall, and specificity change together.
      </p>
    </div>
  );
}
