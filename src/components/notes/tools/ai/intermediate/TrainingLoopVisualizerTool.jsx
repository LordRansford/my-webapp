"use client";

import { useMemo, useState } from "react";
import { Activity, Play, TrendingDown, TrendingUp } from "lucide-react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSeed({ epochs, learningRate, dataBand, noise, capacity }) {
  const key = `${epochs}|${learningRate}|${dataBand}|${noise}|${capacity}`;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function simulateCurves({ epochs, learningRate, dataBand, noise, capacity }) {
  const rand = mulberry32(makeSeed({ epochs, learningRate, dataBand, noise, capacity }));

  const dataScale = dataBand === 1 ? 0.7 : dataBand === 2 ? 1 : 1.25;
  const capacityScale = capacity === 1 ? 0.9 : capacity === 2 ? 1 : 1.15;
  const lr = clamp(learningRate, 0.01, 1);
  const noiseLevel = clamp(noise, 0, 1);

  const instability = clamp((lr - 0.65) / 0.35, 0, 1);
  const baseDecay = clamp(0.92 - lr * 0.2, 0.72, 0.92);
  const floor = 0.06 + noiseLevel * 0.22;

  let train = 1.15;
  let val = 1.2;

  const training = [];
  const validation = [];

  for (let epoch = 1; epoch <= epochs; epoch += 1) {
    const jitter = (rand() - 0.5) * 0.1 * noiseLevel;
    const wobble = (rand() - 0.5) * 0.35 * instability;
    const step = baseDecay + wobble;

    const learnSpeed = (0.95 / dataScale) * (1 / capacityScale);
    train = clamp(train * step * learnSpeed + jitter, floor, 2.2);

    const overfitPressure = capacity === 3 && dataBand === 1 ? 1 : capacity === 3 && dataBand === 2 ? 0.7 : 0.35;
    const overfitStarts = dataBand === 1 ? 5 : dataBand === 2 ? 7 : 9;
    const overfit = epoch > overfitStarts ? (epoch - overfitStarts) * 0.06 * overfitPressure : 0;

    const valFloor = 0.08 + noiseLevel * 0.28;
    val = clamp(val * (step + 0.02) * (1 / dataScale) + overfit + jitter * 0.6, valFloor, 2.4);

    training.push(Number(train.toFixed(3)));
    validation.push(Number(val.toFixed(3)));
  }

  return { training, validation };
}

function Sparkline({ values, stroke }) {
  const width = 260;
  const height = 54;
  const padding = 6;

  const min = Math.min(...values, 0.05);
  const max = Math.max(...values, 0.3);
  const span = Math.max(0.001, max - min);

  const points = values
    .map((v, idx) => {
      const x = padding + (idx * (width - padding * 2)) / Math.max(1, values.length - 1);
      const y = padding + ((max - v) * (height - padding * 2)) / span;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Loss curve">
      <rect x="0" y="0" width={width} height={height} rx="12" fill="transparent" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function TrainingLoopVisualizerTool() {
  const [epochs, setEpochs] = useState(8);
  const [learningRate, setLearningRate] = useState(0.25);
  const [dataBand, setDataBand] = useState(2);
  const [noise, setNoise] = useState(0.25);
  const [capacity, setCapacity] = useState(2);
  const [curves, setCurves] = useState(() =>
    simulateCurves({ epochs: 8, learningRate: 0.25, dataBand: 2, noise: 0.25, capacity: 2 }),
  );

  const lastTrain = curves.training[curves.training.length - 1] || 0;
  const lastVal = curves.validation[curves.validation.length - 1] || 0;
  const generalisationGap = Math.max(0, lastVal - lastTrain);

  const guidance = useMemo(() => {
    if (lastTrain > 0.75) return "Training is struggling. Reduce noise, improve labels, or start with simpler features.";
    if (learningRate > 0.75) return "Learning rate is high. If loss jumps around, lower it.";
    if (generalisationGap > 0.35 && capacity === 3 && dataBand === 1) return "This looks like overfitting. Use more data or reduce capacity.";
    if (lastVal > 0.7 && dataBand === 1) return "Small data makes evaluation unstable. Use more data or a simpler model.";
    if (lastVal < 0.3 && generalisationGap < 0.2) return "This looks stable. Validate with held out data and watch drift after launch.";
    return "Watch both training and validation. You want improvement without a widening gap.";
  }, [lastTrain, lastVal, generalisationGap, learningRate, capacity, dataBand]);

  const dataLabel = dataBand === 1 ? "Small" : dataBand === 2 ? "Medium" : "Large";
  const capacityLabel = capacity === 1 ? "Low" : capacity === 2 ? "Medium" : "High";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Activity className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Training loop visualiser</p>
          <p className="text-xs text-slate-600">Tune learning rate, data, noise, and capacity. Watch training and validation loss.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <label className="block text-xs font-semibold text-slate-700" htmlFor="epochs">
            Epochs: {epochs}
          </label>
          <input
            id="epochs"
            type="range"
            min={4}
            max={18}
            value={epochs}
            onChange={(event) => setEpochs(Number(event.target.value))}
            className="mt-2 w-full accent-slate-900"
          />

          <label className="mt-4 block text-xs font-semibold text-slate-700" htmlFor="learning-rate">
            Learning rate: {learningRate.toFixed(2)}
          </label>
          <input
            id="learning-rate"
            type="range"
            min={0.05}
            max={1}
            step={0.05}
            value={learningRate}
            onChange={(event) => setLearningRate(Number(event.target.value))}
            className="mt-2 w-full accent-slate-900"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <label className="block text-xs font-semibold text-slate-700" htmlFor="data-band">
            Data size: {dataLabel}
          </label>
          <input
            id="data-band"
            type="range"
            min={1}
            max={3}
            step={1}
            value={dataBand}
            onChange={(event) => setDataBand(Number(event.target.value))}
            className="mt-2 w-full accent-slate-900"
          />

          <label className="mt-4 block text-xs font-semibold text-slate-700" htmlFor="noise">
            Noise: {noise.toFixed(2)}
          </label>
          <input
            id="noise"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={noise}
            onChange={(event) => setNoise(Number(event.target.value))}
            className="mt-2 w-full accent-slate-900"
          />

          <label className="mt-4 block text-xs font-semibold text-slate-700" htmlFor="capacity">
            Capacity: {capacityLabel}
          </label>
          <input
            id="capacity"
            type="range"
            min={1}
            max={3}
            step={1}
            value={capacity}
            onChange={(event) => setCapacity(Number(event.target.value))}
            className="mt-2 w-full accent-slate-900"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCurves(simulateCurves({ epochs, learningRate, dataBand, noise, capacity }))}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
          Run simulation
        </button>
        <p className="text-xs text-slate-600">Goal is steady improvement with a small gap between curves.</p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-700">Training loss</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
                {lastTrain.toFixed(3)}
              </span>
            </div>
            <div className="mt-3 overflow-x-auto">
              <Sparkline values={curves.training} stroke="#10b981" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-700">Validation loss</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                {lastVal.toFixed(3)}
              </span>
            </div>
            <div className="mt-3 overflow-x-auto">
              <Sparkline values={curves.validation} stroke="#0ea5e9" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Generalisation gap</p>
          <p className="mt-2 text-sm text-slate-800">
            Gap: <span className="font-semibold text-slate-900">{generalisationGap.toFixed(3)}</span>
          </p>
          <p className="mt-2 text-xs text-slate-600">A large gap usually means the model is learning quirks, not a stable pattern.</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Guidance</p>
        <p className="mt-2">{guidance}</p>
      </div>
    </div>
  );
}
