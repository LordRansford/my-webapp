"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Target, UploadCloud } from "lucide-react";
import Papa from "papaparse";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
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

type BinRow = {
  binCenter: number;
  avgPred: number;
  fracPos: number;
  count: number;
};

type HistogramRow = {
  binCenter: number;
  count: number;
};

function safeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const num = Number(String(value).replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function buildBins(labels: (string | number)[], scores: number[], positiveLabel: string, binCount: number) {
  const bins: { sumPred: number; sumPos: number; count: number; binCenter: number }[] = [];
  const histBins: { count: number; binCenter: number }[] = [];
  const step = 1 / binCount;

  for (let i = 0; i < binCount; i += 1) {
    const center = (i + 0.5) * step;
    bins.push({ sumPred: 0, sumPos: 0, count: 0, binCenter: center });
    histBins.push({ count: 0, binCenter: center });
  }

  for (let i = 0; i < scores.length; i += 1) {
    const s = scores[i];
    const label = String(labels[i]).trim();
    if (!Number.isFinite(s)) continue;
    const index = Math.min(binCount - 1, Math.max(0, Math.floor(s / step)));
    const bin = bins[index];
    bin.sumPred += s;
    bin.sumPos += label === positiveLabel ? 1 : 0;
    bin.count += 1;

    histBins[index].count += 1;
  }

  const outBins: BinRow[] = bins.map((b) => ({
    binCenter: Number(b.binCenter.toFixed(2)),
    avgPred: b.count === 0 ? 0 : b.sumPred / b.count,
    fracPos: b.count === 0 ? 0 : b.sumPos / b.count,
    count: b.count,
  }));

  const outHist: HistogramRow[] = histBins.map((h) => ({
    binCenter: Number(h.binCenter.toFixed(2)),
    count: h.count,
  }));

  return { bins: outBins, histogram: outHist };
}

function computeBrier(labels: (string | number)[], scores: number[], positiveLabel: string): number {
  if (!labels.length || labels.length !== scores.length) return 0;
  let sum = 0;
  for (let i = 0; i < labels.length; i += 1) {
    const y = String(labels[i]).trim() === positiveLabel ? 1 : 0;
    const p = scores[i];
    if (!Number.isFinite(p)) continue;
    const diff = p - y;
    sum += diff * diff;
  }
  return sum / labels.length;
}

export function CalibrationLab() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [labelColumn, setLabelColumn] = useState<string>("");
  const [scoreColumn, setScoreColumn] = useState<string>("");
  const [positiveLabel, setPositiveLabel] = useState<string>("");
  const [binCount, setBinCount] = useState<number>(10);
  const [statusMsg, setStatusMsg] = useState<string>(
    "Upload a CSV with true labels and model probabilities to explore calibration."
  );

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
          setStatusMsg("File loaded. Now choose the label column, the probability column and the positive label.");

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

  const labelValues = useMemo<(string | number)[]>(() => {
    if (!parsedData || !labelColumn) return [];
    return parsedData.rows.map((row) => row[labelColumn]).filter((v) => v !== null && v !== undefined) as (string | number)[];
  }, [parsedData, labelColumn]);

  const scoreValues = useMemo<number[]>(() => {
    if (!parsedData || !scoreColumn) return [];
    const out: number[] = [];
    for (const row of parsedData.rows) {
      const n = safeNumber(row[scoreColumn]);
      if (n !== null) out.push(n);
    }
    return out;
  }, [parsedData, scoreColumn]);

  const distinctLabels = useMemo<string[]>(() => {
    if (!labelValues.length) return [];
    const set = new Set<string>();
    for (const v of labelValues) {
      const s = String(v).trim();
      if (s.length > 0) set.add(s);
    }
    return Array.from(set.values());
  }, [labelValues]);

  const canCompute =
    parsedData &&
    labelColumn &&
    scoreColumn &&
    positiveLabel &&
    labelValues.length === scoreValues.length &&
    labelValues.length > 0;

  const { bins, histogram } = useMemo(() => {
    if (!canCompute) return { bins: [] as BinRow[], histogram: [] as HistogramRow[] };
    return buildBins(labelValues, scoreValues, positiveLabel, binCount);
  }, [canCompute, labelValues, scoreValues, positiveLabel, binCount]);

  const brierScore = useMemo(() => {
    if (!canCompute) return null as number | null;
    return computeBrier(labelValues, scoreValues, positiveLabel);
  }, [canCompute, labelValues, scoreValues, positiveLabel]);

  function calibrationNarrative(): string {
    if (!canCompute || !bins.length || brierScore === null) {
      return "Once you upload data and choose the positive label this area will explain whether the model tends to be over confident or under confident.";
    }

    const overConfidentBins = bins.filter((b) => b.count > 0 && b.avgPred > b.fracPos + 0.05);
    const underConfidentBins = bins.filter((b) => b.count > 0 && b.avgPred < b.fracPos - 0.05);

    if (overConfidentBins.length && !underConfidentBins.length) {
      return `Across many bins the average predicted probability is higher than the observed fraction of positives. This means the model tends to be over confident. The Brier score of ${brierScore.toFixed(
        3
      )} summarises this mismatch across all rows.`;
    }
    if (underConfidentBins.length && !overConfidentBins.length) {
      return `Across many bins the average predicted probability is lower than the observed fraction of positives. This means the model tends to be under confident. The Brier score of ${brierScore.toFixed(
        3
      )} summarises how gently or sharply the predictions deviate from reality.`;
    }

    return `Some regions look over confident and some under confident, which is common in real systems. The Brier score of ${brierScore.toFixed(
      3
    )} gives a single measure of how well the probabilities line up with the outcomes. Use this together with the reliability diagram to decide where recalibration or threshold adjustments might help.`;
  }

  const formattedBins = bins.map((b) => ({
    ...b,
    avgPredDisplay: Number(b.avgPred.toFixed(3)),
    fracPosDisplay: Number(b.fracPos.toFixed(3)),
  }));

  return (
    <AiToolCard
      id="calibration-lab-title"
      title="Calibration and reliability lab"
      icon={<Target className="h-4 w-4" aria-hidden="true" />}
      description="Upload model probabilities and true labels to see whether the numbers your model outputs match reality."
    >
      <SecurityBanner />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 1 - Upload model probabilities</p>
          <p className="text-sm text-slate-600">
            Use a CSV where each row is a prediction. Include a true label column and a probability column between 0 and 1. Only
            your browser sees this data.
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="calibration-upload" className="block text-sm font-medium text-slate-700">
                CSV file
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="calibration-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
                >
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  <span>Choose file</span>
                </label>
                <input id="calibration-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              <span className="text-sm text-slate-500">CSV only, max 8MB. Processed locally.</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="calib-label-column" className="block text-sm font-medium text-slate-700">
                Label column
              </label>
              <select
                id="calib-label-column"
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
              <label htmlFor="calib-score-column" className="block text-sm font-medium text-slate-700">
                Probability column
              </label>
              <select
                id="calib-score-column"
                value={scoreColumn}
                onChange={(e) => setScoreColumn(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Select probability column</option>
                {currentColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500">These are the model&apos;s predicted probabilities that a case is positive. Values should be between 0 and 1.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="calib-positive-label" className="block text-sm font-medium text-slate-700">
                Positive label
              </label>
              <select
                id="calib-positive-label"
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
              <p className="text-sm text-slate-500">This is the outcome you are treating as positive. For example, fraud, unsafe, complaint or churn.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="calib-bin-count" className="block text-sm font-medium text-slate-700">
                Number of bins
              </label>
              <select
                id="calib-bin-count"
                value={binCount}
                onChange={(e) => setBinCount(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value={5}>5 bins</option>
                <option value={10}>10 bins</option>
                <option value={20}>20 bins</option>
              </select>
              <p className="text-sm text-slate-500">More bins show more detail but need more data. Fewer bins are smoother.</p>
            </div>
          </div>

          <p className="text-sm text-slate-500">{statusMsg}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 2 - Reliability diagram</p>
          <p className="text-sm text-slate-600">
            The reliability diagram compares what the model says to what actually happens. If the model is perfectly calibrated, the
            points will sit close to the diagonal line.
          </p>

          <div className="h-48 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            {canCompute && formattedBins.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedBins}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="avgPredDisplay"
                    tick={{ fontSize: 9 }}
                    label={{ value: "Average predicted probability", position: "insideBottom", offset: -4, fontSize: 10 }}
                    type="number"
                    domain={[0, 1]}
                  />
                  <YAxis
                    dataKey="fracPosDisplay"
                    tick={{ fontSize: 9 }}
                    label={{ value: "Observed fraction positive", angle: -90, position: "insideLeft", fontSize: 10 }}
                    type="number"
                    domain={[0, 1]}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }}
                    formatter={(value: any, name: string) => {
                      if (name === "avgPredDisplay") return [value, "Average predicted"];
                      if (name === "fracPosDisplay") return [value, "Observed fraction positive"];
                      if (name === "count") return [value, "Count"];
                      return [value, name];
                    }}
                  />
                  <Line type="linear" dataKey="avgPredDisplay" stroke="#cbd5f5" strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line type="linear" dataKey="fracPosDisplay" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} name="Calibration" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">Once you upload data and choose the positive label the reliability diagram will appear here.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <p className="mb-1 text-sm font-semibold text-slate-900">Bin summary</p>
            {canCompute && bins.length > 0 ? (
              <div className="max-h-32 overflow-auto pr-1">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="pb-1 pr-2 text-left font-medium">Bin center</th>
                      <th className="pb-1 pr-2 text-left font-medium">Avg predicted</th>
                      <th className="pb-1 pr-2 text-left font-medium">Observed positive</th>
                      <th className="pb-1 text-left font-medium">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedBins.map((b) => (
                      <tr key={b.binCenter}>
                        <td className="py-0.5 pr-2 text-slate-700">{b.binCenter.toFixed(2)}</td>
                        <td className="py-0.5 pr-2 text-slate-700">{b.avgPredDisplay.toFixed(3)}</td>
                        <td className="py-0.5 pr-2 text-slate-700">{b.fracPosDisplay.toFixed(3)}</td>
                        <td className="py-0.5 text-slate-700">{b.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Each row will show a bin such as all cases with predicted probability between 0.4 and 0.5, the average prediction in
                that bin and the fraction of positives that actually occurred.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 3 - Score distribution and interpretation</p>
          <p className="text-sm text-slate-600">
            The histogram shows how many examples fall into each probability region. This helps you see whether the model uses the
            full range from 0 to 1 or clusters around certain values.
          </p>

          <div className="h-40 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            {canCompute && histogram.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogram}>
                  <XAxis
                    dataKey="binCenter"
                    tick={{ fontSize: 9 }}
                    label={{ value: "Score bins", position: "insideBottom", offset: -4, fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">Once data is loaded this chart will show how many predictions land in each probability bin.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">How well calibrated is the model</p>
            <p>{calibrationNarrative()}</p>
            {brierScore !== null && canCompute && (
              <p className="mt-1">
                Brier score: <span className="font-semibold text-slate-900">{brierScore.toFixed(3)}</span>. Lower is better. A score close to
                zero means the probabilities usually match reality. Higher scores mean the model regularly assigns very confident probabilities
                to outcomes that do not happen.
              </p>
            )}
            <p className="text-slate-500">
              Calibration is separate from discrimination. A model can rank cases well but still be badly calibrated. This lab focuses only on
              whether the probabilities you see are trustworthy.
            </p>
          </div>
        </div>
      </div>
    </AiToolCard>
  );
}
