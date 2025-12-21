"use client";

import React, { useCallback, useMemo, useState } from "react";
import { MessageSquareText, UploadCloud } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import Papa from "papaparse";
import { validateUpload } from "@/utils/validateUpload";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AiToolCard } from "./AiToolCard";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

type TextRow = {
  [key: string]: string | number | null;
};

type ParsedTextData = {
  columns: string[];
  rows: TextRow[];
};

type TrainingHistoryPoint = {
  epoch: number;
  loss: number;
  accuracy: number;
};

type ModelState =
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "training"; epoch: number; totalEpochs: number }
  | { status: "trained"; summary: string }
  | { status: "error"; message: string };

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "am",
  "this",
  "that",
  "it",
  "as",
  "by",
  "at",
  "with",
  "from",
]);

function simpleTokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function buildVocabulary(texts: string[], maxVocabSize: number): { vocab: Map<string, number>; indexToToken: string[] } {
  const freq = new Map<string, number>();
  for (const text of texts) {
    const tokens = simpleTokenise(text);
    for (const t of tokens) {
      freq.set(t, (freq.get(t) ?? 0) + 1);
    }
  }

  const sorted = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxVocabSize - 2);

  const vocab = new Map<string, number>();
  const indexToToken: string[] = [];

  vocab.set("<pad>", 0);
  indexToToken.push("<pad>");
  vocab.set("<unk>", 1);
  indexToToken.push("<unk>");

  let index = 2;
  for (const [token] of sorted) {
    vocab.set(token, index);
    indexToToken.push(token);
    index += 1;
  }

  return { vocab, indexToToken };
}

function encodeTextToVector(text: string, vocab: Map<string, number>): number[] {
  const tokens = simpleTokenise(text);
  const vec = new Array(vocab.size).fill(0);
  for (const t of tokens) {
    const idx = vocab.get(t) ?? vocab.get("<unk>") ?? 1;
    vec[idx] += 1;
  }
  return vec;
}

function encodeLabels(labels: string[]): { encoded: number[]; classes: string[] } {
  const classSet = Array.from(new Set(labels));
  const indexByClass = new Map<string, number>();
  classSet.forEach((c, idx) => indexByClass.set(c, idx));
  const encoded = labels.map((lab) => indexByClass.get(lab) ?? 0);
  return { encoded, classes: classSet };
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

export function TextClassifierLab() {
  const [parsedData, setParsedData] = useState<ParsedTextData | null>(null);
  const [textColumn, setTextColumn] = useState<string>("");
  const [labelColumn, setLabelColumn] = useState<string>("");
  const [trainRatio, setTrainRatio] = useState(0.7);
  const [valRatio, setValRatio] = useState(0.15);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [modelState, setModelState] = useState<ModelState>({ status: "idle" });
  const [history, setHistory] = useState<TrainingHistoryPoint[]>([]);
  const [evalSummary, setEvalSummary] = useState<string>("");
  const [trainedModel, setTrainedModel] = useState<tf.LayersModel | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [vocab, setVocab] = useState<Map<string, number> | null>(null);

  const [predictionText, setPredictionText] = useState<string>("");
  const [predictionOutput, setPredictionOutput] = useState<string>("");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { safeFiles, errors } = validateUpload(e.target.files, { maxBytes: 8 * 1024 * 1024, allowedExtensions: [".csv"] });
    if (errors.length) {
      setModelState({ status: "error", message: errors.join(" ") });
      return;
    }
    const file = safeFiles[0];
    if (!file) return;

    setModelState({ status: "preparing" });
    setHistory([]);
    setEvalSummary("");
    setTrainedModel(null);
    setClasses([]);
    setVocab(null);
    setPredictionText("");
    setPredictionOutput("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as TextRow[];
        if (!rows || rows.length === 0) {
          setModelState({
            status: "error",
            message: "The CSV file appears to be empty or malformed.",
          });
          return;
        }
        const first = rows[0];
        const columns = Object.keys(first);
        if (!columns.length) {
          setModelState({
            status: "error",
            message: "Could not detect any columns in the CSV file.",
          });
          return;
        }
        setParsedData({ columns, rows });
        setTextColumn(columns[0]);
        setLabelColumn(columns[columns.length - 1]);
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
    () => parsedData && textColumn && labelColumn && trainRatio > 0 && valRatio >= 0 && trainRatio + valRatio < 1,
    [parsedData, textColumn, labelColumn, trainRatio, valRatio]
  );

  const handleTrain = useCallback(async () => {
    if (!parsedData || !canTrain) return;

    try {
      setModelState({ status: "training", epoch: 0, totalEpochs: 25 });
      setHistory([]);
      setEvalSummary("");
      setPredictionOutput("");

      const rows = parsedData.rows;
      const texts: string[] = [];
      const labelsRaw: string[] = [];

      for (const row of rows) {
        const t = row[textColumn];
        const l = row[labelColumn];
        const textValue = t === null || t === undefined ? "" : String(t).trim();
        const labelValue = l === null || l === undefined ? "" : String(l).trim();
        if (textValue.length === 0 || labelValue.length === 0) continue;
        texts.push(textValue);
        labelsRaw.push(labelValue);
      }

      if (texts.length < 8) {
        setModelState({
          status: "error",
          message: "There are not enough non empty text and label rows to train. Try a richer dataset.",
        });
        return;
      }

      const maxVocabSize = 2000;
      const { vocab: vocabMap } = buildVocabulary(texts, maxVocabSize);
      setVocab(vocabMap);

      const vectors: number[][] = texts.map((text) => encodeTextToVector(text, vocabMap));
      const { encoded, classes } = encodeLabels(labelsRaw);
      setClasses(classes);

      const combined = vectors.map((vec, idx) => ({
        x: vec,
        y: encoded[idx],
      }));

      const { train, val, test } = splitDataset(combined, trainRatio, valRatio);

      if (train.length < classes.length * 2) {
        setModelState({
          status: "error",
          message: "Training set is too small after splitting. Increase train ratio or add more rows.",
        });
        return;
      }

      const makeFeatureTensorFrom = (subset: typeof combined) => tf.tensor2d(subset.map((r) => r.x));
      const makeLabelTensorFrom = (subset: typeof combined) => tf.tensor1d(subset.map((r) => r.y), "int32");

      const xTrain = makeFeatureTensorFrom(train);
      const yTrain = makeLabelTensorFrom(train);
      const xVal = makeFeatureTensorFrom(val);
      const yVal = makeLabelTensorFrom(val);
      const xTest = makeFeatureTensorFrom(test);
      const yTest = makeLabelTensorFrom(test);

      const inputDim = vectors[0].length;
      const numClasses = classes.length;

      const model = tf.sequential();
      model.add(
        tf.layers.dense({
          inputShape: [inputDim],
          units: 64,
          activation: "relu",
        })
      );
      model.add(tf.layers.dropout({ rate: 0.2 }));
      model.add(
        tf.layers.dense({
          units: 32,
          activation: "relu",
        })
      );
      model.add(
        tf.layers.dense({
          units: numClasses,
          activation: "softmax",
        })
      );

      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "sparseCategoricalCrossentropy",
        metrics: ["accuracy"],
      });

      const epochs = 25;
      const batchSize = Math.max(8, Math.floor(train.length / 10));
      const newHistory: TrainingHistoryPoint[] = [];

      await model.fit(xTrain, yTrain, {
        epochs,
        batchSize,
        validationData: [xVal, yVal],
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const loss = logs?.loss ?? 0;
            const accuracy = logs?.acc ?? logs?.accuracy ?? 0;
            newHistory.push({
              epoch: epoch + 1,
              loss,
              accuracy: accuracy as number,
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

      const evalLogs = model.evaluate(xTest, yTest) as tf.Scalar[] | tf.Scalar;
      let lossTest = 0;
      let accTest = 0;

      if (Array.isArray(evalLogs)) {
        lossTest = (evalLogs[0].arraySync() as number) ?? 0;
        accTest = (evalLogs[1].arraySync() as number) ?? 0;
        evalLogs.forEach((t) => t.dispose());
      } else {
        lossTest = (evalLogs.arraySync() as number) ?? 0;
        evalLogs.dispose();
      }

      const summary = [
        `Training samples: ${train.length}, validation samples: ${val.length}, test samples: ${test.length}.`,
        `Final test loss: ${lossTest.toFixed(4)}.`,
        `Approximate test accuracy: ${accTest.toFixed(4)}.`,
        `Classes learned: ${classes.join(", ")}.`,
      ].join(" ");

      setEvalSummary(summary);

      xTrain.dispose();
      yTrain.dispose();
      xVal.dispose();
      yVal.dispose();
      xTest.dispose();
      yTest.dispose();

      setTrainedModel(model);
      setModelState({
        status: "trained",
        summary,
      });
    } catch (err: any) {
      setModelState({
        status: "error",
        message: "Something went wrong during training. Try a smaller dataset or adjust your columns.",
      });
    }
  }, [parsedData, canTrain, textColumn, labelColumn, trainRatio, valRatio]);

  const learningCurve = useMemo(
    () =>
      history.map((h) => ({
        epoch: h.epoch,
        loss: h.loss,
        accuracy: h.accuracy,
      })),
    [history]
  );

  const statusText = useMemo(() => {
    if (modelState.status === "idle") return "Ready. Upload a CSV with a text column and a label column.";
    if (modelState.status === "preparing") return "Parsing CSV and preparing texts.";
    if (modelState.status === "training") return `Training epoch ${modelState.epoch} of ${modelState.totalEpochs}.`;
    if (modelState.status === "trained") return "Training complete. Try new text and explore the predictions.";
    if (modelState.status === "error") return `Error: ${modelState.message}`;
    return "";
  }, [modelState]);

  const handlePredict = useCallback(async () => {
    if (!trainedModel || !vocab || classes.length === 0) {
      setPredictionOutput("Train the classifier and upload a dataset before trying predictions.");
      return;
    }
    if (!predictionText.trim()) {
      setPredictionOutput("Type a short text example first.");
      return;
    }

    try {
      const vector = encodeTextToVector(predictionText, vocab);
      const x = tf.tensor2d([vector]);
      const pred = (await trainedModel.predict(x)) as tf.Tensor;
      const probs = (await pred.array()) as number[][];
      const row = probs[0];

      if (!row || row.length === 0) {
        setPredictionOutput("Could not compute a prediction for this text.");
        x.dispose();
        pred.dispose();
        return;
      }

      let bestIdx = 0;
      let bestScore = row[0];
      for (let i = 1; i < row.length; i += 1) {
        if (row[i] > bestScore) {
          bestScore = row[i];
          bestIdx = i;
        }
      }

      const label = classes[bestIdx] ?? "(unknown)";
      const topProbs = row
        .map((p, idx) => ({ label: classes[idx], p }))
        .sort((a, b) => b.p - a.p)
        .slice(0, 3);

      const explanationLines = [
        `Predicted label: ${label} (confidence ${bestScore.toFixed(3)}).`,
        "Top classes:",
        ...topProbs.map((tp) => `• ${tp.label}: ${tp.p.toFixed(3)}`),
      ];

      setPredictionOutput(explanationLines.join("\n"));

      x.dispose();
      pred.dispose();
    } catch (err: any) {
      setPredictionOutput("Could not compute a prediction for this text. Try a shorter example.");
    }
  }, [trainedModel, vocab, classes, predictionText]);

  const currentColumns = parsedData?.columns ?? [];

  return (
    <AiToolCard
      id="text-classifier-lab-title"
      title="Text classification playground"
      icon={<MessageSquareText className="h-4 w-4" aria-hidden="true" />}
      description="Upload a CSV with text and labels, train a classifier in your browser and test how it behaves on new examples."
      whatThisTellsYou={[
        "How a simple bag-of-words text model behaves when you change the dataset, label balance, and split ratios.",
        "Whether your labels are learnable from the text or whether you need better features or cleaner labeling.",
      ]}
      interpretationTips={[
        "Accuracy can look good on imbalanced labels. Check whether minority classes get learned.",
        "Use the prediction probabilities as a hint, not as certainty. Low confidence often means the model has not seen enough examples.",
      ]}
      limitations={[
        "This is a small, in-browser model for learning. It is not a production classifier and it is not robust to adversarial inputs.",
        "Random shuffling means results can vary slightly between runs. For reproducible benchmarking, fix a seed in a real training pipeline.",
      ]}
    >
      <SecurityBanner />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 lg:col-span-1">
          <div className="space-y-2">
            <label htmlFor="text-csv-upload" className="block text-xs font-semibold text-slate-700">
              Upload CSV file
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="text-csv-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
              >
                <UploadCloud className="h-4 w-4" aria-hidden="true" />
                <span>Choose file</span>
              </label>
              <input id="text-csv-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              <span className="text-sm text-slate-500">CSV only, max 8MB. Include at least one text column and one label column.</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="text-column" className="block text-xs font-semibold text-slate-700">
              Text column
            </label>
            <select
              id="text-column"
              value={textColumn}
              onChange={(e) => setTextColumn(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="">Select text column</option>
              {currentColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="label-column" className="block text-xs font-semibold text-slate-700">
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
            <p className="text-sm text-slate-500">
              Labels can be things like spam or ham, positive or negative, bug, feature or question and similar categories.
            </p>
          </div>

          <details
            className="rounded-2xl border border-slate-200 bg-white p-3"
            open={advancedOpen}
            onToggle={(e) => setAdvancedOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer text-xs font-semibold text-slate-900">Advanced settings</summary>
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Data split ratios</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
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
          </details>

          <button
            type="button"
            onClick={handleTrain}
            disabled={!canTrain || modelState.status === "training"}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {modelState.status === "training" ? "Training..." : "Train text classifier"}
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
                    label={{ value: "Loss and accuracy", angle: -90, position: "insideLeft", fontSize: 10 }}
                  />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                  <Line type="monotone" dataKey="loss" stroke="#94a3b8" strokeWidth={1.6} dot={false} name="Loss" />
                  <Line type="monotone" dataKey="accuracy" stroke="#0f766e" strokeWidth={1.6} dot={false} name="Accuracy" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Evaluation summary</p>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[64px] whitespace-pre-line">
              {evalSummary || "Metrics will appear here once the classifier has been trained."}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 lg:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Try a new text</p>
          <div className="space-y-2">
            <textarea
              value={predictionText}
              onChange={(e) => setPredictionText(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Paste or type a short example, such as an email, support ticket or short review."
            />
            <button
              type="button"
              onClick={handlePredict}
              disabled={!trainedModel}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Classify text
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-700">Prediction output</p>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[64px] whitespace-pre-line">
              {predictionOutput ||
                "Your classification result will appear here, including the predicted label and top class probabilities."}
            </div>
            <p className="text-sm text-slate-500">
              This lab is for learning. It shows how text and labels become a real classifier and why evaluation metrics matter.
            </p>
          </div>
        </div>
      </div>
    </AiToolCard>
  );
}
