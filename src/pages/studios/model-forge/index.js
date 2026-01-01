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
import { validateUpload } from "@/utils/validateUpload";
import { useToolRunner } from "@/hooks/useToolRunner";
import ComputeEstimatePanel from "@/components/compute/ComputeEstimatePanel";
import ComputeSummaryPanel from "@/components/compute/ComputeSummaryPanel";
import { formatBytes, getToolFileLimits } from "@/config/computeLimits";
import StudioNavigation from "@/components/studios/StudioNavigation";
import { StudioBreadcrumbs } from "@/components/studios/StudioBreadcrumbs";

const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const MB = 1024 * 1024;

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

function normaliseNumericInPlace(encoded, featureCols, colInfo) {
  if (!encoded?.length) return encoded;
  // We only normalise the numeric feature columns (not one-hot blocks).
  // This is intentionally simple for learning: min-max scaling by column range.
  let cursor = 0;
  const numericIdx = new Set();
  featureCols.forEach((c) => {
    if (colInfo[c]?.isNumeric) numericIdx.add(cursor);
    cursor += colInfo[c]?.isNumeric ? 1 : Math.min(20, colInfo[c]?.uniqueCount || 0);
  });
  const mins = {};
  const maxs = {};
  numericIdx.forEach((j) => {
    mins[j] = Infinity;
    maxs[j] = -Infinity;
  });
  for (const row of encoded) {
    numericIdx.forEach((j) => {
      const v = Number(row[j]);
      if (!Number.isFinite(v)) return;
      mins[j] = Math.min(mins[j], v);
      maxs[j] = Math.max(maxs[j], v);
    });
  }
  for (const row of encoded) {
    numericIdx.forEach((j) => {
      const min = mins[j];
      const max = maxs[j];
      if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) return;
      row[j] = (row[j] - min) / (max - min);
    });
  }
  return encoded;
}

function abortError() {
  // Works across browsers and matches the AbortError check in useToolRunner.
  throw new DOMException("Aborted", "AbortError");
}

async function trainLogisticRegressionAsync(signal, X, y, { lr = 0.05, epochs = 120 }) {
  if (X.length === 0) return { weights: [], bias: 0 };
  const m = X.length;
  const n = X[0].length;
  let w = new Array(n).fill(0);
  let b = 0;
  for (let epoch = 0; epoch < epochs; epoch += 1) {
    if (signal?.aborted) abortError();
    for (let i = 0; i < m; i += 1) {
      if (signal?.aborted) abortError();
      const z = w.reduce((acc, wj, j) => acc + wj * X[i][j], b);
      const pred = sigmoid(z);
      const err = pred - y[i];
      for (let j = 0; j < n; j += 1) {
        w[j] -= lr * err * X[i][j];
      }
      b -= lr * err;
    }
    if (epoch % 10 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  return { weights: w, bias: b };
}

async function trainLinearRegressionAsync(signal, X, y, { lr = 0.01, epochs = 200 }) {
  if (X.length === 0) return { weights: [], bias: 0 };
  const m = X.length;
  const n = X[0].length;
  let w = new Array(n).fill(0);
  let b = 0;
  for (let epoch = 0; epoch < epochs; epoch += 1) {
    if (signal?.aborted) abortError();
    for (let i = 0; i < m; i += 1) {
      if (signal?.aborted) abortError();
      const pred = w.reduce((acc, wj, j) => acc + wj * X[i][j], b);
      const err = pred - y[i];
      for (let j = 0; j < n; j += 1) {
        w[j] -= lr * err * X[i][j];
      }
      b -= lr * err;
    }
    if (epoch % 10 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  return { weights: w, bias: b };
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
  const addDataset = useStudiosStore((s) => s.addDataset);

  const [selectedDatasetId, setSelectedDatasetId] = useState(datasets[0]?.id || "");
  const [targetCol, setTargetCol] = useState("");
  const [taskInfo, setTaskInfo] = useState({ type: "unknown", reason: "" });
  const [algorithm, setAlgorithm] = useState("logistic");
  const [split, setSplit] = useState(0.8);
  const [maxDepth, setMaxDepth] = useState(4);
  const [numTrees, setNumTrees] = useState(30);
  const [regStrength, setRegStrength] = useState(0.1);
  const [normaliseNumeric, setNormaliseNumeric] = useState(true);
  const [epochs, setEpochs] = useState(160);
  const [learningRate, setLearningRate] = useState(0.05);
  const [sensitiveCol, setSensitiveCol] = useState("");
  const [training, setTraining] = useState(false);
  const [trainError, setTrainError] = useState("");
  const [modelState, setModelState] = useState(null);
  const [runHistory, setRunHistory] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [predInput, setPredInput] = useState({});
  const [predResult, setPredResult] = useState(null);

  const runner = useToolRunner({ minIntervalMs: 800, timeoutMs: 45_000, toolId: "model-forge-train" });
  const fileLimits = useMemo(() => getToolFileLimits("model-forge-train"), []);

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

  useEffect(() => {
    if (columns.length > 0 && !sensitiveCol) {
      // Default to the first non-target categorical column if possible.
      const candidate = columns.find((c) => c !== targetCol && !colInfo[c]?.isNumeric) || "";
      setSensitiveCol(candidate);
    }
  }, [columns, targetCol, sensitiveCol, colInfo]);

  const maxFreeBytes = fileLimits?.freeMaxBytes ?? 350 * 1024;
  const maxPaidBytes = fileLimits?.paidMaxBytes ?? 2 * MB;
  const maxAbsoluteBytes = fileLimits?.absoluteMaxBytes ?? 4 * MB;

  const allowedUploadBytes = runner.compute.creditsVisible ? maxPaidBytes : maxFreeBytes;
  const maxAllowedEpochs = runner.compute.creditsVisible ? 600 : 200;

  const parseDatasetFile = async (file) => {
    const raw = await file.text();
    const name = file.name;
    const ext = (name.split(".").pop() || "").toLowerCase();
    let parsedRows = [];
    if (ext === "json") {
      const obj = JSON.parse(raw);
      if (Array.isArray(obj)) parsedRows = obj;
      else if (obj && Array.isArray(obj.rows)) parsedRows = obj.rows;
      else throw new Error("JSON must be an array of objects or an object with a rows array.");
    } else {
      // CSV: simple parser for learning use (no quoted commas).
      const lines = raw.split(/\r?\n/).filter(Boolean).slice(0, 2000);
      const header = lines[0]?.split(",").map((c) => c.trim()) || [];
      parsedRows = lines.slice(1).map((line) => {
        const parts = line.split(",");
        const row = {};
        header.forEach((h, idx) => {
          row[h] = parts[idx] ?? "";
        });
        return row;
      });
    }
    const cols = Object.keys(parsedRows[0] || {});
    return { columns: cols, rows: parsedRows };
  };

  const handleUpload = async (fileList) => {
    setUploadError("");
    const { safeFiles, errors } = validateUpload(fileList, { maxBytes: maxAbsoluteBytes, allowedExtensions: [".csv", ".json"] });
    if (errors.length) {
      setUploadError(errors.join(" "));
      return;
    }
    const f = safeFiles[0];
    if (!f) return;
    if (f.size > allowedUploadBytes) {
      setUploadError(
        `This file is larger than the current limit (${formatBytes(allowedUploadBytes)}). Sign in to unlock the higher studio tier.`
      );
      return;
    }
    try {
      const parsedLocal = await parseDatasetFile(f);
      const id = `ds-${Date.now()}`;
      addDataset(
        {
          id,
          name: f.name.replace(/\.(csv|json)$/i, ""),
          sizeBytes: f.size,
          rowCount: parsedLocal.rows.length,
          columnCount: parsedLocal.columns.length,
          columns: parsedLocal.columns,
          createdAt: new Date().toISOString(),
        },
        parsedLocal
      );
      setSelectedDatasetId(id);
    } catch (e) {
      setUploadError((e && e.message) || "Could not parse that file.");
    }
  };

  const featureCols = useMemo(() => columns.filter((c) => c !== targetCol), [columns, targetCol]);

  const handleTrain = async () => {
    setTrainError("");
    if (!dataset || !targetCol || !rows.length) {
      setTrainError("Select a dataset and target column first.");
      return;
    }
    setTraining(true);
    try {
      runner.resetError();
      const effectiveEpochs = Math.max(10, Math.min(maxAllowedEpochs, Number(epochs) || 160));
      const effectiveLr = Math.max(0.0005, Math.min(0.5, Number(learningRate) || 0.05));

      const jobId = `job-${Date.now()}`;
      addJob({ id: jobId, name: `Model Forge - ${algorithm} on ${dataset.name}`, studio: "model-forge", datasetId: dataset.id, status: "running" });

      const maxRowsFree = 600;
      const maxRowsPaid = 1500;
      const maxRows = runner.compute.creditsVisible ? maxRowsPaid : maxRowsFree;
      const limitedRows = rows.length > maxRows ? rows.slice(0, maxRows) : rows;
      if (rows.length > maxRows) setTrainError(`Dataset sampled to ${maxRows} rows for this studio tier.`);

      const meta = { inputBytes: dataset.sizeBytes || Math.min(1_000_000, limitedRows.length * columns.length * 10), steps: effectiveEpochs, expectedWallMs: 3500 };
      runner.prepare(meta);

      const trained = await runner.run(async (signal) => {
        const targetVals = limitedRows.map((r) => r[targetCol]);
        const enc = encodeRows(limitedRows, columns, colInfo, targetCol);
        const encoded = normaliseNumeric ? normaliseNumericInPlace(enc.encoded, enc.featureCols, colInfo) : enc.encoded;

        const { train, test } = splitData(
          limitedRows.map((row, idx) => ({ x: encoded[idx], y: targetVals[idx], raw: row })),
          "y",
          split
        );
        const Xtrain = train.map((t) => t.x);
        const Xtest = test.map((t) => t.x);

        if (taskInfo.type === "classification") {
          const labels = Array.from(new Set(targetVals.map((v) => String(v))));
          if (labels.length !== 2) throw new Error("This studio currently supports only binary classification for the tabular workbench.");
          const positiveLabel = labels[0];
          const ytrain = train.map((t) => (String(t.y) === positiveLabel ? 1 : 0));
          const ytest = test.map((t) => (String(t.y) === positiveLabel ? 1 : 0));

          const clf = await trainLogisticRegressionAsync(signal, Xtrain, ytrain, { lr: effectiveLr, epochs: effectiveEpochs });

          const predsTest = Xtest.map((x) => sigmoid(clf.weights.reduce((acc, wj, j) => acc + wj * x[j], clf.bias)));
          const predLabelsTest = predsTest.map((p) => (p >= 0.5 ? 1 : 0));
          const testMetrics = computeClassificationMetrics(ytest, predLabelsTest);

          const predsTrain = Xtrain.map((x) => sigmoid(clf.weights.reduce((acc, wj, j) => acc + wj * x[j], clf.bias)));
          const predLabelsTrain = predsTrain.map((p) => (p >= 0.5 ? 1 : 0));
          const trainMetrics = computeClassificationMetrics(ytrain, predLabelsTrain);

          return {
            taskType: "classification",
            model: { type: "classification", positiveLabel, clf, featureCols: enc.featureCols, cats: enc.cats },
            metrics: { test: testMetrics, train: trainMetrics },
            testRows: test,
          };
        }

        const ytrain = train.map((t) => Number(t.y) || 0);
        const ytest = test.map((t) => Number(t.y) || 0);
        const reg = await trainLinearRegressionAsync(signal, Xtrain, ytrain, { lr: 0.01 + regStrength * 0.01, epochs: effectiveEpochs });
        const predsTest = Xtest.map((x) => reg.weights.reduce((acc, wj, j) => acc + wj * x[j], reg.bias));
        const predsTrain = Xtrain.map((x) => reg.weights.reduce((acc, wj, j) => acc + wj * x[j], reg.bias));
        const testMetrics = computeRegressionMetrics(ytest, predsTest);
        const trainMetrics = computeRegressionMetrics(ytrain, predsTrain);

        return {
          taskType: "regression",
          model: { type: "regression", reg, featureCols: enc.featureCols, cats: enc.cats },
          metrics: { test: testMetrics, train: trainMetrics },
          testRows: test,
        };
      }, meta);

      if (!trained) {
        updateJob(jobId, { status: "cancelled", finishedAt: new Date().toISOString() });
        return;
      }

      updateJob(jobId, { status: "completed", finishedAt: new Date().toISOString(), metrics: trained.metrics?.test || {} });

      const nextState = {
        id: `run-${Date.now()}`,
        datasetId: dataset.id,
        datasetName: dataset.name,
        targetCol,
        taskType: trained.taskType,
        algorithm,
        split,
        normaliseNumeric,
        params: { epochs: effectiveEpochs, learningRate: effectiveLr, regStrength },
        model: trained.model,
        metrics: trained.metrics,
        testRows: trained.testRows,
        trainedAt: new Date().toISOString(),
      };

      setModelState(nextState);
      setRunHistory((prev) => [nextState, ...prev].slice(0, 8));

      const initialPredInput = {};
      (trained.model.featureCols || []).forEach((f) => {
        if (colInfo[f]?.isNumeric) initialPredInput[f] = colInfo[f].min ?? 0;
        else initialPredInput[f] = Array.from(colInfo[f].uniqueValues || [])[0] ?? "";
      });
      setPredInput(initialPredInput);
    } catch (err) {
      setTrainError(err?.message || "Training failed");
    } finally {
      setTraining(false);
    }
  };

  const classificationChartData = useMemo(() => {
    if (!modelState || taskInfo.type !== "classification") return [];
    const m = modelState.metrics?.test || modelState.metrics || {};
    return [
      { name: "Precision", value: m.precision },
      { name: "Recall", value: m.recall },
      { name: "F1", value: m.f1 },
      { name: "Accuracy", value: m.accuracy },
    ];
  }, [modelState, taskInfo.type]);

  const regressionScatter = useMemo(() => {
    if (!modelState || taskInfo.type !== "regression") return [];
    const parsedRows = rows.slice(0, 200);
    const usedFeatures = modelState.model?.featureCols || modelState.model?.usedFeatures || [];
    const { encoded } = encodeRows(parsedRows, columns, colInfo, targetCol);
    const enc2 = normaliseNumeric ? normaliseNumericInPlace(encoded, usedFeatures, colInfo) : encoded;
    const preds = enc2.map((x) => modelState.model.reg.weights.reduce((acc, wj, j) => acc + wj * x[j], modelState.model.reg.bias));
    return parsedRows.map((row, idx) => ({
      actual: Number(row[targetCol]) || 0,
      predicted: preds[idx],
    }));
  }, [modelState, taskInfo.type, rows, columns, colInfo, targetCol, normaliseNumeric]);

  const predictSingle = () => {
    if (!modelState) return;
    const { model } = modelState;
    const usedFeatures = model.featureCols || model.usedFeatures || [];
    const cats = model.cats || {};
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

  const fairnessByGroup = useMemo(() => {
    if (!modelState) return [];
    if (modelState.taskType !== "classification") return [];
    if (!sensitiveCol) return [];
    const testRows = Array.isArray(modelState.testRows) ? modelState.testRows : [];
    if (!testRows.length) return [];

    const groups = new Map();
    for (const t of testRows) {
      const g = String(t.raw?.[sensitiveCol] ?? "unknown");
      const yTrue = String(t.y);
      const positive = modelState.model?.positiveLabel;
      const y = yTrue === String(positive) ? 1 : 0;

      const z = modelState.model.clf.weights.reduce((acc, wj, j) => acc + wj * t.x[j], modelState.model.clf.bias);
      const p = sigmoid(z);
      const yPred = p >= 0.5 ? 1 : 0;

      const bucket = groups.get(g) || { group: g, yTrue: [], yPred: [], avgProb: 0, n: 0 };
      bucket.yTrue.push(y);
      bucket.yPred.push(yPred);
      bucket.avgProb += p;
      bucket.n += 1;
      groups.set(g, bucket);
    }

    return Array.from(groups.values())
      .map((b) => {
        const m = computeClassificationMetrics(b.yTrue, b.yPred);
        return {
          group: b.group,
          n: b.n,
          accuracy: m.accuracy,
          precision: m.precision,
          recall: m.recall,
          avgProb: b.avgProb / Math.max(1, b.n),
        };
      })
      .sort((a, b) => b.n - a.n)
      .slice(0, 8);
  }, [modelState, sensitiveCol]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
      {/* Navigation */}
      <div className="space-y-3">
        <StudioBreadcrumbs
          items={[
            { label: "Studios Hub", href: "/studios/hub" },
            { label: "Model Forge" }
          ]}
        />
        <StudioNavigation
          studioType="lab"
          showHome={true}
          showHub={true}
          currentStudio="Model Forge"
          currentStudioHref="/studios/model-forge"
        />
      </div>

      <div className="rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100">
          Model Forge
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">Model Forge</h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          This is where spreadsheets come to be judged. We take your tabular data, agree what you are trying to predict, and build
          small models you can actually interrogate.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/studios" className="text-sm font-semibold text-emerald-700 hover:underline">
            Back to Studios
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/courses/ai" className="text-sm font-semibold text-slate-700 hover:underline">
            Back to AI course
          </Link>
        </div>
        <nav aria-label="AI Studio navigation" className="flex flex-wrap gap-2 pt-1">
          {[
            ["Overview", "#overview"],
            ["Data preparation", "#data-prep"],
            ["Training", "#training"],
            ["Evaluation", "#evaluation"],
            ["Inference", "#inference"],
            ["Responsible AI", "#responsible-ai"],
            ["Export and next steps", "#export"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <SecurityBanner />

      <section id="overview" className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Overview</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">What this teaches</p>
            <p className="mt-2 text-sm text-slate-700">How data choices, training settings, and evaluation metrics change what a model can do.</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Real world use</p>
            <p className="mt-2 text-sm text-slate-700">A small workbench for quick baselines, sanity checks, and explaining metrics to humans.</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Compute and limits</p>
            <p className="mt-2 text-sm text-slate-700">
              Free tier supports small datasets and modest epochs. Signed-in users can use a higher tier. Limits are shown before you run.
            </p>
          </div>
        </div>
      </section>

      <section id="data-prep" className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Data preparation</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">Upload a small dataset, inspect its shape, and make deliberate choices before training.</p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-sky-300 hover:text-sky-700">
              <input type="file" className="hidden" accept=".csv,.json" onChange={(e) => handleUpload(e.target.files)} />
              Upload CSV or JSON
            </label>
            <p className="text-xs text-slate-600">
              Current file limit: {formatBytes(allowedUploadBytes)} (hard cap {formatBytes(maxAbsoluteBytes)}).
            </p>
          </div>
          {uploadError ? (
            <p className="text-sm font-semibold text-rose-700" role="alert" aria-live="polite">
              {uploadError}
            </p>
          ) : null}
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
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{dataset.name}</p>
              <p className="text-xs text-slate-700">
                {dataset.rowCount ?? rows.length} rows • {dataset.columnCount ?? columns.length} columns
              </p>
              <p className="text-xs text-slate-700">Size: {formatBytes(dataset.sizeBytes || 0)}</p>
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

      <section id="training" className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Model training</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">Pick a target, choose a simple model, tune parameters, and train with predictable limits.</p>
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

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Training split</p>
            <input type="range" min={0.5} max={0.9} step={0.05} value={split} onChange={(e) => setSplit(Number(e.target.value))} className="w-full" />
            <p className="text-xs text-slate-700">Train fraction: {split.toFixed(2)}</p>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Normalisation</p>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={normaliseNumeric} onChange={(e) => setNormaliseNumeric(e.target.checked)} />
              Min-max scale numeric features
            </label>
            <p className="text-xs text-slate-600">Normalisation can stabilise training when columns have very different ranges.</p>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Parameters</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-slate-900">
                Epochs (max {maxAllowedEpochs})
                <input
                  type="number"
                  value={epochs}
                  onChange={(e) => setEpochs(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </label>
              <label className="text-xs font-semibold text-slate-900">
                Learning rate
                <input
                  type="number"
                  value={learningRate}
                  step={0.005}
                  onChange={(e) => setLearningRate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </label>
            </div>
            <p className="text-xs text-slate-600">More epochs and higher learning rates can improve or destabilise learning.</p>
          </div>
        </div>
      </section>

      <section id="evaluation" className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Evaluation</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Evaluate on a holdout set. Watch for overfitting: great train metrics and weak test metrics.
            </p>
          </div>
          <button
            onClick={handleTrain}
            disabled={training || runner.loading || !dataset || !targetCol}
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {training || runner.loading ? "Training..." : "Train model"}
          </button>
        </div>

        <div className="space-y-3">
          <ComputeEstimatePanel estimate={runner.compute.pre || runner.compute.live} />
          <ComputeSummaryPanel toolId="model-forge-train" summary={runner.compute.post} />
          {runner.errorMessage ? (
            <p className="text-sm font-semibold text-rose-700" role="alert" aria-live="polite">
              {runner.errorMessage}
            </p>
          ) : null}
        </div>

        {trainError && <p className="text-xs text-amber-700">{trainError}</p>}

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
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">Fast, simple baseline. Good for linearly separable signals.</p>
              </button>
              <button
                onClick={() => setAlgorithm("rf")}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  algorithm === "rf" ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200" : "border-slate-200 bg-slate-50/60"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">Tree ensemble</p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">Handles non-linear patterns. This demo reuses a light trainer.</p>
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
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">Captures non-linearities. Demo uses light-weight trainer.</p>
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

        {modelState && taskInfo.type === "classification" && modelState.metrics?.test && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-900">Confusion matrix</p>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-emerald-50 px-2 py-2">
                  <p className="text-slate-500">TP</p>
                  <p className="text-sm font-semibold text-emerald-700">{modelState.metrics.test.tp}</p>
                </div>
                <div className="rounded-xl bg-amber-50 px-2 py-2">
                  <p className="text-slate-500">FP</p>
                  <p className="text-sm font-semibold text-amber-700">{modelState.metrics.test.fp}</p>
                </div>
                <div className="rounded-xl bg-rose-50 px-2 py-2">
                  <p className="text-slate-500">FN</p>
                  <p className="text-sm font-semibold text-rose-700">{modelState.metrics.test.fn}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-2">
                  <p className="text-slate-500">TN</p>
                  <p className="text-sm font-semibold text-slate-700">{modelState.metrics.test.tn}</p>
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

        {modelState && taskInfo.type === "regression" && modelState.metrics?.test && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-1 text-sm text-slate-800">
              <p className="text-xs font-semibold text-slate-900 mb-1">Error metrics</p>
              <p>Test MAE: {modelState.metrics.test.mae.toFixed(3)}</p>
              <p>Test RMSE: {modelState.metrics.test.rmse.toFixed(3)}</p>
              <p>Test R²: {modelState.metrics.test.r2.toFixed(3)}</p>
              <p className="mt-2 text-xs text-slate-600">
                Overfitting hint: if train RMSE is far lower than test RMSE, the model is memorising.
              </p>
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
        <section id="inference" className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Inference playground</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Generated inputs from your feature columns. Predictions happen in your browser. Use this for intuition, not production
            decisions.
          </p>

          {runHistory.length > 1 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-sm font-semibold text-slate-900">Compare recent runs</p>
              <p className="mt-1 text-xs text-slate-600">Different training settings can change performance. Pick one run to use for inference.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {runHistory.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setModelState(r)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                      r.id === modelState.id ? "border-sky-300 bg-sky-50 text-sky-900" : "border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    {new Date(r.trainedAt).toLocaleTimeString()} ({r.algorithm})
                  </button>
                ))}
              </div>
            </div>
          ) : null}
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

      {modelState ? (
        <section id="responsible-ai" className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Responsible AI and limitations</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            This is not compliance theatre. It is a way to build the habit of checking how a model behaves across groups, and noticing quiet failures.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Group check (holdout set)</p>
              <label className="text-xs font-semibold text-slate-900">
                Group column
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={sensitiveCol}
                  onChange={(e) => setSensitiveCol(e.target.value)}
                >
                  <option value="">None</option>
                  {columns
                    .filter((c) => c !== targetCol)
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </label>
              <p className="text-xs text-slate-600">
                This shows basic differences by group. It does not prove fairness, and it does not replace a proper domain review.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Common pitfalls</p>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>Different base rates can make metrics look better or worse without any change in harm.</li>
                <li>Small groups produce noisy metrics. Treat tiny samples as a warning, not evidence.</li>
                <li>Choosing the wrong target can encode policy decisions as if they were facts.</li>
              </ul>
            </div>
          </div>

          {fairnessByGroup.length ? (
            <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm text-slate-800">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Group</th>
                    <th className="px-3 py-2 text-left font-semibold">N</th>
                    <th className="px-3 py-2 text-left font-semibold">Accuracy</th>
                    <th className="px-3 py-2 text-left font-semibold">Precision</th>
                    <th className="px-3 py-2 text-left font-semibold">Recall</th>
                    <th className="px-3 py-2 text-left font-semibold">Avg probability</th>
                  </tr>
                </thead>
                <tbody>
                  {fairnessByGroup.map((r) => (
                    <tr key={r.group} className="border-t border-slate-100">
                      <td className="px-3 py-2">{r.group}</td>
                      <td className="px-3 py-2">{r.n}</td>
                      <td className="px-3 py-2">{r.accuracy.toFixed(3)}</td>
                      <td className="px-3 py-2">{r.precision.toFixed(3)}</td>
                      <td className="px-3 py-2">{r.recall.toFixed(3)}</td>
                      <td className="px-3 py-2">{r.avgProb.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">Train a classification model and choose a group column to see a simple breakdown.</p>
          )}
        </section>
      ) : null}

      <section id="export" className="rounded-3xl bg-white p-4 sm:p-6 md:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Export and next steps</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">Export</p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Export a small JSON summary of your run for notes, review, or a model card draft. This is not a deployment artifact.
            </p>
            <button
              type="button"
              disabled={!modelState}
              onClick={() => downloadJson("model-forge-run.json", modelState)}
              className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Download run summary
            </button>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">What to do next in real work</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Define success with stakeholders before you pick a metric.</li>
              <li>Confirm data lineage and label quality.</li>
              <li>Run a bias review with domain experts, not only with dashboards.</li>
              <li>Document limitations and decide when not to use the model.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
