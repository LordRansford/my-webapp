"use client";

import React from "react";

type ExportBarProps = {
  disabled?: boolean;
  disabledReason?: string;
  summary: string;
  assumptions: string[];
  references?: string[];
  fileBaseName: string;
};

export function ExportBar({ disabled = true, disabledReason = "Export unlocked later", summary, assumptions, references, fileBaseName }: ExportBarProps) {
  const formats: Array<{ id: "pdf" | "docx" | "csv"; label: string }> = [
    { id: "pdf", label: "Export PDF" },
    { id: "docx", label: "Export DOCX" },
    { id: "csv", label: "Export CSV" },
  ];

  const handle = () => {
    // Exports locked for now (Stage 9D)
    return;
  };

  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-slate-900">Export</p>
      {formats.map((fmt) => (
        <button
          key={fmt.id}
          type="button"
          onClick={handle}
          disabled={disabled}
          title={disabledReason}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
            disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {fmt.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(summary)}
        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      >
        Copy summary
      </button>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(assumptions.join("\n"))}
        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      >
        Copy assumptions
      </button>
      {references?.length ? (
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(references.join("\n"))}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Copy references
        </button>
      ) : null}
      {disabled ? <p className="text-xs text-amber-700">{disabledReason}</p> : null}
    </div>
  );
}

export default ExportBar;
