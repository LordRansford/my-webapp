"use client";

export default function TemplateCard({ template, onUse, onPreview }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Template</p>
        <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
        <p className="text-sm text-slate-700">{template.description}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            audience: {template.intendedAudience}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            diagrams: {template.diagramTypesIncluded.length}
          </span>
        </div>
        <p className="text-xs text-slate-600">
          Included: {template.diagramTypesIncluded.join(", ")}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onUse(template.id)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Use this template
        </button>
        <button
          type="button"
          onClick={() => onPreview(template.id)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Preview diagrams
        </button>
      </div>
    </div>
  );
}


