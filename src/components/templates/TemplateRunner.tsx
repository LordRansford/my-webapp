"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { templateDefinitions } from "../../../content/templates/definitions";
import type { TemplateDefinition, TemplateField } from "../../../content/templates/definitions/types";
import { TEMPLATE_CATEGORIES } from "@/data/templates/categories";
import {
  FieldText,
  FieldTextarea,
  FieldSelect,
  FieldMultiSelect,
  FieldNumber,
  FieldSlider,
  FieldToggle,
  FieldDate,
  FieldFileUpload,
} from "@/components/templates/fields";
import { ScoreCard, RiskBadge, AssumptionsPanel, ExplanationBlock, NextStepsPanel } from "@/components/templates/results";
import ExportBar from "@/components/templates/ExportBar";
import { RiskMatrix, TemplateRadarChart, TemplateBarChart, TemplateLineChart } from "@/components/templates/charts/TemplateCharts";
import CPDEvidencePanel from "@/components/cpd/CPDEvidencePanel";
import { deleteRun, duplicateRun, loadRuns, saveRun, StoredRun } from "@/lib/templateRuns";

type RunnerProps = {
  slug: string;
};

const debounce = (fn: () => void, delay: number) => {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

function defaultValueForField(field: TemplateField) {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === "toggle") return false;
  if (field.type === "slider" || field.type === "number") return 0;
  if (field.type === "multiselect") return [];
  return "";
}

const definitionMap: Record<string, TemplateDefinition> = Object.fromEntries(
  templateDefinitions.map((def) => [def.slug, def])
);

export function TemplateRunner({ slug }: RunnerProps) {
  const definition: TemplateDefinition | undefined = definitionMap[slug];
  const router = useRouter();
  const [values, setValues] = useState<Record<string, any>>({});
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [resultSummary, setResultSummary] = useState("");
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [chartData, setChartData] = useState<Record<string, any>[]>([]);
  const [matrixPlacement, setMatrixPlacement] = useState<{ row: number; col: number } | undefined>();
  const [riskBand, setRiskBand] = useState<string | undefined>();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [meaning, setMeaning] = useState<string>("");
  const [whyMatters, setWhyMatters] = useState<string>("");
  const [whenBreaks, setWhenBreaks] = useState<string>("");
  const [runs, setRuns] = useState<StoredRun[]>([]);
  const [versionWarning, setVersionWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!definition) return;
    setRuns(loadRuns(definition.slug));
    const initial: Record<string, any> = {};
    definition.fields.forEach((field) => {
      initial[field.id] = defaultValueForField(field);
    });
    setValues(initial);
  }, [definition]);

  const validate = (vals: Record<string, any>) => {
    const v: Record<string, string> = {};
    definition?.fields.forEach((f) => {
      if (f.required && (vals[f.id] === "" || vals[f.id] === undefined || vals[f.id] === null || (Array.isArray(vals[f.id]) && vals[f.id].length === 0))) {
        v[f.id] = "Required";
      }
      if (f.validation?.min !== undefined && typeof vals[f.id] === "number" && vals[f.id] < f.validation.min) {
        v[f.id] = `Minimum ${f.validation.min}`;
      }
      if (f.validation?.max !== undefined && typeof vals[f.id] === "number" && vals[f.id] > f.validation.max) {
        v[f.id] = `Maximum ${f.validation.max}`;
      }
    });
    setValidation(v);
    return Object.keys(v).length === 0;
  };

  const runCalc = useMemo(
    () =>
      debounce(() => {
        if (!definition) return;
        if (!validate(values)) return;
        const res = definition.calcFn(values);
        setScores(res.scores);
        setRiskBand(res.riskBand);
        setResultSummary(res.explanation);
        setAssumptions(res.assumptions || []);
        setNextSteps(res.nextSteps || []);
        setChartData(res.chartData || []);
        setMatrixPlacement(res.matrixPlacement);
        setMeaning(res.meaning || "");
        setWhyMatters(res.whyItMatters || "");
        setWhenBreaks(res.whenItBreaks || "");
        const stored = saveRun({
          templateSlug: definition.slug,
          templateVersion: definition.version,
          inputs: values,
          outputs: {
            scores: res.scores,
            riskBand: res.riskBand,
            explanation: res.explanation,
            assumptions: res.assumptions,
            nextSteps: res.nextSteps,
            chartData: res.chartData,
            matrixPlacement: res.matrixPlacement,
          },
          summary: res.explanation || definition.title,
        });
        setRuns((prev) => {
          const filtered = prev.filter((r) => r.id !== stored.id);
          return [stored, ...filtered];
        });
      }, 250),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [definition, values]
  );

  useEffect(() => {
    runCalc();
  }, [values, runCalc]);

  if (!definition) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-slate-800">
        <p className="text-lg font-semibold">Template not found.</p>
        <button
          type="button"
          onClick={() => router.push("/templates")}
          className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to templates
        </button>
      </div>
    );
  }

  const handleChange = (id: string, val: any) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    const confirmed = window.confirm("Reset all inputs?");
    if (!confirmed) return;
    const initial: Record<string, any> = {};
    definition.fields.forEach((f) => {
      initial[f.id] = defaultValueForField(f);
    });
    setValues(initial);
    setValidation({});
    setScores({});
    setRiskBand(undefined);
    setAssumptions([]);
    setNextSteps([]);
    setResultSummary("");
    setChartData([]);
    setMatrixPlacement(undefined);
  };

  const category = TEMPLATE_CATEGORIES.find((c) => c.id === definition.category);
  const primaryScore = typeof scores.risk === "number" ? scores.risk : 0;
  const normalizedScore = Math.max(0, Math.min(100, primaryScore * (primaryScore > 10 ? 1 : 10)));
  const bandColor =
    riskBand === "Critical"
      ? "bg-rose-500"
      : riskBand === "High"
      ? "bg-amber-500"
      : riskBand === "Moderate"
      ? "bg-yellow-500"
      : "bg-emerald-500";
  const requiredMissing = definition.fields.some(
    (f) =>
      f.required &&
      (values[f.id] === "" ||
        values[f.id] === undefined ||
        values[f.id] === null ||
        (Array.isArray(values[f.id]) && values[f.id].length === 0))
  );

  return (
    <div className="page-content mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6" data-mode="preview">
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <Link href="/templates" className="font-semibold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4">
          Templates
        </Link>
        <span aria-hidden="true">/</span>
        {category ? (
          <Link href={`/templates/${category.id}`} className="font-semibold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4">
            {category.title}
          </Link>
        ) : (
          <span className="text-slate-600">Category</span>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-slate-500">{definition.title}</span>
      </div>

      <div className="space-y-3 rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50/60 to-slate-50 px-6 py-6 ring-1 ring-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Template runner</p>
            <h1 className="text-3xl font-semibold text-slate-900">{definition.title}</h1>
            <p className="text-sm text-slate-700">{definition.description}</p>
            <p className="text-xs text-slate-600">Estimated {definition.estimatedMinutes} minutes. Processed locally in your browser.</p>
            {versionWarning && <p className="text-xs font-semibold text-amber-700">{versionWarning}</p>}
          </div>
          <div className="inline-flex flex-wrap items-center gap-2">
            <RiskBadge band={riskBand} />
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-700">Disclaimer: informational only, not legal or professional advice. Results depend on inputs.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Inputs</p>
            <span className="text-xs text-slate-700">Keyboard and screen reader friendly</span>
          </div>
          <div className="space-y-4">
            {definition.fields.map((field) => {
              const common = {
                id: field.id,
                label: field.label,
                help: field.help,
                example: field.example,
                required: field.required,
                validationMessage: validation[field.id],
                why: field.why,
                value: values[field.id],
                onChange: (v: any) => handleChange(field.id, v),
              };
              if (field.type === "text") return <FieldText key={field.id} {...common} placeholder={field.placeholder} />;
              if (field.type === "textarea") return <FieldTextarea key={field.id} {...common} placeholder={field.placeholder} rows={3} />;
              if (field.type === "select") return <FieldSelect key={field.id} {...common} options={field.options || []} />;
              if (field.type === "multiselect") return <FieldMultiSelect key={field.id} {...common} options={field.options || []} />;
              if (field.type === "number") return <FieldNumber key={field.id} {...common} min={field.validation?.min} max={field.validation?.max} step={field.step} placeholder={field.placeholder} />;
              if (field.type === "slider") return <FieldSlider key={field.id} {...common} min={field.validation?.min} max={field.validation?.max} step={field.step} />;
              if (field.type === "toggle") return <FieldToggle key={field.id} {...common} />;
              if (field.type === "date") return <FieldDate key={field.id} {...common} />;
              if (field.type === "file") return <FieldFileUpload key={field.id} {...common} />;
              return null;
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Results</p>
            <RiskBadge band={riskBand} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ScoreCard title="Primary score" value={scores.risk ?? "—"} />
            <ScoreCard title="Estimated time" value={`${definition.estimatedMinutes} mins`} />
          </div>
          <ExplanationBlock text={resultSummary || "Adjust inputs to see results update live."} />
          {(meaning || whyMatters || whenBreaks) && (
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">What this means</p>
                <p className="mt-1">{meaning || "Updates as you change inputs."}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Why it matters</p>
                <p className="mt-1">{whyMatters || "Shows impact of your selections."}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">When this breaks down</p>
                <p className="mt-1">{whenBreaks || "Heuristics only; validate with real data."}</p>
              </div>
            </div>
          )}
          <AssumptionsPanel items={assumptions} />
          <NextStepsPanel steps={nextSteps} />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Score guide</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full ${bandColor}`} style={{ width: `${normalizedScore}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">History</p>
            {runs.length === 0 ? (
              <p className="text-sm text-slate-700">No runs saved yet. Fill inputs to save automatically.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {runs.map((run) => {
                  const updatedVersion = run.templateVersion && definition.version && run.templateVersion !== definition.version;
                  return (
                    <li key={run.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-slate-900">{new Date(run.updatedAt).toLocaleString()}</div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                            onClick={() => {
                              if (updatedVersion) {
                                setVersionWarning("This template has been updated since this run.");
                              } else {
                                setVersionWarning(null);
                              }
                              setValues(run.inputs);
                            }}
                          >
                            Resume
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                            onClick={() => {
                              const copy = duplicateRun(run.id);
                              if (copy) setRuns(loadRuns(definition.slug));
                            }}
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                            onClick={() => {
                              deleteRun(run.id);
                              setRuns(loadRuns(definition.slug));
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-slate-700">{run.summary}</p>
                      {updatedVersion ? (
                        <p className="text-[11px] font-semibold text-amber-700">This run used version {run.templateVersion}. Current version is {definition.version}.</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <CPDEvidencePanel
            itemId={definition.slug}
            activityType="template-submission"
            defaultObjectives={[definition.title]}
            defaultMinutes={definition.estimatedMinutes * 2}
            evidenceLinks={[resultSummary]}
            templateVersion={definition.version}
            category={definition.category}
          />
          <div className="space-y-2">
            {definition.charts.map((chart) => {
              if (chart.type === "matrix") return <RiskMatrix key={chart.id} placement={matrixPlacement} />;
              if (chart.type === "radar") return <TemplateRadarChart key={chart.id} data={chartData} />;
              if (chart.type === "bar") return <TemplateBarChart key={chart.id} data={chartData} xKey={chart.xKey} yKeys={chart.yKeys} />;
              if (chart.type === "line") return <TemplateLineChart key={chart.id} data={chartData} xKey={chart.xKey} yKey={chart.yKey} />;
              return null;
            })}
          </div>
        </div>
      </div>

      <ExportBar
        disabled={requiredMissing || !resultSummary}
        disabledReason={requiredMissing ? "Fill required fields to enable exports." : undefined}
        summary={resultSummary || "No summary yet. Complete required fields first."}
        assumptions={assumptions}
        references={nextSteps}
        fileBaseName={definition.slug}
      />
    </div>
  );
}
