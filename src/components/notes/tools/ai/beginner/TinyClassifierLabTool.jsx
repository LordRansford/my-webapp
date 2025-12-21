"use client";

import { useMemo, useState } from "react";

// Lightweight placeholder tool (no deps, no backend).
// Intent: give learners a safe UI shell now, and a clear upgrade path later.
export default function TinyClassifierLabTool() {
  const [noise, setNoise] = useState(20);
  const [trainSize, setTrainSize] = useState(80);
  const [complexity, setComplexity] = useState(3);

  const result = useMemo(() => {
    // A deliberately simple, explainable proxy for "model training".
    // More data and less noise improves generalisation.
    const dataSignal = Math.min(1, trainSize / 200);
    const noisePenalty = Math.max(0, 1 - noise / 100);
    const complexityPenalty = Math.max(0.4, 1 - (complexity - 1) * 0.12);
    const score = Math.max(0.1, Math.min(0.95, dataSignal * noisePenalty * complexityPenalty));
    const accuracy = Math.round(score * 100);

    const warning =
      noise > 60
        ? "High noise. The model will look confident on the training set and then disappoint you later."
        : complexity > 7
          ? "High complexity for this data size. Watch for overfitting."
          : trainSize < 60
            ? "Small dataset. Treat results as unstable until you have more examples."
            : "Reasonable starting point. Next step is to validate on held-out data.";

    return { accuracy, warning };
  }, [noise, trainSize, complexity]);

  return (
    <div className="space-y-3 text-sm text-slate-800">
      <p className="text-sm text-slate-700">
        This is a small training lab placeholder. It shows the idea of training choices and what they do to expected accuracy.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Training examples</span>
          <input
            type="range"
            min="20"
            max="300"
            step="10"
            value={trainSize}
            onChange={(e) => setTrainSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-slate-600">{trainSize} examples</div>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Noise</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-slate-600">{noise}% noisy signals</div>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Model complexity</span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-slate-600">Complexity {complexity}</div>
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Expected outcome</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">Estimated accuracy: {result.accuracy}%</div>
        <p className="mt-1 text-sm text-slate-700">{result.warning}</p>
        <p className="mt-2 text-xs text-slate-600">
          Upgrade path: replace this proxy with a tiny real classifier and a train, validate, test split.
        </p>
      </div>
    </div>
  );
}


