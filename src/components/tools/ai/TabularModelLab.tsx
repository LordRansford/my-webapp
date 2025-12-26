"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Brain, UploadCloud } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import Papa from "papaparse";
import { validateUpload } from "@/utils/validateUpload";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AiToolCard } from "./AiToolCard";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

type ParsedRow = Record<string, string | number | null>;

type ParsedData = {
  columns: string[];
  rows: ParsedRow[];
};

type TrainingHistoryPoint = {
  epoch: number;
  loss: number;
  metric: number;
};

type ProblemType = "classification" | "regression";

type ModelState =
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "training"; epoch: number; totalEpochs: number }
  | { status: "trained"; problemType: ProblemType; summary: string }
  | { status: "error"; message: string };

function detectColumns(rows: ParsedRow[]): string[] {
  if (!rows.length) return [];
  const first = rows[0];
  return Object.keys(first);
}

function normaliseNumeric(
  rows: ParsedRow[],
  featureColumns: string[]
): { normRows: ParsedRow[]; means: Record<string, number>; stds: Record<string, number> } {
  const means: Record<string, number> = {};
  const stds: Record<string, number> = {};
  const normRows: ParsedRow[] = rows.map((row) => ({ ...row }));

  featureColumns.forEach((col) => {
    const nums = rows.map((r) => r[col]).filter((v): v is number => typeof v === "number");

    if (!nums.length) {
      means[col] = 0;
      stds[col] = 1;
      return;
    }

    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const variance = nums.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / Math.max(1, nums.length - 1);
    const std = Math.sqrt(variance || 1);

    means[col] = mean;
    stds[col] = std;

    normRows.forEach((r) => {
      const raw = r[col];
      if (typeof raw === "number") {
        (r as any)[col] = (raw - mean) / std;
      }
    });
  });

  return { normRows, means, stds };
}

function splitDataset<T>(rows: T[], trainRatio: number, valRatio: number) {
  const shuffled = [...rows];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const trainSize = Math.floor(shuffled.length * trainRatio);
  const valSize = Math.floor(shuffled.length * valRatio);

  const train = shuffled.slice(0, trainSize);
  const val = shuffled.slice(trainSize, trainSize + valSize);
  const test = shuffled.slice(trainSize + valSize);

  return { train, val, test };
}

function createFeatureTensor(rows: ParsedRow[], featureColumns: string[]): tf.Tensor2D {
  const data = rows.map((row) =>
    featureColumns.map((col) => {
      const v = row[col];
      if (typeof v === "number") return v;
      if (v === null || v === undefined) return 0;
      const trimmed = String(v).trim();
      if (trimmed === "") return 0;
      const num = Number(trimmed);
      return Number.isFinite(num) ? num : 0;
    })
  );
  return tf.tensor2d(data);
}

function encodeLabels(rows: ParsedRow[], targetColumn: string): { labelsTensor: tf.Tensor1D; classes: string[] } {
  const rawValues = rows.map((r) => r[targetColumn]);
  const classSet = Array.from(
    new Set(
      rawValues.map((v) => (v === null || v === undefined ? "null" : String(v)))
    )
  );
  const indexByClass = new Map<string, number>();
  classSet.forEach((c, idx) => indexByClass.set(c, idx));

  const encoded = rawValues.map((v) => {
    const key = v === null || v === undefined ? "null" : String(v);
    return indexByClass.get(key) ?? 0;
  });

  return {
    labelsTensor: tf.tensor1d(encoded, "int32"),
    classes: classSet,
  };
}

export function TabularModelLab() {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7243/ingest/5c42012f-fdd0-45fd-8860-75c06576ec81',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TabularModelLab.tsx:render',message:'Component rendering',data:{hasWindow:typeof window !== 'undefined',hasTf:typeof tf !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
  }
  // #endregion
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [featureColumns, setFeatureColumns] = useState<string[]>([]);
  const [problemType, setProblemType] = useState<ProblemType>("classification");
  const [trainRatio, setTrainRatio] = useState(0.7);
  const [valRatio, setValRatio] = useState(0.15);
  const [modelState, setModelState] = useState<ModelState>({ status: "idle" });
  const [history, setHistory] = useState<TrainingHistoryPoint[]>([]);
  const [metricName, setMetricName] = useState<string>("accuracy");
  const [evalSummary, setEvalSummary] = useState<string>("");
  const [trainedModel, setTrainedModel] = useState<tf.LayersModel | null>(null);
  const [classNames, setClassNames] = useState<string[] | null>(null);
  const [predictionInput, setPredictionInput] = useState<Record<string, string>>({});
  const [predictionOutput, setPredictionOutput] = useState<string>("");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { safeFiles, errors } = validateUpload(e.target.files, { maxBytes: 8 * 1024 * 1024, allowedExtensions: [".csv"] });
    if (errors.length) alert(errors.join("\n"));
    const file = safeFiles[0];
    if (!file) return;

    setModelState({ status: "preparing" });
    setHistory([]);
    setEvalSummary("");
    setTrainedModel(null);
    setClassNames(null);
    setPredictionInput({});
    setPredictionOutput("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as ParsedRow[];
        if (!rows || rows.length === 0) {
          setModelState({
            status: "error",
            message: "The CSV file appears to be empty or malformed.",
          });
          return;
        }
        const columns = detectColumns(rows);
        if (!columns.length) {
          setModelState({
            status: "error",
            message: "Could not detect any columns in the CSV file.",
          });
          return;
        }
        setParsedData({ columns, rows });
        setTargetColumn(columns[columns.length - 1]);
        setFeatureColumns(columns.slice(0, -1));
        setModelState({ status: "idle" });
      },
      error: (err) => {
        setModelState({
          status: "error",
          message: `Failed to parse CSV: ${err.message}`,
        });
      },
    });
  }, []);

  const canTrain = useMemo(
    () =>
      parsedData &&
      targetColumn &&
      featureColumns.length > 0 &&
      trainRatio > 0 &&
      valRatio >= 0 &&
      trainRatio + valRatio < 1,
    [parsedData, targetColumn, featureColumns, trainRatio, valRatio]
  );

  const handleTrain = useCallback(async () => {
    if (!parsedData || !canTrain) return;

    try {
      setModelState({ status: "training", epoch: 0, totalEpochs: 30 });
      setHistory([]);
      setEvalSummary("");
      setPredictionOutput("");

      const rows = parsedData.rows;
      const { normRows } = normaliseNumeric(rows, featureColumns);
      const all = normRows.map((r) => ({ ...r }));

      const featureTensorAll = createFeatureTensor(all, featureColumns);

      let labelsTensor: tf.Tensor1D;
      let classes: string[] | null = null;

      if (problemType === "classification") {
        const encoded = encodeLabels(all, targetColumn);
        labelsTensor = encoded.labelsTensor;
        classes = encoded.classes;
        setMetricName("accuracy");
        setClassNames(encoded.classes);
      } else {
        const vals = all.map((r) => r[targetColumn]);
        const numeric = vals.map((v) => {
          if (typeof v === "number") return v;
          if (v === null || v === undefined) return 0;
          const num = Number(String(v).trim());
          return Number.isFinite(num) ? num : 0;
        });
        labelsTensor = tf.tensor1d(numeric, "float32");
        setMetricName("meanSquaredError");
        setClassNames(null);
      }

      const combined: { x: number[]; y: number }[] = [];
      const xs = featureTensorAll.arraySync() as number[][];
      const ys = labelsTensor.arraySync() as number[];

      for (let i = 0; i < xs.length; i += 1) {
        combined.push({ x: xs[i], y: ys[i] });
      }

      const { train, val, test } = splitDataset(combined, trainRatio, valRatio);

      if (train.length < featureColumns.length + 1) {
        setModelState({
          status: "error",
          message: "Training set is too small after splitting. Increase train ratio or provide more rows.",
        });
        featureTensorAll.dispose();
        labelsTensor.dispose();
        return;
      }

      const makeFeatureTensorFrom = (subset: typeof combined) => tf.tensor2d(subset.map((r) => r.x));
      const makeLabelTensorFrom = (subset: typeof combined) =>
        tf.tensor1d(
          subset.map((r) => r.y),
          problemType === "classification" ? "int32" : "float32"
        );

      const xTrain = makeFeatureTensorFrom(train);
      const yTrain = makeLabelTensorFrom(train);
      const xVal = makeFeatureTensorFrom(val);
      const yVal = makeLabelTensorFrom(val);
      const xTest = makeFeatureTensorFrom(test);
      const yTest = makeLabelTensorFrom(test);

      const numFeatures = featureColumns.length;

      const model = tf.sequential();

      model.add(
        tf.layers.dense({
          inputShape: [numFeatures],
          units: 16,
          activation: "relu",
        })
      );
      model.add(
        tf.layers.dense({
          units: 8,
          activation: "relu",
        })
      );

      if (problemType === "classification") {
        const numClasses = classes ? classes.length : 2;
        model.add(
          tf.layers.dense({
            units: numClasses,
            activation: "softmax",
          })
        );
        model.compile({
          optimizer: tf.train.adam(0.01),
          loss: "sparseCategoricalCrossentropy",
          metrics: ["accuracy"],
        });
      } else {
        model.add(
          tf.layers.dense({
            units: 1,
            activation: "linear",
          })
        );
        model.compile({
          optimizer: tf.train.adam(0.01),
          loss: "meanSquaredError",
          metrics: ["meanSquaredError"],
        });
      }

      const epochs = 30;
      const batchSize = Math.max(8, Math.floor(train.length / 10));
      const newHistory: TrainingHistoryPoint[] = [];

      await model.fit(xTrain, yTrain, {
        epochs,
        batchSize,
        validationData: [xVal, yVal],
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const loss = logs?.loss ?? 0;
            const metric =
              problemType === "classification"
                ? logs?.acc ?? logs?.accuracy ?? 0
                : logs?.meanSquaredError ?? 0;

            newHistory.push({
              epoch: epoch + 1,
              loss,
              metric: metric as number,
            });
            setHistory([...newHistory]);
            setModelState({
              status: "training",
              epoch: epoch + 1,
              totalEpochs: epochs,
            });
          },
        },
      });

      const evalLogs = model.evaluate(xTest, yTest) as tf.Scalar | tf.Scalar[];

      let lossTest = 0;
      let metricTest = 0;

      if (Array.isArray(evalLogs)) {
        lossTest = (evalLogs[0].arraySync() as number) ?? 0;
        metricTest = (evalLogs[1].arraySync() as number) ?? 0;
        evalLogs.forEach((t) => t.dispose());
      } else {
        lossTest = (evalLogs.arraySync() as number) ?? 0;
        evalLogs.dispose();
      }

      const summaryParts: string[] = [];
      summaryParts.push(`Training rows: ${train.length}, validation rows: ${val.length}, test rows: ${test.length}.`);
      summaryParts.push(`Final test loss: ${lossTest.toFixed(4)}.`);
      if (problemType === "classification") {
        summaryParts.push(`Approximate test accuracy: ${metricTest.toFixed(4)}.`);
      } else {
        summaryParts.push(`Approximate test mean squared error: ${metricTest.toFixed(4)}.`);
      }

      setEvalSummary(summaryParts.join(" "));

      xTrain.dispose();
      yTrain.dispose();
      xVal.dispose();
      yVal.dispose();
      xTest.dispose();
      yTest.dispose();
      featureTensorAll.dispose();
      labelsTensor.dispose();

      setTrainedModel(model);
      setModelState({
        status: "trained",
        problemType,
        summary: summaryParts.join(" "),
      });
    } catch (err: any) {
      setModelState({
        status: "error",
        message: "Something went wrong during training. Try a smaller dataset or adjust the splits.",
      });
    }
  }, [parsedData, canTrain, featureColumns, targetColumn, trainRatio, valRatio, problemType]);

  const learningCurve = useMemo(
    () =>
      history.map((h) => ({
        epoch: h.epoch,
        loss: h.loss,
        metric: h.metric,
      })),
    [history]
  );

  const handlePredictionInputChange = useCallback((col: string, value: string) => {
    setPredictionInput((prev) => ({ ...prev, [col]: value }));
  }, []);

  const handlePredict = useCallback(async () => {
    if (!trainedModel || !parsedData) {
      setPredictionOutput("Train a model first and upload a dataset before trying predictions.");
      return;
    }

    try {
      const row: ParsedRow = {};
      featureColumns.forEach((col) => {
        const raw = predictionInput[col];
        const num = Number(raw);
        if (!raw) {
          row[col] = 0;
        } else if (isNaN(num)) {
          row[col] = 0;
        } else {
          row[col] = num;
        }
      });

      const x = createFeatureTensor([row], featureColumns);
      const pred = trainedModel.predict(x) as tf.Tensor;
      const arr = (await pred.array()) as any;

      if (problemType === "classification" && classNames) {
        const probs: number[] = arr[0];
        let bestIdx = 0;
        let bestScore = probs[0] ?? 0;
        for (let i = 1; i < probs.length; i += 1) {
          if (probs[i] > bestScore) {
            bestScore = probs[i];
            bestIdx = i;
          }
        }
        const label = classNames[bestIdx] ?? "(unknown)";
        setPredictionOutput(`Predicted class: ${label} with probability ${bestScore.toFixed(3)}.`);
      } else {
        const value = Array.isArray(arr[0]) ? arr[0][0] : arr[0];
        setPredictionOutput(`Predicted numeric value: ${Number(value).toFixed(4)}.`);
      }

      x.dispose();
      pred.dispose();
    } catch (err: any) {
      setPredictionOutput("Could not compute prediction for this input. Check your values and try again.");
    }
  }, [trainedModel, parsedData, predictionInput, featureColumns, problemType, classNames]);

  const statusText = useMemo(() => {
    if (modelState.status === "idle") {
      return "Ready to train. Upload a CSV and choose target and features.";
    }
    if (modelState.status === "preparing") {
      return "Parsing CSV and preparing data.";
    }
    if (modelState.status === "training") {
      return `Training epoch ${modelState.epoch} of ${modelState.totalEpochs}.`;
    }
    if (modelState.status === "trained") {
      return "Training complete. Review metrics and try a prediction.";
    }
    if (modelState.status === "error") {
      return `Error: ${modelState.message}`;
    }
    return "";
  }, [modelState]);

  const currentColumns = parsedData?.columns ?? [];

  return (
    <AiToolCard
      id="tabular-model-lab-title"
      title="Tabular model builder and evaluator"
      icon={<Brain className="h-4 w-4" aria-hidden="true" />}
      description="Upload a CSV, pick a target column and features, train a small model in your browser and inspect its performance."
    >
      <SecurityBanner />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 lg:col-span-1">
          <div className="space-y-2">
            <label htmlFor="csv-upload" className="block text-xs font-semibold text-slate-700">
              Upload CSV file
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="csv-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
              >
                <UploadCloud className="h-4 w-4" aria-hidden="true" />
                <span>Choose file</span>
              </label>
              <input id="csv-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              <span className="text-sm text-slate-500">CSV only, max 8MB. Data stays in your browser.</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Problem type</p>
            <div className="inline-flex rounded-full bg-white p-0.5 ring-1 ring-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setProblemType("classification")}
                className={`px-3 py-1.5 rounded-full ${
                  problemType === "classification" ? "bg-slate-900 text-white" : "text-slate-600"
                }`}
              >
                Classification
              </button>
              <button
                type="button"
                onClick={() => setProblemType("regression")}
                className={`px-3 py-1.5 rounded-full ${
                  problemType === "regression" ? "bg-slate-900 text-white" : "text-slate-600"
                }`}
              >
                Regression
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Classification predicts labels, regression predicts continuous numeric values. If you are unsure, classification
              usually applies to categories like Yes or No and regression to quantities like price.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="target-column" className="block text-xs font-semibold text-slate-700">
              Target column
            </label>
            <select
              id="target-column"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="">Select target</option>
              {currentColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Feature columns</p>
            <div className="flex flex-wrap gap-1.5">
              {currentColumns.map((col) => {
                const isTarget = col === targetColumn;
                const selected = featureColumns.includes(col);
                return (
                  <button
                    key={col}
                    type="button"
                    disabled={isTarget}
                    onClick={() => {
                      setFeatureColumns((prev) => (selected ? prev.filter((c) => c !== col) : [...prev, col]));
                    }}
                    className={`rounded-full border px-2 py-0.5 text-sm ${
                      isTarget
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : selected
                        ? "border-sky-500 bg-sky-50 text-sky-800"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-slate-500">Click to toggle features. The target column is excluded automatically.</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Data split ratios</p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Train</span>
              <input
                type="number"
                min={0.5}
                max={0.9}
                step={0.05}
                value={trainRatio}
                onChange={(e) => setTrainRatio(Number(e.target.value))}
                className="w-14 rounded-2xl border border-slate-200 bg-white px-1.5 py-0.5 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200"
              />
              <span>Validation</span>
              <input
                type="number"
                min={0.05}
                max={0.4}
                step={0.05}
                value={valRatio}
                onChange={(e) => setValRatio(Number(e.target.value))}
                className="w-14 rounded-2xl border border-slate-200 bg-white px-1.5 py-0.5 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200"
              />
              <span>Test auto set to {Math.max(0, 1 - trainRatio - valRatio).toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTrain}
            disabled={!canTrain || modelState.status === "training"}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {modelState.status === "training" ? "Training..." : "Train model"}
          </button>

          <p className="text-sm text-slate-500">{statusText}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 lg:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Training progress</p>
          <div className="h-48 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            {learningCurve.length === 0 ? (
              <p className="text-sm text-slate-500">The learning curve will appear here once training begins.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={learningCurve}>
                  <XAxis
                    dataKey="epoch"
                    tick={{ fontSize: 10 }}
                    label={{ value: "Epoch", position: "insideBottom", offset: -4, fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    label={{
                      value: metricName === "accuracy" ? "Loss and accuracy" : "Loss and error",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 10,
                    }}
                  />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                  <Line type="monotone" dataKey="loss" stroke="#94a3b8" strokeWidth={1.6} dot={false} name="Loss" />
                  <Line
                    type="monotone"
                    dataKey="metric"
                    stroke="#0f766e"
                    strokeWidth={1.6}
                    dot={false}
                    name={metricName}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Evaluation summary</p>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[64px]">
              {evalSummary || "Metrics will appear here once the model is trained."}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 lg:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Try a prediction</p>
          <div className="space-y-2">
            {featureColumns.length === 0 ? (
              <p className="text-sm text-slate-500">
                After training, you can enter feature values here to see how your model responds.
              </p>
            ) : (
              <>
                {featureColumns.map((col) => (
                  <div key={col} className="space-y-1">
                    <label htmlFor={`pred-${col}`} className="block text-sm font-medium text-slate-700">
                      {col}
                    </label>
                    <input
                      id={`pred-${col}`}
                      type="text"
                      value={predictionInput[col] ?? ""}
                      onChange={(e) => handlePredictionInputChange(col, e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200"
                      placeholder="Enter a numeric value"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handlePredict}
                  disabled={!trainedModel}
                  className="mt-1 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Predict
                </button>
              </>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700">Prediction output</p>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[48px]">
              {predictionOutput || "Your prediction result will appear here."}
            </div>
            <p className="text-sm text-slate-500">
              This is not a production grade model. It is an educational lab to help you see how data, model choices and
              metrics connect.
            </p>
          </div>
        </div>
      </div>
    </AiToolCard>
  );
}
