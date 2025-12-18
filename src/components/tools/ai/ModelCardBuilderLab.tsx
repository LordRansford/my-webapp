"use client";

import React, { useMemo, useState } from "react";
import { FileText } from "lucide-react";

type Field = {
  id: string;
  label: string;
  placeholder: string;
  helper: string;
};

const FIELDS: Field[] = [
  {
    id: "name",
    label: "Model name",
    placeholder: "For example: Ransford Notes sentiment classifier v1",
    helper: "Give a clear, human friendly name.",
  },
  {
    id: "purpose",
    label: "Intended use",
    placeholder: "What problem does this model solve and for whom?",
    helper: "Describe tasks, users and contexts where this model should be used.",
  },
  {
    id: "limits",
    label: "Limitations",
    placeholder: "Where does this model struggle or fail?",
    helper: "List cases where results may be poor or misleading.",
  },
  {
    id: "data",
    label: "Training data",
    placeholder: "High level description of datasets, sources and time periods.",
    helper: "Avoid sensitive details, focus on types of data and coverage.",
  },
  {
    id: "fairness",
    label: "Fairness and bias",
    placeholder: "What checks have you carried out and what did you observe?",
    helper: "Mention any demographic or domain limitations.",
  },
  {
    id: "safety",
    label: "Safety and governance",
    placeholder: "Who is accountable, how is the model monitored and updated?",
    helper: "Describe review processes, monitoring and escalation paths.",
  },
];

export function ModelCardBuilderLab() {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const markdown = useMemo(() => {
    const lines: string[] = [];
    if (values.name) {
      lines.push(`# ${values.name}`);
      lines.push("");
    }
    lines.push("## Intended use");
    lines.push(values.purpose || "_Describe what you want this model to do._");
    lines.push("");
    lines.push("## Limitations");
    lines.push(values.limits || "_Capture where this model is weak or should not be used._");
    lines.push("");
    lines.push("## Training data");
    lines.push(values.data || "_Summarise the main data sources and time periods._");
    lines.push("");
    lines.push("## Fairness and bias");
    lines.push(values.fairness || "_Describe any checks and remaining risks related to bias._");
    lines.push("");
    lines.push("## Safety and governance");
    lines.push(
      values.safety ||
        "_Outline who is responsible, how the model is monitored and how updates are handled._"
    );
    return lines.join("\n");
  }, [values]);

  return (
    <section
      aria-labelledby="model-card-builder-title"
      className="rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 p-6 sm:p-8 space-y-6 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2 id="model-card-builder-title" className="text-lg sm:text-xl font-semibold text-slate-900">
              Model card builder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Capture the key information about a model in a structured way and generate a Markdown model card you can
              paste into documentation or a repository.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700 mb-1">Fill in the details</p>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {FIELDS.map((field) => (
              <div
                key={field.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 space-y-1 text-xs text-slate-700"
              >
                <label className="font-semibold text-slate-800">{field.label}</label>
                <textarea
                  value={values[field.id] ?? ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none min-h-[60px]"
                />
                <p className="text-[11px] text-slate-500">{field.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Generated model card (Markdown)</h3>
            <p className="text-xs text-slate-600 mb-2">
              You can copy this into a repository, wiki or learning material to help others understand what this model
              is and how it should be used.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-900/95 text-[11px] sm:text-xs text-slate-100 font-mono p-3 max-h-72 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{markdown}</pre>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">How lecturers and teams can use this</h3>
            <p>
              Ask students to complete a model card for any project that uses a model. This shifts the focus from “can I
              get good accuracy” to “do I understand impact, risk and governance”.
            </p>
            <p>
              In organisations, you can store these cards alongside code and datasets so new colleagues can quickly see
              the story behind each model.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
