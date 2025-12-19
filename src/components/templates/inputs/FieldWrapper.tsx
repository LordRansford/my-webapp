import React, { ReactNode } from "react";

type FieldWrapperProps = {
  id: string;
  label: string;
  required?: boolean;
  help?: string;
  example?: string;
  children: ReactNode;
  error?: string | null;
  why?: string;
};

export function FieldWrapper({ id, label, required, help, example, children, error, why }: FieldWrapperProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-900">
          {label} {required ? <span className="text-amber-700 text-xs">(required)</span> : null}
        </label>
      </div>
      {help && <p className="text-xs text-slate-600">{help}</p>}
      {children}
      {example && <p className="text-xs text-slate-500">Example: {example}</p>}
      {why && (
        <details className="text-xs text-slate-600">
          <summary className="cursor-pointer text-slate-800 font-semibold">Why this question</summary>
          <p className="mt-1">{why}</p>
        </details>
      )}
      {error ? (
        <p className="text-xs font-semibold text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FieldWrapper;
