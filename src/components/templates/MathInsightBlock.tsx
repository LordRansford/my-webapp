import React from "react";

export type MathInsight = {
  title: string;
  explanation: string;
  exampleFormula: string;
  application?: string;
};

export function MathInsightBlock({ title, explanation, exampleFormula, application }: MathInsight) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-sm font-semibold text-white">Preview</span>
      </div>
      <p className="text-sm text-slate-800 leading-relaxed">{explanation}</p>
      {application ? <p className="text-xs text-slate-700">{application}</p> : null}
      <pre className="overflow-x-auto rounded-xl bg-slate-900/90 p-3 text-xs text-slate-100">
        <code>{exampleFormula}</code>
      </pre>
      <p className="text-xs font-medium text-slate-700">Calculation disabled in preview mode.</p>
    </div>
  );
}

export default MathInsightBlock;
