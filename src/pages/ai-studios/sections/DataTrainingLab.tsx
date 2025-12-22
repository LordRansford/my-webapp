"use client";

import React, { useMemo, useState } from "react";
import { Database, Tag, TrendingUp, TrendingDown } from "lucide-react";

export default function DataTrainingLab() {
  const [labelQuality, setLabelQuality] = useState(3);
  const [dataCoverage, setDataCoverage] = useState(2);
  const [leakageRisk, setLeakageRisk] = useState(1);
  const [capacity, setCapacity] = useState(3);

  const diagnosis = useMemo(() => {
    if (leakageRisk >= 3) return "High leakage risk. You might see great metrics that collapse in real use.";
    if (labelQuality <= 1) return "Low label quality. Fix labels before tuning models.";
    if (dataCoverage <= 1) return "Low coverage. Your dataset may not represent the real world well enough.";
    if (capacity >= 4 && dataCoverage <= 2) return "High model capacity with limited coverage. Overfitting risk is high.";
    return "Reasonable baseline. Keep the dataset honest and make evaluation reflect real use.";
  }, [labelQuality, dataCoverage, leakageRisk, capacity]);

  const note = useMemo(() => {
    return [
      "Training data sources: operational logs, user interactions, curated datasets, expert annotation, synthetic data (with care).",
      "Label quality matters more than model choice when labels are noisy or inconsistent.",
      "More data is not always better if it adds bias, duplicates, or low-quality noise.",
      "Overfitting is learning the training set. Underfitting is not learning enough signal.",
    ];
  }, []);

  return (
    <section className="space-y-6" aria-label="Data and training basics lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Data and training basics</h2>
        </div>
        <p className="text-sm text-slate-700">The model is the easy part. Data quality, labels, and honest evaluation decide whether the system is safe.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">What shapes training outcomes</h3>
            </div>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {note.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">A lightweight training risk check</h3>
            </div>
            <p className="text-sm text-slate-700">Move the sliders to see what tends to break first. This is qualitative guidance, not a proof.</p>
            {[
              { label: "Label quality", value: labelQuality, set: setLabelQuality },
              { label: "Data coverage (representativeness)", value: dataCoverage, set: setDataCoverage },
              { label: "Leakage risk", value: leakageRisk, set: setLeakageRisk },
              { label: "Model capacity", value: capacity, set: setCapacity },
            ].map((x) => (
              <div key={x.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>{x.label}</span>
                  <span>{["Very low", "Low", "Medium", "High", "Very high"][x.value]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={x.value} onChange={(e) => x.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              <p className="mt-2 text-sm text-slate-700">{diagnosis}</p>
              <p className="mt-2 text-xs text-slate-600">
                A common failure pattern is “great metrics in the lab, poor outcomes in production”. Leakage and unrepresentative data are frequent causes.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-rose-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">More data is not always better</p>
            </div>
            <p className="text-sm text-slate-700">
              If additional data is biased, duplicated, or poorly labelled, it can make the system worse while looking better in shallow metrics.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



