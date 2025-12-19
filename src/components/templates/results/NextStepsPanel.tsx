import React from "react";

type Props = {
  steps: string[];
};

export default function NextStepsPanel({ steps }: Props) {
  if (!steps.length) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Next steps</p>
      <ol className="list-decimal pl-5 text-sm text-slate-800 space-y-1">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
