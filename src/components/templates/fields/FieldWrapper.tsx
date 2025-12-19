"use client";

import React, { useState } from "react";

type FieldWrapperProps = {
  id: string;
  label: string;
  help?: string;
  example?: string;
  required?: boolean;
  validationMessage?: string;
  why?: string;
  children: React.ReactNode;
};

export function FieldWrapper({ id, label, help, example, required, validationMessage, why, children }: FieldWrapperProps) {
  const [showWhy, setShowWhy] = useState(false);
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span>{label}</span>
        {required ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Required</span> : null}
      </label>
      {help ? <p className="text-xs text-slate-700">{help}</p> : null}
      {children}
      {example ? <p className="text-xs text-slate-600">Example: {example}</p> : null}
      {validationMessage ? <p className="text-xs font-semibold text-rose-700">{validationMessage}</p> : null}
      {why ? (
        <button
          type="button"
          onClick={() => setShowWhy((v) => !v)}
          className="text-xs font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          aria-expanded={showWhy}
          aria-controls={`${id}-why`}
        >
          Why we ask this
        </button>
      ) : null}
      {why && showWhy ? (
        <div id={`${id}-why`} className="rounded-lg border border-slate-200 bg-slate-50/80 p-2 text-xs text-slate-700">
          {why}
        </div>
      ) : null}
    </div>
  );
}
