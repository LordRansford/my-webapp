"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Gauge, UploadCloud } from "lucide-react";
import Papa from "papaparse";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { AiToolCard } from "./AiToolCard";
import { validateUpload } from "@/utils/validateUpload";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

type Row = {
  [key: string]: string | number | null;
};

type ParsedData = {
  columns: string[];
  rows: Row[];
};

type Metrics = {
  threshold: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  tpr: number;
  fpr: number;
  tnr: number;
  precision: number;
  recall: number;
  accuracy: number;
  f1: number;
};

function safeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const num = Number(String(value).replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function computeMetrics(labels: (string | number)[], scores: number[], positiveLabel: string, threshold: number): Metrics {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  for (let i = 0; i < labels.length; i += 1) {
    const label = String(labels[i]).trim();
    const score = scores[i];
    const isPositiveTrue = label === positiveLabel;
    const isPredictedPositive = score >= threshold;

    if (isPositiveTrue && isPredictedPositive) tp += 1;
    else if (!isPositiveTrue && isPredictedPositive) fp += 1;
    else if (!isPositiveTrue && !isPredictedPositive) tn += 1;
    else if (isPositiveTrue && !isPredictedPositive) fn += 1;
  }

  const p = tp + fn;
  const n = tn + fp;

  const tpr = p > 0 ? tp / p : 0;
  const fpr = n > 0 ? fp / n : 0;
  const tnr = n > 0 ? tn / n : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tpr;
  const accuracy = tp + fp + tn + fn > 0 ? (tp + tn) / (tp + fp + tn + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return { threshold, tp, fp, tn, fn, tpr, fpr, tnr, precision, recall, accuracy, f1 };
}

export function ThresholdEvaluationLab() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [labelColumn, setLabelColumn] = useState<string>("");
  const [scoreColumn, setScoreColumn] = useState<string>("");
  const [positiveLabel, setPositiveLabel] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(0.5);
  const [statusMsg, setStatusMsg] = useState<string>("Upload a CSV with true labels and model scores to explore thresholds.");

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { safeFiles, errors } = validateUpload(e.target.files, { maxBytes: 8 * 1024 * 1024, allowedExtensions: [".csv"] });
      if (errors.length) alert(errors.join("\n"));
      const file = safeFiles[0];
      if (!file) return;

      setStatusMsg("Parsing CSV…");
      setParsedData(null);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const rows = results.data as Row[];
          if (!rows || rows.length === 0) {
            setStatusMsg("The CSV file appears to be empty or malformed.");
            return;
          }
          const first = rows[0];
          const columns = Object.keys(first);
          if (!columns.length) {
            setStatusMsg("Could not detect any columns in the CSV file.");
            return;
          }

          setParsedData({ columns, rows });
          setStatusMsg("File loaded. Now choose the label column, the score column and the positive label.");

          if (!labelColumn) setLabelColumn(columns[0]);
          if (!scoreColumn && columns.length > 1) setScoreColumn(columns[1]);
        },
        error: (err) => {
          setStatusMsg(`Failed to parse CSV: ${err.message}`);
        },
      });
    },
    [labelColumn, scoreColumn]
  );

  const currentColumns = parsedData?.columns ?? [];

  const labelValues: (string | number)[] = useMemo(() => {
    if (!parsedData || !labelColumn) return [];
    return parsedData.rows.map((row) => row[labelColumn]).filter((v) => v !== null && v !== undefined) as (string | number)[];
  }, [parsedData, labelColumn]);

  const scoreValues: number[] = useMemo(() => {
    if (!parsedData || !scoreColumn) return [];
    const out: number[] = [];
    for (const row of parsedData.rows) {
      const n = safeNumber(row[scoreColumn]);
      if (n !== null) out.push(n);
    }
    return out;
  }, [parsedData, scoreColumn]);

  const distinctLabels: string[] = useMemo(() => {
    if (!labelValues.length) return [];
    const set = new Set<string>();
    for (const v of labelValues) {
      const s = String(v).trim();
      if (s.length > 0) set.add(s);
    }
    return Array.from(set.values());
  }, [labelValues]);

  const canCompute =
    parsedData && labelColumn && scoreColumn && positiveLabel && labelValues.length === scoreValues.length && labelValues.length > 0;

  const currentMetrics: Metrics | null = useMemo(() => {
    if (!canCompute) return null;
    return computeMetrics(labelValues, scoreValues, positiveLabel, threshold);
  }, [canCompute, labelValues, scoreValues, positiveLabel, threshold]);

  const rocCurve = useMemo(() => {
    if (!canCompute) return [];
    const points: { threshold: number; tpr: number; fpr: number }[] = [];
    const steps = 21;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const m = computeMetrics(labelValues, scoreValues, positiveLabel, t);
      points.push({ threshold: t, tpr: Number(m.tpr.toFixed(3)), fpr: Number(m.fpr.toFixed(3)) });
    }
    return points;
  }, [canCompute, labelValues, scoreValues, positiveLabel]);

  function narrative(metrics: Metrics | null): string {
    if (!metrics) {
      return "Once you upload data and choose the positive label this area will explain what your current threshold is doing.";
    }
    const total = metrics.tp + metrics.fp + metrics.tn + metrics.fn;
    if (!total) {
      return "There are no rows to evaluate. Check that the label and score columns are set correctly.";
    }
    const recall = metrics.recall.toFixed(3);
    const precision = metrics.precision.toFixed(3);
    const fpr = metrics.fpr.toFixed(3);
    const thresholdText = metrics.threshold.toFixed(2);

    return `At a threshold of ${thresholdText} the model correctly catches ${metrics.tp} positive cases and misses ${metrics.fn}. It also creates ${metrics.fp} false alarms for ${metrics.tn} true negatives. That gives a recall of ${recall}, a precision of ${precision} and a false positive rate of ${fpr}. Use this to decide whether you prefer to catch more positives, reduce false alarms or aim for a balance.`;
  }

  return (
    <AiToolCard
      id="threshold-evaluation-lab-title"
      title="Threshold and evaluation cockpit"
      icon={<Gauge className="h-4 w-4" aria-hidden="true" />}
      description="Upload model outputs and explore how the confusion matrix and metrics change as you adjust the decision threshold."
    >
      <SecurityBanner />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 1 – Upload model outputs</p>
          <p className="text-[11px] text-slate-600">
            Use a CSV file where each row is a prediction. Include a true label column and a model score column between 0 and 1. Only
            your browser sees this data.
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="threshold-upload" className="block text-[11px] font-medium text-slate-700">
                CSV file
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="threshold-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
                >
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  <span>Choose file</span>
                </label>
                <input id="threshold-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              <span className="text-[11px] text-slate-500">CSV only, max 8MB. Stays in your browser.</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="label-column" className="block text-[11px] font-medium text-slate-700">
                Label column
              </label>
              <select
                id="label-column"
                value={labelColumn}
                onChange={(e) => setLabelColumn(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Select label column</option>
                {currentColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="score-column" className="block text-[11px] font-medium text-slate-700">
                Score or probability column
              </label>
              <select
                id="score-column"
                value={scoreColumn}
                onChange={(e) => setScoreColumn(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Select score column</option>
                {currentColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">Scores should be between 0 and 1. They are treated as the model&apos;s confidence that a case is positive.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="positive-label" className="block text-[11px] font-medium text-slate-700">
                Positive label
              </label>
              <select
                id="positive-label"
                value={positiveLabel}
                onChange={(e) => setPositiveLabel(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Select positive label</option>
                {distinctLabels.map((lab) => (
                  <option key={lab} value={lab}>
                    {lab}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                This is the outcome you most care about catching. For example, fraud, unsafe, complaint or churn.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">{statusMsg}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 2 – Move the threshold and watch the confusion matrix</p>
          <p className="text-[11px] text-slate-600">Use the slider or numeric box to change the decision threshold. The confusion matrix and metrics will update in real time.</p>

          <div className="space-y-2">
            <label htmlFor="threshold-input" className="block text-[11px] font-medium text-slate-700">
              Decision threshold
            </label>
            <div className="flex items-center gap-3">
              <input
                id="threshold-input"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Math.min(1, Math.max(0, Number(e.target.value))))}
                className="flex-1"
              />
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Math.min(1, Math.max(0, Number(e.target.value))))}
                className="w-20 rounded-2xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-[11px] text-slate-700">
            <p className="mb-2 text-[11px] font-semibold text-slate-900">Confusion matrix</p>
            {currentMetrics ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-500">Actual positive</p>
                  <div className="grid grid-cols-2 gap-1 text-center">
                    <div className="rounded-xl bg-emerald-50 px-2 py-1">
                      <p className="text-[10px] text-slate-500">Predicted positive</p>
                      <p className="text-xs font-semibold text-emerald-700">TP {currentMetrics.tp}</p>
                    </div>
                    <div className="rounded-xl bg-rose-50 px-2 py-1">
                      <p className="text-[10px] text-slate-500">Predicted negative</p>
                      <p className="text-xs font-semibold text-rose-700">FN {currentMetrics.fn}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-500">Actual negative</p>
                  <div className="grid grid-cols-2 gap-1 text-center">
                    <div className="rounded-xl bg-amber-50 px-2 py-1">
                      <p className="text-[10px] text-slate-500">Predicted positive</p>
                      <p className="text-xs font-semibold text-amber-700">FP {currentMetrics.fp}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-2 py-1">
                      <p className="text-[10px] text-slate-500">Predicted negative</p>
                      <p className="text-xs font-semibold text-slate-700">TN {currentMetrics.tn}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Once you upload data and choose the label, score and positive label, the confusion matrix will appear here.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-[11px] text-slate-700">
            <p className="mb-1 text-[11px] font-semibold text-slate-900">Metrics</p>
            {currentMetrics ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <p>
                  Accuracy: <span className="font-semibold">{currentMetrics.accuracy.toFixed(3)}</span>
                </p>
                <p>
                  Precision: <span className="font-semibold">{currentMetrics.precision.toFixed(3)}</span>
                </p>
                <p>
                  Recall: <span className="font-semibold">{currentMetrics.recall.toFixed(3)}</span>
                </p>
                <p>
                  F1: <span className="font-semibold">{currentMetrics.f1.toFixed(3)}</span>
                </p>
                <p>
                  True negative rate: <span className="font-semibold">{currentMetrics.tnr.toFixed(3)}</span>
                </p>
                <p>
                  False positive rate: <span className="font-semibold">{currentMetrics.fpr.toFixed(3)}</span>
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">Metrics will appear here once a dataset, positive label and threshold are set.</p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 3 – ROC curve and trade offs</p>
          <p className="text-[11px] text-slate-600">The ROC curve shows how the true positive rate and false positive rate move together as you scan thresholds from 0 to 1.</p>

          <div className="h-44 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            {rocCurve.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocCurve}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fpr"
                    tick={{ fontSize: 9 }}
                    label={{ value: "False positive rate", position: "insideBottom", offset: -4, fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fontSize: 9 }}
                    domain={[0, 1]}
                    label={{ value: "True positive rate", angle: -90, position: "insideLeft", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }}
                    formatter={(value: any, name: string) => {
                      if (name === "threshold") return [Number(value).toFixed(2), "Threshold"];
                      return [value, name];
                    }}
                  />
                  <Line type="monotone" dataKey="tpr" stroke="#0f766e" strokeWidth={2} dot={false} name="ROC" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[11px] text-slate-500">
                Once you have uploaded data and selected the positive label the ROC curve will appear here. Each point on the curve
                corresponds to a threshold between 0 and 1.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-[11px] text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">What this means</p>
            <p>{narrative(currentMetrics)}</p>
            <p className="text-slate-500">
              In practice you would choose a threshold based on cost of false positives and false negatives, operational capacity
              and the wider control environment. This lab helps you explore that space with real data before you make those
              decisions.
            </p>
          </div>
        </div>
      </div>
    </AiToolCard>
  );
}
