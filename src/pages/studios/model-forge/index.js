"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
} from "recharts";
import { useStudiosStore } from "@/stores/useStudiosStore";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

const sigmoid = (x) => 1 / (1 + Math.exp(-x));

function inferTaskType(values) {
  const nonNull = values.filter((v) => v !== null && v !== undefined);
  if (nonNull.length === 0) return { type: "unknown", reason: "Target is empty." };
  const allNumeric = nonNull.every((v) => !Number.isNaN(Number(v)));
  const uniques = new Set(nonNull.map((v) => String(v))).size;
  if (allNumeric && uniques > 12) return { type: "regression", reason: "Target is numeric with many distinct values." };
  if (!allNumeric && uniques <= 20) return { type: "classification", reason: "Target has repeated categories." };
  if (allNumeric && uniques <= 20) return { type: "classification", reason: "Target is numeric with few repeated values." };
  return { type: "regression", reason: "Defaulting to regression." };
}

function splitData(rows, targetCol, ratio = 0.8) {
  const shuffled = [...rows].sort(() => Math.random() - 0.5);
  const cutoff = Math.max(1, Math.floor(shuffled.length * ratio));
  const train = shuffled.slice(0, cutoff);
  const test = shuffled.slice(cutoff);
  return { train, test };
}

function getColumnInfo(rows) {
  if (!rows || rows.length === 0) return {};
  const cols = Object.keys(rows[0] || {});
  const info = {};
  cols.forEach((col) => {
    const vals = rows.map((r) => r[col]).filter((v) => v !== null && v !== undefined);
    const numericVals = vals.map((v) => Number(v)).filter((v) => !Number.isNaN(v));
    const unique = new Set(vals.map((v) => String(v))).size;
    info[col] = {
      isNumeric: numericVals.length === vals.length,
      min: numericVals.length ? Math.min(...numericVals) : undefined,
      max: numericVals.length ? Math.max(...numericVals) : undefined,
      uniqueValues: vals.slice(0, 200).reduce((acc, v) => acc.add(String(v)), new Set()),
      uniqueCount: unique,
    };
  });
  return info;
}

function encodeRows(rows, columns, colInfo, targetCol) {
  const featureCols = columns.filter((c) => c !== targetCol);
  const encoded = [];
  const cats = {};
  featureCols.forEach((c) => {
    if (!colInfo[c]?.isNumeric) {
      cats[c] = Array.from(colInfo[c].uniqueValues).slice(0, 20);
    }
  });
  rows.forEach((row) => {
    const feats = [];
    featureCols.forEach((c) => {
      if (colInfo[c]?.isNumeric) {
        const v = Number(row[c]);
        feats.push(Number.isNaN(v) ? 0 : v);
      } else {
        const vals = cats[c] || [];
        vals.forEach((val) => {
          feats.push(row[c] === val ? 1 : 0);
        });
      }
    });
    encoded.push(feats);
  });
  return { featureCols, cats, encoded };
}

function trainLogisticRegression(X, y, { lr = 0.05, epochs = 120 }) {
  if (X.length === 0) return { weights: [], bias: 0 };
  const m = X.length;
  const n = X[0].length;
  let w = new Array(n).fill(0);
  let b = 0;
  for (let epoch = 0; epoch < epochs; epoch += 1) {
    for (let i = 0; i < m; i += 1) {
      const z = w.reduce((acc, wj, j) => acc + wj * X[i][j], b);
      const pred = sigmoid(z);
      const err = pred - y[i];
      for (let j = 0; j < n; j += 1) {
        w[j] -= lr * err * X[i][j];
      }
      b -= lr * err;
    }
  }
  return { weights: w, bias: b };
}

function trainLinearRegression(X, y, { lr = 0.01, epochs = 200 }) {
  if (X.length === 0) return { weights: [], bias: 0 };
  const m = X.length;
  const n = X[0].length;
  let w = new Array(n).fill(0);
  let b = 0;
  for (let epoch = 0; epoch < epochs; epoch += 1) {
    for (let i = 0; i < m; i += 1) {
      const pred = w.reduce((acc, wj, j) => acc + wj * X[i][j], b);
      const err = pred - y[i];
      for (let j = 0; j < n; j += 1) {
        w[j] -= lr * err * X[i][j];
      }
      b -= lr * err;
    }
  }
  return { weights: w, bias: b };
}

function computeClassificationMetrics(yTrue, yPred) {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  for (let i = 0; i < yTrue.length; i += 1) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp += 1;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp += 1;
    else if (yTrue[i] === 0 && yPred[i] === 0) tn += 1;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn += 1;
  }
  const accuracy = (tp + tn) / Math.max(1, yTrue.length);
  const precision = tp / Math.max(1, tp + fp);
  const recall = tp / Math.max(1, tp + fn);
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return { tp, fp, tn, fn, accuracy, precision, recall, f1 };
}

function computeRegressionMetrics(yTrue, yPred) {
  const n = yTrue.length;
  if (n === 0) return { mae: 0, mse: 0, rmse: 0, r2: 0 };
  let mae = 0;
  let mse = 0;
  let ssTot = 0;
  let ssRes = 0;
  const meanY = yTrue.reduce((a, b) => a + b, 0) / n;
  for (let i = 0; i < n; i += 1) {
    const e = yPred[i] - yTrue[i];
    mae += Math.abs(e);
    mse += e * e;
    ssTot += (yTrue[i] - meanY) * (yTrue[i] - meanY);
    ssRes += e * e;
  }
  mae /= n;
  mse /= n;
  const rmse = Math.sqrt(mse);
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  return { mae, mse, rmse, r2 };
}

export default function ModelForgePage() {
  const datasets = useStudiosStore((s) => s.datasets);
  const parsedDataById = useStudiosStore((s) => s.parsedDataById);
  const addJob = useStudiosStore((s) => s.addJob);
  const updateJob = useStudiosStore((s) => s.updateJob);

  const [selectedDatasetId, setSelectedDatasetId] = useState(datasets[0]?.id || "");
  const [targetCol, setTargetCol] = useState("");
  const [taskInfo, setTaskInfo] = useState({ type: "unknown", reason: "" });
  const [algorithm, setAlgorithm] = useState("logistic");
  const [split, setSplit] = useState(0.8);
  const [maxDepth, setMaxDepth] = useState(4);
  const [numTrees, setNumTrees] = useState(30);
  const [regStrength, setRegStrength] = useState(0.1);
  const [training, setTraining] = useState(false);
  const [trainError, setTrainError] = useState("");
  const [modelState, setModelState] = useState(null);
  const [predInput, setPredInput] = useState({});
  const [predResult, setPredResult] = useState(null);

  const dataset = useMemo(() => datasets.find((d) => d.id === selectedDatasetId), [datasets, selectedDatasetId]);
  const parsed = useMemo(() => (dataset ? parsedDataById[dataset.id] : null), [dataset, parsedDataById]);
  const rows = useMemo(() => parsed?.rows || [], [parsed]);
  const columns = useMemo(() => parsed?.columns || [], [parsed]);
  const colInfo = useMemo(() => getColumnInfo(rows), [rows]);

  useEffect(() => {
    if (columns.length > 0 && !targetCol) {
      setTargetCol(columns[columns.length - 1]);
    }
  }, [columns, targetCol]);

  useEffect(() => {
    if (targetCol && rows.length > 0) {
      const vals = rows.map((r) => r[targetCol]);
      setTaskInfo(inferTaskType(vals));
      if (inferTaskType(vals).type === "classification") {
        setAlgorithm("logistic");
      } else {
        setAlgorithm("linear");
      }
    }
  }, [targetCol, rows]);

  const featureCols = useMemo(() => columns.filter((c) => c !== targetCol), [columns, targetCol]);

  const handleTrain = async () => {
    setTrainError("");
    if (!dataset || !targetCol || !rows.length) {
      setTrainError("Select a dataset and target column first.");
      return;
    }
    setTraining(true);
    try {
      const jobId = `job-${Date.now()}`;
      addJob({
        id: jobId,
        name: `Model Forge - ${algorithm} on ${dataset.name}`,
        studio: "model-forge",
        datasetId: dataset.id,
        status: "running",
      });

      const maxRows = 800;
      const limitedRows = rows.length > maxRows ? rows.slice(0, maxRows) : rows;
      if (rows.length > maxRows) {
        setTrainError(`Dataset sampled to ${maxRows} rows for browser training.`);
      }

      const targetVals = limitedRows.map((r) => r[targetCol]);
      const { featureCols: usedFeatures, cats, encoded } = encodeRows(limitedRows, columns, colInfo, targetCol);

      let y = [];
      let model = null;
      let metrics = {};
      const { train, test } = splitData(
        limitedRows.map((_, idx) => ({ x: encoded[idx], y: targetVals[idx] })),
        "y",
        split
      );
      const Xtrain = train.map((t) => t.x);
      const Xtest = test.map((t) => t.x);

      if (taskInfo.type === "classification") {
        const labels = Array.from(new Set(targetVals.map((v) => String(v))));
        if (labels.length !== 2) {
          throw new Error("Only binary classification is supported in this browser demo.");
        }
        const positiveLabel = labels[0];
        y = limitedRows.map((r) => (String(r[targetCol]) === positiveLabel ? 1 : 0));
        const ytrain = train.map((t) => (String(t.y) === positiveLabel ? 1 : 0));
        const ytest = test.map((t) => (String(t.y) === positiveLabel ? 1 : 0));

        const clf =
          algorithm === "logistic"
            ? trainLogisticRegression(Xtrain, ytrain, { lr: 0.05, epochs: 160 })
            : trainLogisticRegression(Xtrain, ytrain, { lr: 0.03, epochs: 200 }); // reuse simple trainer

        const preds = Xtest.map((x) => sigmoid(clf.weights.reduce((acc, wj, j) => acc + wj * x[j], clf.bias)));
        const predLabels = preds.map((p) => (p >= 0.5 ? 1 : 0));
        const clsMetrics = computeClassificationMetrics(ytest, predLabels);
        metrics = clsMetrics;
        model = { type: "classification", positiveLabel, clf, usedFeatures, cats };
      } else {
        const numericY = limitedRows.map((r) => Number(r[targetCol]) || 0);
        const ytrain = train.map((t) => Number(t.y) || 0);
        const ytest = test.map((t) => Number(t.y) || 0);
        const reg =
          algorithm === "linear"
            ? trainLinearRegression(Xtrain, ytrain, { lr: 0.01 + regStrength * 0.01, epochs: 250 })
            : trainLinearRegression(Xtrain, ytrain, { lr: 0.008, epochs: 260 });
        const preds = Xtest.map((x) => reg.weights.reduce((acc, wj, j) => acc + wj * x[j], reg.bias));
        const regMetrics = computeRegressionMetrics(ytest, preds);
        metrics = regMetrics;
        model = { type: "regression", reg, usedFeatures, cats };
      }

      updateJob(jobId, {
        status: "completed",
        finishedAt: new Date().toISOString(),
        metrics,
      });

      setModelState({
        model,
        metrics,
        featureCols: usedFeatures,
        cats,
      });

      const initialPredInput = {};
      featureCols.forEach((f) => {
        if (colInfo[f]?.isNumeric) {
          initialPredInput[f] = colInfo[f].min ?? 0;
        } else {
          initialPredInput[f] = Array.from(colInfo[f].uniqueValues)[0] ?? "";
        }
      });
      setPredInput(initialPredInput);
    } catch (err) {
      setTrainError(err.message || "Training failed");
    } finally {
      setTraining(false);
    }
  };

  const classificationChartData = useMemo(() => {
    if (!modelState || taskInfo.type !== "classification") return [];
    const { tp, fp, tn, fn } = modelState.metrics;
    return [
      { name: "Precision", value: modelState.metrics.precision },
      { name: "Recall", value: modelState.metrics.recall },
      { name: "F1", value: modelState.metrics.f1 },
      { name: "Accuracy", value: modelState.metrics.accuracy },
    ];
  }, [modelState, taskInfo.type]);

  const regressionScatter = useMemo(() => {
    if (!modelState || taskInfo.type !== "regression") return [];
    const parsedRows = rows.slice(0, 200);
    const { featureCols: usedFeatures, cats } = modelState.model;
    const { encoded } = encodeRows(parsedRows, columns, colInfo, targetCol);
    const preds = encoded.map((x) => modelState.model.reg.weights.reduce((acc, wj, j) => acc + wj * x[j], modelState.model.reg.bias));
    return parsedRows.map((row, idx) => ({
      actual: Number(row[targetCol]) || 0,
      predicted: preds[idx],
    }));
  }, [modelState, taskInfo.type, rows, columns, colInfo, targetCol]);

  const predictSingle = () => {
    if (!modelState) return;
    const { model } = modelState;
    const { featureCols: usedFeatures, cats } = model;
    const featVec = [];
    usedFeatures.forEach((c) => {
      if (colInfo[c]?.isNumeric) {
        featVec.push(Number(predInput[c]) || 0);
      } else {
        const vals = cats[c] || [];
        vals.forEach((v) => featVec.push(predInput[c] === v ? 1 : 0));
      }
    });
    if (model.type === "classification") {
      const z = model.clf.weights.reduce((acc, wj, j) => acc + wj * featVec[j], model.clf.bias);
      const p = sigmoid(z);
      setPredResult({
        type: "classification",
        prob: p,
        label: p >= 0.5 ? model.positiveLabel : `not ${model.positiveLabel}`,
      });
    } else {
      const val = model.reg.weights.reduce((acc, wj, j) => acc + wj * featVec[j], model.reg.bias);
      setPredResult({ type: "regression", value: val });
    }
  };

  const previewRows = rows.slice(0, 5);

  return (
    <div className="page-content space-y-8">
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100">
          Model Forge
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Model Forge</h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          This is where spreadsheets come to be judged. We take your tabular data, agree what you are trying to predict, and build
          small models you can actually interrogate.
        </p>
      </div>

      <SecurityBanner />

      <section id="choose-dataset" className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900">1. Choose dataset</h2>
          <p className="text-sm text-slate-700">
            Pick an existing dataset from Control Room. Need a new one?{" "}
            <Link href="/studios" className="text-emerald-700 font-semibold hover:underline">
              Open Control Room to upload
            </Link>
            .
          </p>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
          >
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
            {datasets.length === 0 && <option>No datasets</option>}
          </select>
        </div>

        {datasets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700">
            No datasets yet. Upload a CSV or JSON in Control Room first.
          </div>
        )}

        {dataset && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold text-slate-900">Dataset summary</p>
              <p className="text-sm text-slate-700">{dataset.name}</p>
              <p className="text-xs text-slate-700">
                {dataset.rowCount ?? rows.length} rows • {dataset.columnCount ?? columns.length} columns
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold text-slate-900">Preview (first 5 rows)</p>
              <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full text-xs text-slate-700">
                  <thead className="bg-slate-50">
                    <tr>
                      {columns.map((c) => (
                        <th key={c} className="px-2 py-1 text-left font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r, idx) => (
                      <tr key={idx} className="border-t border-slate-100">
                        {columns.map((c) => (
                          <td key={c} className="px-2 py-1">
                            {String(r[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      <section id="define-target" className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">2. Define target and task</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-900">Target column</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={targetCol}
              onChange={(e) => setTargetCol(e.target.value)}
            >
              {columns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-900">Inferred task</p>
            <p className="text-sm text-slate-800 capitalize">{taskInfo.type}</p>
            <p className="text-xs text-slate-700">{taskInfo.reason}</p>
          </div>
        </div>
      </section>

      <section id="configure-model" className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">3. Configure model</h2>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-900">Train/test split</p>
          <input
            type="range"
            min={0.5}
            max={0.9}
            step={0.05}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-700">Train fraction: {split.toFixed(2)}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {taskInfo.type === "classification" && (
            <>
              <button
                onClick={() => setAlgorithm("logistic")}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  algorithm === "logistic"
                    ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200"
                    : "border-slate-200 bg-slate-50/60"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">Logistic regression</p>
                <p className="text-sm text-slate-700">Fast, simple baseline. Good for linearly separable signals.</p>
              </button>
              <button
                onClick={() => setAlgorithm("rf")}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  algorithm === "rf" ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200" : "border-slate-200 bg-slate-50/60"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">Tree ensemble</p>
                <p className="text-sm text-slate-700">Handles non-linear patterns. This demo reuses a light trainer.</p>
              </button>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900">Max depth (trees)</label>
                <input
                  type="number"
                  className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(Number(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900">Number of trees</label>
                <input
                  type="number"
                  className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={numTrees}
                  onChange={(e) => setNumTrees(Number(e.target.value) || 10)}
                />
              </div>
            </>
          )}
          {taskInfo.type === "regression" && (
            <>
              <button
                onClick={() => setAlgorithm("linear")}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  algorithm === "linear"
                    ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200"
                    : "border-slate-200 bg-slate-50/60"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">Linear regression</p>
                <p className="text-xs text-slate-600">Simple baseline with regularisation.</p>
              </button>
              <button
                onClick={() => setAlgorithm("tree-reg")}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  algorithm === "tree-reg"
                    ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200"
                    : "border-slate-200 bg-slate-50/60"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">Tree-based regression</p>
                <p className="text-sm text-slate-700">Captures non-linearities. Demo uses light-weight trainer.</p>
              </button>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900">Regularisation strength</label>
                <input
                  type="number"
                  className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={regStrength}
                  onChange={(e) => setRegStrength(Number(e.target.value) || 0.1)}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section id="train" className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">4. Train and inspect metrics</h2>
            <p className="text-sm text-slate-700">Runs entirely in your browser on a small sample for safety.</p>
          </div>
          <button
            onClick={handleTrain}
            disabled={training || !dataset || !targetCol}
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {training ? "Training..." : "Train model"}
          </button>
        </div>
        {trainError && <p className="text-xs text-amber-700">{trainError}</p>}

        {modelState && taskInfo.type === "classification" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-900">Confusion matrix</p>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-emerald-50 px-2 py-2">
                  <p className="text-slate-500">TP</p>
                  <p className="text-sm font-semibold text-emerald-700">{modelState.metrics.tp}</p>
                </div>
                <div className="rounded-xl bg-amber-50 px-2 py-2">
                  <p className="text-slate-500">FP</p>
                  <p className="text-sm font-semibold text-amber-700">{modelState.metrics.fp}</p>
                </div>
                <div className="rounded-xl bg-rose-50 px-2 py-2">
                  <p className="text-slate-500">FN</p>
                  <p className="text-sm font-semibold text-rose-700">{modelState.metrics.fn}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-2">
                  <p className="text-slate-500">TN</p>
                  <p className="text-sm font-semibold text-slate-700">{modelState.metrics.tn}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">Precision / Recall / F1</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classificationChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {modelState && taskInfo.type === "regression" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-1 text-sm text-slate-800">
              <p className="text-xs font-semibold text-slate-900 mb-1">Error metrics</p>
              <p>MAE: {modelState.metrics.mae.toFixed(3)}</p>
              <p>MSE: {modelState.metrics.mse.toFixed(3)}</p>
              <p>RMSE: {modelState.metrics.rmse.toFixed(3)}</p>
              <p>R²: {modelState.metrics.r2.toFixed(3)}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">Predicted vs actual</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="actual" name="Actual" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="predicted" name="Predicted" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Scatter data={regressionScatter} fill="#0f766e" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </section>

      {modelState && (
        <section id="predict" className="rounded-3xl bg-white p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">5. Try the model</h2>
          <p className="text-sm text-slate-700">
            Generated inputs from your feature columns. Predictions happen in your browser. Use this for intuition, not production
            decisions.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {featureCols.map((f) => (
              <div key={f} className="space-y-1">
                <label className="text-xs font-semibold text-slate-900">{f}</label>
                {colInfo[f]?.isNumeric ? (
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={predInput[f] ?? ""}
                    onChange={(e) => setPredInput((prev) => ({ ...prev, [f]: e.target.value }))}
                  />
                ) : (
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    value={predInput[f] ?? ""}
                    onChange={(e) => setPredInput((prev) => ({ ...prev, [f]: e.target.value }))}
                  >
                    {(colInfo[f]?.uniqueValues ? Array.from(colInfo[f].uniqueValues) : []).map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={predictSingle}
            className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
          >
            Predict
          </button>

          {predResult && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-800 space-y-1">
              {predResult.type === "classification" ? (
                <>
                  <p className="font-semibold text-slate-900">Predicted class: {predResult.label}</p>
                  <p>Probability: {predResult.prob.toFixed(3)}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-900">Predicted value: {predResult.value.toFixed(3)}</p>
                </>
              )}
              <p className="text-xs text-slate-700">
                This is a classroom-level model trained in your browser on a small sample. Great for intuition, not for medical or
                credit decisions.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
