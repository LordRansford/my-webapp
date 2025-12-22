"use client";

import { useMemo, useState } from "react";
import { downloadSvg } from "@/lib/architecture-diagrams/export/svg";
import { downloadPng } from "@/lib/architecture-diagrams/export/png";
import { openPrintPreview } from "./PrintView";

export default function ExportPanel({
  svgText,
  systemName,
  diagramType,
  variantLabel,
}) {
  const [pageSize, setPageSize] = useState("a4-portrait");
  const [status, setStatus] = useState("");

  const disabledReason = useMemo(() => {
    if (!svgText) return "Render the diagram first.";
    return "";
  }, [svgText]);

  const disabled = Boolean(disabledReason);

  const run = async (fn) => {
    setStatus("");
    const res = await fn();
    if (res && res.ok === false) setStatus(res.reason || "Export failed. Please try again.");
    if (res && res.ok === true) setStatus("Export ready.");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Exports</p>
          <p className="mt-1 text-sm text-slate-700">Best for reports, slides, and coursework</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            aria-label="Print page preset"
          >
            <option value="a4-portrait">A4 portrait</option>
            <option value="a3-landscape">A3 landscape</option>
          </select>
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              run(() =>
                openPrintPreview({
                  svgText,
                  systemName,
                  diagramType,
                  variantLabel,
                  pageSize,
                })
              )
            }
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            Print 🖨️
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => run(() => downloadSvg({ svgText, systemName, diagramType, variantLabel }))}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Download SVG 📄
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => run(() => downloadPng({ svgText, systemName, diagramType, variantLabel, scale: 2 }))}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Download PNG 🖼️
          </button>
        </div>
      </div>

      {disabledReason ? <p className="mt-3 text-xs font-semibold text-slate-600">{disabledReason}</p> : null}
      {status ? <p className="mt-3 text-xs font-semibold text-slate-700">{status}</p> : null}
    </div>
  );
}


