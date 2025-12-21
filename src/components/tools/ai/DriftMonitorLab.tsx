"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Activity, UploadCloud } from "lucide-react";
import Papa from "papaparse";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

type Stats = {
  count: number;
  mean: number;
  std: number;
  min: number;
  max: number;
};

type DriftSummary = {
  meanDiff: number;
  stdDiff: number;
  driftScore: number | null;
};

function safeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const num = Number(String(value).replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function computeStats(values: number[]): Stats {
  if (!values.length) {
    return { count: 0, mean: 0, std: 0, min: 0, max: 0 };
  }
  const count = values.length;
  const mean = values.reduce((acc, v) => acc + v, 0) / count;
  const variance =
    count > 1 ? values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (count - 1) : 0;
  const std = Math.sqrt(variance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { count, mean, std, min, max };
}

function computeDriftSummary(baseline: Stats, current: Stats): DriftSummary {
  if (baseline.count === 0 || current.count === 0) {
    return { meanDiff: 0, stdDiff: 0, driftScore: null };
  }
  const meanDiff = current.mean - baseline.mean;
  const stdDiff = current.std - baseline.std;
  const driftScore = baseline.std > 0 ? Math.abs(meanDiff) / baseline.std : null;
  return { meanDiff, stdDiff, driftScore };
}

export function DriftMonitorLab() {
  const [baselineData, setBaselineData] = useState<ParsedData | null>(null);
  const [currentData, setCurrentData] = useState<ParsedData | null>(null);
  const [featureColumn, setFeatureColumn] = useState<string>("");
  const [labelColumn, setLabelColumn] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>(
    "Upload a baseline CSV and a current CSV with the same columns to begin."
  );

  const handleBaselineFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { safeFiles, errors } = validateUpload(e.target.files, { maxBytes: 8 * 1024 * 1024, allowedExtensions: [".csv"] });
      if (errors.length) alert(errors.join("\n"));
      const file = safeFiles[0];
      if (!file) return;

      setStatusMsg("Parsing baseline CSV…");

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const rows = results.data as Row[];
          if (!rows || rows.length === 0) {
            setStatusMsg("The baseline CSV appears to be empty or malformed.");
            return;
          }
          const first = rows[0];
          const columns = Object.keys(first);
          if (!columns.length) {
            setStatusMsg("Could not detect any columns in the baseline CSV.");
            return;
          }
          setBaselineData({ columns, rows });
          setStatusMsg("Baseline loaded. Now upload the current CSV with the same structure.");
          if (!featureColumn) {
            setFeatureColumn(columns[0]);
          }
        },
        error: (err) => {
          setStatusMsg(`Failed to parse baseline CSV: ${err.message}`);
        },
      });
    },
    [featureColumn]
  );

  const handleCurrentFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { safeFiles, errors } = validateUpload(e.target.files, { maxBytes: 8 * 1024 * 1024, allowedExtensions: [".csv"] });
      if (errors.length) alert(errors.join("\n"));
      const file = safeFiles[0];
      if (!file) return;

      setStatusMsg("Parsing current CSV…");

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const rows = results.data as Row[];
          if (!rows || rows.length === 0) {
            setStatusMsg("The current CSV appears to be empty or malformed.");
            return;
          }
          const first = rows[0];
          const columns = Object.keys(first);
          if (!columns.length) {
            setStatusMsg("Could not detect any columns in the current CSV.");
            return;
          }
          setCurrentData({ columns, rows });
          setStatusMsg("Current data loaded. Now choose a feature and optional label to compare.");
          if (!featureColumn) {
            setFeatureColumn(columns[0]);
          }
        },
        error: (err) => {
          setStatusMsg(`Failed to parse current CSV: ${err.message}`);
        },
      });
    },
    [featureColumn]
  );

  const commonColumns: string[] = useMemo(() => {
    if (!baselineData || !currentData) return [];
    const base = new Set(baselineData.columns);
    return currentData.columns.filter((c) => base.has(c));
  }, [baselineData, currentData]);

  const featureValuesBaseline: number[] = useMemo(() => {
    if (!baselineData || !featureColumn) return [];
    const out: number[] = [];
    for (const row of baselineData.rows) {
      const n = safeNumber(row[featureColumn]);
      if (n !== null) out.push(n);
    }
    return out;
  }, [baselineData, featureColumn]);

  const featureValuesCurrent: number[] = useMemo(() => {
    if (!currentData || !featureColumn) return [];
    const out: number[] = [];
    for (const row of currentData.rows) {
      const n = safeNumber(row[featureColumn]);
      if (n !== null) out.push(n);
    }
    return out;
  }, [currentData, featureColumn]);

  const baselineStats = useMemo(() => computeStats(featureValuesBaseline), [featureValuesBaseline]);
  const currentStats = useMemo(() => computeStats(featureValuesCurrent), [featureValuesCurrent]);
  const driftSummary = useMemo(() => computeDriftSummary(baselineStats, currentStats), [baselineStats, currentStats]);

  const histogramData = useMemo(() => {
    if (!featureValuesBaseline.length && !featureValuesCurrent.length) return [];

    const allValues = [...featureValuesBaseline, ...featureValuesCurrent].sort((a, b) => a - b);
    const binCount = 10;
    const min = allValues[0];
    const max = allValues[allValues.length - 1];
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [];

    const binSize = (max - min) / binCount;
    const baselineBins = new Array(binCount).fill(0);
    const currentBins = new Array(binCount).fill(0);

    // Treat values as opaque numbers; never execute user data.
    featureValuesBaseline.forEach((v) => {
      const idx = Math.min(binCount - 1, Math.max(0, Math.floor((v - min) / binSize)));
      baselineBins[idx] += 1;
    });
    featureValuesCurrent.forEach((v) => {
      const idx = Math.min(binCount - 1, Math.max(0, Math.floor((v - min) / binSize)));
      currentBins[idx] += 1;
    });

    const rows: { bin: string; baseline: number; current: number }[] = [];
    for (let i = 0; i < binCount; i += 1) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      rows.push({
        bin: `${binStart.toFixed(1)} - ${binEnd.toFixed(1)}`,
        baseline: baselineBins[i],
        current: currentBins[i],
      });
    }
    return rows;
  }, [featureValuesBaseline, featureValuesCurrent]);

  const labelFrequencies = useMemo(() => {
    if (!baselineData || !currentData || !labelColumn) {
      return { baseline: [] as { label: string; count: number }[], current: [] as { label: string; count: number }[] };
    }
    const baselineMap = new Map<string, number>();
    const currentMap = new Map<string, number>();

    baselineData.rows.forEach((row) => {
      const value = row[labelColumn];
      if (value === null || value === undefined) return;
      const s = String(value).trim();
      if (!s) return;
      baselineMap.set(s, (baselineMap.get(s) ?? 0) + 1);
    });
    currentData.rows.forEach((row) => {
      const value = row[labelColumn];
      if (value === null || value === undefined) return;
      const s = String(value).trim();
      if (!s) return;
      currentMap.set(s, (currentMap.get(s) ?? 0) + 1);
    });

    const labels = new Set<string>();
    for (const lab of baselineMap.keys()) labels.add(lab);
    for (const lab of currentMap.keys()) labels.add(lab);

    const baseline = Array.from(labels).map((lab) => ({
      label: lab,
      count: baselineMap.get(lab) ?? 0,
    }));
    const current = Array.from(labels).map((lab) => ({
      label: lab,
      count: currentMap.get(lab) ?? 0,
    }));
    return { baseline, current };
  }, [baselineData, currentData, labelColumn]);

  const hasFeatureData = featureValuesBaseline.length > 0 && featureValuesCurrent.length > 0;
  const canCompare = Boolean(baselineData && currentData && featureColumn);

  return (
    <AiToolCard
      id="drift-monitor-lab-title"
      title="Data drift and monitoring explorer"
      icon={<Activity className="h-4 w-4" aria-hidden="true" />}
      description="Upload baseline and current model data to see how feature distributions and label frequencies have shifted over time."
    >
      <SecurityBanner />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 1 - Upload baseline and current data</p>
          <p className="text-sm text-slate-600">
            Use two CSV files with the same structure. Baseline could be a previous time period, current is the time you want to
            check for drift. Only your browser sees this data.
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="baseline-upload" className="block text-sm font-medium text-slate-700">
                Baseline CSV
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="baseline-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
                >
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  <span>Choose file</span>
                </label>
                <input id="baseline-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={handleBaselineFileChange} />
                <span className="text-sm text-slate-500">CSV only, max 8MB. Processed in-browser.</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="current-upload" className="block text-sm font-medium text-slate-700">
                Current CSV
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="current-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
                >
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  <span>Choose file</span>
                </label>
                <input id="current-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={handleCurrentFileChange} />
                <span className="text-sm text-slate-500">Use the same schema as baseline. Max 8MB.</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <label htmlFor="feature-column" className="block text-sm font-medium text-slate-700">
                Numeric feature to compare
              </label>
              <select
                id="feature-column"
                value={featureColumn}
                onChange={(e) => setFeatureColumn(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Select feature column</option>
                {commonColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="label-column" className="block text-sm font-medium text-slate-700">
                Optional label column
              </label>
              <select
                id="label-column"
                value={labelColumn}
                onChange={(e) => setLabelColumn(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">No label column</option>
                {commonColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500">
                If you pick a label column, the lab will also compare how label frequencies have shifted between baseline and
                current.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">{statusMsg}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 2 - Inspect feature drift</p>
          <p className="text-sm text-slate-600">
            Compare how the distribution of the chosen feature has changed between baseline and current. This is often one of the
            first signs that a model may be receiving different inputs than it was trained on.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Baseline</p>
                <p>Count: {baselineStats.count}</p>
                <p>Mean: {baselineStats.mean.toFixed(3)}</p>
                <p>Std dev: {baselineStats.std.toFixed(3)}</p>
                <p>Min: {baselineStats.min.toFixed(3)}</p>
                <p>Max: {baselineStats.max.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Current</p>
                <p>Count: {currentStats.count}</p>
                <p>Mean: {currentStats.mean.toFixed(3)}</p>
                <p>Std dev: {currentStats.std.toFixed(3)}</p>
                <p>Min: {currentStats.min.toFixed(3)}</p>
                <p>Max: {currentStats.max.toFixed(3)}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              <p>
                Drift score is calculated as the absolute difference in means divided by the baseline standard deviation. This is
                similar to a simple effect size measure and gives a rough sense of how large the shift is relative to baseline
                variability.
              </p>
              {driftSummary.driftScore !== null && (
                <p className="mt-1">
                  Drift score:{" "}
                  <span className="font-semibold text-slate-900">{driftSummary.driftScore.toFixed(3)}</span>{" "}
                  (higher values indicate larger mean shifts).
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Distribution comparison</p>
            <div className="h-44 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              {canCompare && histogramData.length > 0 && hasFeatureData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData}>
                    <XAxis dataKey="bin" tick={{ fontSize: 9 }} interval={0} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                    <Bar dataKey="baseline" fill="#0f766e" name="Baseline" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="current" fill="#6366f1" name="Current" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-500">
                  Once both datasets are loaded and a numeric feature is selected the chart will show how the feature distribution
                  has changed across ten bins.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 3 - Optional label drift</p>
          <p className="text-sm text-slate-600">
            If you have a label column such as fraud, churn, complaint type or incident severity you can see how the distribution
            of labels has changed between baseline and current periods.
          </p>

          <div className="h-44 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            {labelColumn && labelFrequencies.baseline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={labelFrequencies.baseline.map((b) => {
                    const currentMatch = labelFrequencies.current.find((c) => c.label === b.label) ?? null;
                    return { label: b.label, baseline: b.count, current: currentMatch?.count ?? 0 };
                  })}
                >
                  <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                  <Bar dataKey="baseline" fill="#0f766e" name="Baseline" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="current" fill="#f97316" name="Current" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">
                Select a label column to see how label frequencies have shifted. This is useful for spotting changes in the
                underlying population, such as more fraud cases or more high risk customers.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">Reasoning about drift</p>
            <p>
              Use the feature stats and histograms to decide whether the model is seeing meaningfully different inputs than when it
              was trained. Large shifts in key features can explain performance drops and may require retraining, recalibration or
              tighter monitoring.
            </p>
            <p>
              Label drift can indicate that the real world has changed. For example, if the proportion of fraud cases doubles, a
              stable model may still look worse if you only watch accuracy. Combining both feature drift and label drift gives a
              more complete view of what is happening.
            </p>
            <p className="text-slate-500">
              This lab is not a full production monitoring stack. It is a practical way for you to upload real data and build an
              intuitive feel for drift before you invest in heavier infrastructure.
            </p>
          </div>
        </div>
      </div>
    </AiToolCard>
  );
}
