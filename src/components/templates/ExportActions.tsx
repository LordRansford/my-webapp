"use client";

import React from "react";
import { ExportFormat } from "@/utils/exportPolicy";

type ExportActionsProps = {
  formats: ExportFormat[];
  disabled?: boolean;
  disabledReason?: string;
  onExport: (format: ExportFormat) => void;
};

const formatLabels: Record<ExportFormat, string> = {
  pdf: "PDF",
  docx: "DOCX",
  web: "Editable web form",
  print: "Print view",
};

export default function ExportActions({ formats, disabled, disabledReason, onExport }: ExportActionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Export formats">
        {formats.map((format) => (
          <button
            key={format}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onExport(format)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            aria-disabled={disabled}
            aria-describedby={disabled ? "export-disabled-reason" : undefined}
          >
            <span aria-hidden="true">⬇️</span>
            {formatLabels[format]}
          </button>
        ))}
      </div>
      {disabled && disabledReason && (
        <p id="export-disabled-reason" className="text-xs font-semibold text-amber-700" role="status" aria-live="polite">
          {disabledReason}
        </p>
      )}
    </div>
  );
}
