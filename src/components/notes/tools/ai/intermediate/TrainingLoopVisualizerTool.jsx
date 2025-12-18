"use client";

import { useMemo, useState } from "react";
import { Activity, Play } from "lucide-react";

const buildLossCurve = (epochs) => {
  const values = [];
  let loss = 1.2;
  for (let i = 0; i < epochs; i += 1) {
    const decay = 0.85 + Math.random() * 0.05;
    loss = Math.max(0.05, loss * decay);
    values.push(Number(loss.toFixed(3)));
  }
  return values;
};

export default function TrainingLoopVisualizerTool() {
  const [epochs, setEpochs] = useState(8);
  const [losses, setLosses] = useState(() => buildLossCurve(8));

  const lastLoss = losses[losses.length - 1] || 0;
  const guidance = useMemo(() => {
    if (lastLoss > 0.6) return "Loss is still high. Consider more features or better labels.";
    if (lastLoss > 0.25) return "Loss is improving. Keep training or tune the learning rate.";
    return "Loss looks stable. Test on validation data before shipping.";
  }, [lastLoss]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Activity className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Training loop visualiser</p>
          <p className="text-xs text-slate-600">Watch loss change over a few epochs.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold text-slate-600" htmlFor="epochs">
          Epochs: {epochs}
        </label>
        <input
          id="epochs"
          type="range"
          min={4}
          max={16}
          value={epochs}
          onChange={(event) => setEpochs(Number(event.target.value))}
          className="w-full max-w-xs accent-slate-900"
        />
        <button
          type="button"
          onClick={() => setLosses(buildLossCurve(epochs))}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
          Run training
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {losses.map((loss, index) => (
          <div key={`${loss}-${index}`} className="flex items-center gap-3 text-xs text-slate-700">
            <span className="w-12 text-[11px] text-slate-500">Epoch {index + 1}</span>
            <div className="h-2 flex-1 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${Math.max(5, Math.round((1 - loss) * 100))}%` }}
              />
            </div>
            <span className="w-12 text-right text-[11px] text-slate-600">{loss}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Guidance</p>
        <p className="mt-2">{guidance}</p>
      </div>
    </div>
  );
}
