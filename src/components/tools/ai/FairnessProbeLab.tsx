"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Scale, UploadCloud } from "lucide-react";
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

type GroupMetrics = {
  group: string;
  count: number;
  positivesTrue: number;
  predictedPositive: number;
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  negativeTrue: number;
  positiveRate: number;
  tpr: number;
  fpr: number;
};

type SummaryRatios = {
  positiveRateMin: number;
  positiveRateMax: number;
  positiveRateRatio: number | null;
  tprMin: number;
  tprMax: number;
  tprRatio: number | null;
};

export function FairnessProbeLab() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [labelColumn, setLabelColumn] = useState<string>("");
  const [scoreColumn, setScoreColumn] = useState<string>("");
  const [groupColumn, setGroupColumn] = useState<string>("");
  const [positiveLabel, setPositiveLabel] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(0.5);
  const [statusMsg, setStatusMsg] = useState<string>(
    "Upload model outputs with true labels, scores and a group column to begin."
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
          setStatusMsg(
            "File loaded. Now choose the label, score and group columns, then pick a positive label and threshold."
          );

          if (!labelColumn) {
            setLabelColumn(columns[0]);
          }
          if (!scoreColumn && columns.length > 1) {
            setScoreColumn(columns[1]);
          }
          if (!groupColumn && columns.length > 2) {
            setGroupColumn(columns[2]);
          }
        },
        error: (err) => {
          setStatusMsg(`Failed to parse CSV: ${err.message}`);
        },
      });
    },
    [labelColumn, scoreColumn, groupColumn]
  );

  const distinctLabels: string[] = useMemo(() => {
    if (!parsedData || !labelColumn) return [];
    const set = new Set<string>();
    for (const row of parsedData.rows) {
      const value = row[labelColumn];
      if (value === null || value === undefined) continue;
      const s = String(value).trim();
      if (s.length > 0) set.add(s);
    }
    return Array.from(set.values());
  }, [parsedData, labelColumn]);

  const distinctGroups: string[] = useMemo(() => {
    if (!parsedData || !groupColumn) return [];
    const set = new Set<string>();
    for (const row of parsedData.rows) {
      const value = row[groupColumn];
      if (value === null || value === undefined) continue;
      const s = String(value).trim();
      if (s.length > 0) set.add(s);
    }
    return Array.from(set.values());
  }, [parsedData, groupColumn]);

  const groupMetrics: GroupMetrics[] = useMemo(() => {
    if (!parsedData || !labelColumn || !scoreColumn || !groupColumn || !positiveLabel) {
      return [];
    }

    const map = new Map<string, GroupMetrics>();

    for (const row of parsedData.rows) {
      const rawLabel = row[labelColumn];
      const rawScore = row[scoreColumn];
      const rawGroup = row[groupColumn];

      if (rawLabel === null || rawLabel === undefined) continue;
      if (rawScore === null || rawScore === undefined) continue;
      if (rawGroup === null || rawGroup === undefined) continue;

      const label = String(rawLabel).trim();
      const group = String(rawGroup).trim();
      const score = typeof rawScore === "number" ? rawScore : Number(String(rawScore).replace(",", "."));

      if (!Number.isFinite(score)) continue;

      let gm = map.get(group);
      if (!gm) {
        gm = {
          group,
          count: 0,
          positivesTrue: 0,
          predictedPositive: 0,
          truePositive: 0,
          falsePositive: 0,
          falseNegative: 0,
          negativeTrue: 0,
          positiveRate: 0,
          tpr: 0,
          fpr: 0,
        };
        map.set(group, gm);
      }

      gm.count += 1;
      const isPositiveTrue = label === positiveLabel;
      const isPredictedPositive = score >= threshold;

      if (isPositiveTrue) {
        gm.positivesTrue += 1;
      } else {
        gm.negativeTrue += 1;
      }

      if (isPredictedPositive) {
        gm.predictedPositive += 1;
      }

      if (isPositiveTrue && isPredictedPositive) {
        gm.truePositive += 1;
      } else if (!isPositiveTrue && isPredictedPositive) {
        gm.falsePositive += 1;
      } else if (isPositiveTrue && !isPredictedPositive) {
        gm.falseNegative += 1;
      }
    }

    const results: GroupMetrics[] = [];
    for (const gm of map.values()) {
      gm.positiveRate = gm.count > 0 ? gm.predictedPositive / gm.count : 0;
      gm.tpr = gm.positivesTrue > 0 ? gm.truePositive / gm.positivesTrue : 0;
      gm.fpr = gm.negativeTrue > 0 ? gm.falsePositive / gm.negativeTrue : 0;
      results.push(gm);
    }

    results.sort((a, b) => a.group.localeCompare(b.group));
    return results;
  }, [parsedData, labelColumn, scoreColumn, groupColumn, positiveLabel, threshold]);

  const summary: SummaryRatios | null = useMemo(() => {
    if (!groupMetrics.length) return null;

    const positiveRates = groupMetrics.map((g) => g.positiveRate);
    const tprs = groupMetrics.map((g) => g.tpr);

    const positiveRateMin = Math.min(...positiveRates);
    const positiveRateMax = Math.max(...positiveRates);
    const tprMin = Math.min(...tprs);
    const tprMax = Math.max(...tprs);

    const positiveRateRatio = positiveRateMax > 0 ? positiveRateMin / positiveRateMax : null;
    const tprRatio = tprMax > 0 ? tprMin / tprMax : null;

    return {
      positiveRateMin,
      positiveRateMax,
      positiveRateRatio,
      tprMin,
      tprMax,
      tprRatio,
    };
  }, [groupMetrics]);

  const positiveRateChart = useMemo(
    () =>
      groupMetrics.map((g) => ({
        group: g.group,
        value: Number(g.positiveRate.toFixed(3)),
      })),
    [groupMetrics]
  );

  const tprChart = useMemo(
    () =>
      groupMetrics.map((g) => ({
        group: g.group,
        value: Number(g.tpr.toFixed(3)),
      })),
    [groupMetrics]
  );

  const canCompute = useMemo(
    () =>
      Boolean(parsedData) &&
      Boolean(labelColumn) &&
      Boolean(scoreColumn) &&
      Boolean(groupColumn) &&
      Boolean(positiveLabel) &&
      groupMetrics.length > 0,
    [parsedData, labelColumn, scoreColumn, groupColumn, positiveLabel, groupMetrics]
  );

  const currentColumns = parsedData?.columns ?? [];

  return (
    <AiToolCard
      id="fairness-probe-lab-title"
      title="Bias and fairness probe"
      icon={<Scale className="h-4 w-4" aria-hidden="true" />}
      description="Upload model outputs, choose a group column and see how positive rates and true positive rates vary between groups."
    >
      <SecurityBanner />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 1 - Upload model outputs</p>
          <p className="text-sm text-slate-600">
            Use a CSV with one row per prediction. Include the true label, a model score between 0 and 1 and at least one group
            column such as gender, region or customer segment.
          </p>

          <div className="space-y-2">
            <label htmlFor="fairness-upload" className="block text-sm font-medium text-slate-700">
              CSV file
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="fairness-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-sky-300 hover:text-sky-700"
              >
                <UploadCloud className="h-4 w-4" aria-hidden="true" />
                <span>Choose file</span>
              </label>
              <input id="fairness-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              <span className="text-sm text-slate-500">CSV only, max 8MB. Processed locally in your browser.</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <label htmlFor="label-column" className="block text-sm font-medium text-slate-700">
                True label column
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
              <label htmlFor="score-column" className="block text-sm font-medium text-slate-700">
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
              <p className="text-sm text-slate-500">
                Scores should be between 0 and 1. They are treated as the model&apos;s confidence in the positive class.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="group-column" className="block text-sm font-medium text-slate-700">
                Group column
              </label>
              <select
                id="group-column"
                value={groupColumn}
                onChange={(e) => setGroupColumn(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Select group column</option>
                {currentColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500">
                Use a column like gender, country, customer segment, tariff type or any other group that you wish to analyse.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">{statusMsg}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 2 - Choose positive class and threshold</p>
          <p className="text-sm text-slate-600">
            The positive label is the outcome you are most concerned about. For example, in a fraud model it might be fraud, in a
            safety model it might be unsafe.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="positive-label" className="block text-sm font-medium text-slate-700">
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
            </div>

            <div className="space-y-2">
              <label htmlFor="threshold" className="block text-sm font-medium text-slate-700">
                Decision threshold
              </label>
              <input
                id="threshold"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Math.min(1, Math.max(0, Number(e.target.value))))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <p className="text-sm text-slate-500">
                Scores greater than or equal to this value are treated as positive predictions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Positive prediction rate by group</p>
            <div className="h-44 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              {canCompute ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={positiveRateChart}>
                    <XAxis dataKey="group" tick={{ fontSize: 9 }} interval={0} />
                    <YAxis
                      tick={{ fontSize: 9 }}
                      domain={[0, 1]}
                      label={{ value: "Positive rate", angle: -90, position: "insideLeft", fontSize: 10 }}
                    />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                    <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-500">
                  Once you have selected a positive label and threshold the chart will show how often each group is predicted as
                  positive.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">True positive rate by group</p>
            <div className="h-44 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              {canCompute ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tprChart}>
                    <XAxis dataKey="group" tick={{ fontSize: 9 }} interval={0} />
                    <YAxis
                      tick={{ fontSize: 9 }}
                      domain={[0, 1]}
                      label={{ value: "True positive rate", angle: -90, position: "insideLeft", fontSize: 10 }}
                    />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, padding: 8 }} />
                    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-500">
                  Once a positive label is chosen the chart will show how frequently the model correctly identifies positive cases
                  for each group.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 xl:col-span-1">
          <p className="text-xs font-semibold text-slate-700">Step 3 - Inspect group metrics and ratios</p>
          <p className="text-sm text-slate-600">
            Use this view to reason about whether the model treats groups consistently. You can adjust the threshold to see how
            trade offs change.
          </p>

          <div className="max-h-56 overflow-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full table-fixed border-collapse text-sm text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-2 py-1 text-left font-semibold">Group</th>
                  <th className="px-2 py-1 text-right font-semibold">Count</th>
                  <th className="px-2 py-1 text-right font-semibold">Pos rate</th>
                  <th className="px-2 py-1 text-right font-semibold">TPR</th>
                  <th className="px-2 py-1 text-right font-semibold">FPR</th>
                </tr>
              </thead>
              <tbody>
                {groupMetrics.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-2 text-center text-sm text-slate-500">
                      Metrics will appear here after you upload data and choose columns.
                    </td>
                  </tr>
                ) : (
                  groupMetrics.map((g) => (
                    <tr key={g.group} className="border-t border-slate-100">
                      <td className="px-2 py-1 text-left">{g.group}</td>
                      <td className="px-2 py-1 text-right">{g.count}</td>
                      <td className="px-2 py-1 text-right">{g.positiveRate.toFixed(3)}</td>
                      <td className="px-2 py-1 text-right">{g.tpr.toFixed(3)}</td>
                      <td className="px-2 py-1 text-right">{g.fpr.toFixed(3)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 space-y-1">
            {summary && canCompute ? (
              <>
                <p className="font-semibold text-slate-900">Quick fairness summary</p>
                <p>
                  The lowest positive prediction rate across groups is{" "}
                  <span className="font-medium">{summary.positiveRateMin.toFixed(3)}</span> and the highest is{" "}
                  <span className="font-medium">{summary.positiveRateMax.toFixed(3)}</span>.
                </p>
                {summary.positiveRateRatio !== null && (
                  <p>
                    The ratio of lowest to highest positive rate is{" "}
                    <span className="font-medium">{summary.positiveRateRatio.toFixed(3)}</span>. Values closer to 1 suggest more
                    similar treatment between groups on this measure.
                  </p>
                )}
                <p>
                  The lowest true positive rate across groups is{" "}
                  <span className="font-medium">{summary.tprMin.toFixed(3)}</span> and the highest is{" "}
                  <span className="font-medium">{summary.tprMax.toFixed(3)}</span>.
                </p>
                {summary.tprRatio !== null && (
                  <p>
                    The ratio of lowest to highest true positive rate is{" "}
                    <span className="font-medium">{summary.tprRatio.toFixed(3)}</span>. This helps you see if some groups receive
                    significantly fewer correct positive predictions.
                  </p>
                )}
                <p className="text-slate-500">
                  This lab is not a full fairness audit. It is a practical way to see how different groups experience your model
                  and to start conversations about whether those differences are acceptable, explainable or need action.
                </p>
              </>
            ) : (
              <p className="text-slate-500">
                Once you have uploaded data and chosen a positive label and threshold this box will highlight key differences
                between groups.
              </p>
            )}
          </div>
        </div>
      </div>
    </AiToolCard>
  );
}
