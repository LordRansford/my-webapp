import React from "react";
import type { TemplatePreview } from "@/data/templates/templates.stub";

type TemplateCardProps = {
  template: TemplatePreview | {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    complexityLevel?: "Beginner" | "Intermediate" | "Advanced";
    estimatedTime?: string;
    mathsIntensity?: "Low" | "Medium" | "High";
    [key: string]: any; // Allow additional properties
  };
};

export function TemplateCard({ template }: TemplateCardProps) {
  const summary = template.shortDescription || template.description || "";
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
          <p className="mt-1 text-base text-slate-600">{summary}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-700 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="font-semibold text-slate-900">Complexity</dt>
          <dd>{template.complexityLevel || "N/A"}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="font-semibold text-slate-900">Estimated time</dt>
          <dd>{template.estimatedTime || "N/A"}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="font-semibold text-slate-900">Maths intensity</dt>
          <dd>{template.mathsIntensity || "N/A"}</dd>
        </div>
      </dl>
    </article>
  );
}
