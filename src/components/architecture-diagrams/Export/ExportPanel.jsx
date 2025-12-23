"use client";

import { useMemo, useState } from "react";
import { downloadSvg } from "@/lib/architecture-diagrams/export/svg";
import { downloadPng } from "@/lib/architecture-diagrams/export/png";
import { openPrintPreview } from "./PrintView";
import { buildDiagramFileBase } from "@/lib/architecture-diagrams/export/filename";
import { emitArchitectureTelemetry } from "@/lib/architecture-diagrams/telemetry/client";

export default function ExportPanel({
  svgText,
  systemName,
  diagramType,
  variantLabel,
  variantId,
  audience,
  goal,
}) {
  const [pageSize, setPageSize] = useState("a4-portrait");
  const [status, setStatus] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);

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

  const downloadPdf = async () => {
    if (!svgText) return { ok: false, reason: "Render the diagram first." };
    setPdfBusy(true);
    setStatus("Preparing PDF…");
    emitArchitectureTelemetry({ event: "export_pdf_requested", diagramType, variantId, audience, goal, pageSize: pageSize === "a3-landscape" ? "A3" : "A4" });
    try {
      const wantsA3 = pageSize === "a3-landscape";
      const res = await fetch("/api/architecture-diagrams/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          svg: svgText,
          systemName,
          diagramType,
          variant: variantLabel,
          pageSize: wantsA3 ? "A3" : "A4",
          orientation: wantsA3 ? "landscape" : "portrait",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || "PDF export failed. Please try again.";
        setStatus(msg);
        emitArchitectureTelemetry({
          event: "export_pdf_failed",
          diagramType,
          variantId,
          audience,
          goal,
          pageSize: pageSize === "a3-landscape" ? "A3" : "A4",
          outcome: res.status === 429 ? "rate_limited" : msg.toLowerCase().includes("too large") ? "too_large" : msg.toLowerCase().includes("svg") ? "sanitise_failed" : "failed",
        });
        return { ok: false, reason: msg };
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${buildDiagramFileBase({ systemName, diagramType, variant: variantLabel })}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 250);
      setStatus("Export ready.");
      emitArchitectureTelemetry({
        event: "export_pdf_succeeded",
        diagramType,
        variantId,
        audience,
        goal,
        pageSize: pageSize === "a3-landscape" ? "A3" : "A4",
        outcome: "ok",
      });
      return { ok: true };
    } catch (err) {
      const msg = "PDF export failed. Please try again.";
      setStatus(msg);
      emitArchitectureTelemetry({ event: "export_pdf_failed", diagramType, variantId, audience, goal, pageSize: pageSize === "a3-landscape" ? "A3" : "A4", outcome: "failed" });
      return { ok: false, reason: msg };
    } finally {
      setPdfBusy(false);
    }
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
            disabled={disabled || pdfBusy}
            onClick={() => run(downloadPdf)}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled || pdfBusy ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Download PDF
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              emitArchitectureTelemetry({ event: "export_svg", diagramType, variantId, audience, goal, outcome: "ok" });
              return run(() => downloadSvg({ svgText, systemName, diagramType, variantLabel }));
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Download SVG 📄
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              emitArchitectureTelemetry({ event: "export_png", diagramType, variantId, audience, goal, outcome: "ok" });
              return run(() => downloadPng({ svgText, systemName, diagramType, variantLabel, scale: 2 }));
            }}
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


