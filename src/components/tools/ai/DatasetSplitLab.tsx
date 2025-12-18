"use client";

import React, { useMemo, useState } from "react";

type Split = {
  train: number;
  validation: number;
  test: number;
};

function computeSplit(size: number, trainPct: number, valPct: number): Split {
  const train = Math.round((size * trainPct) / 100);
  const validation = Math.round((size * valPct) / 100);
  const used = train + validation;
  const test = Math.max(size - used, 0);
  return { train, validation, test };
}

export function DatasetSplitLab() {
  const [size, setSize] = useState("1000");
  const [trainPct, setTrainPct] = useState(70);
  const [valPct, setValPct] = useState(15);

  const safeSize = (() => {
    const n = Number(size);
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();

  const split = useMemo(
    () => computeSplit(safeSize, trainPct, valPct),
    [safeSize, trainPct, valPct]
  );

  const totalPct = trainPct + valPct;
  const testPct = Math.max(0, 100 - totalPct);

  return (
    <section
      aria-labelledby="dataset-split-lab-title"
      className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 p-6 sm:p-8 space-y-6"
    >
      <header className="space-y-2">
        <h2
          id="dataset-split-lab-title"
          className="text-lg sm:text-xl font-semibold text-slate-900"
        >
          Dataset split planner
        </h2>
        <p className="text-sm text-slate-600 max-w-xl">
          Experiment with train, validation and test splits. This helps you see
          how many samples end up in each bucket and why a tiny test set can
          give a noisy view of performance.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="space-y-1">
            <label
              htmlFor="dataset-size-input"
              className="text-xs font-semibold text-slate-700"
            >
              Dataset size
            </label>
            <input
              id="dataset-size-input"
              type="number"
              min={1}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <p className="text-xs text-slate-500">
              Think of this as the number of labelled rows you have available.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Train {trainPct}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={90}
                value={trainPct}
                onChange={(e) => setTrainPct(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Validation {valPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={valPct}
                onChange={(e) => setValPct(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <p className="text-xs text-slate-600">
              Test will take the remainder automatically. Right now that is{" "}
              <span className="font-semibold">{testPct}%</span>.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Split summary
            </h3>
            <dl className="grid grid-cols-2 gap-y-2 text-xs text-slate-700">
              <dt className="font-semibold">Train</dt>
              <dd>
                {split.train} samples ({trainPct}%)
              </dd>
              <dt className="font-semibold">Validation</dt>
              <dd>
                {split.validation} samples ({valPct}%)
              </dd>
              <dt className="font-semibold">Test</dt>
              <dd>
                {split.test} samples ({testPct}%)
              </dd>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Why the split matters
            </h3>
            <p>
              A very small test set can make performance look unstable. A very
              small train set can make the model underfit. This lab gives you a
              feel for the trade offs before you write any code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
