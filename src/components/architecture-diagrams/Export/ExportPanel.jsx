"use client";

import { useMemo, useState, useEffect } from "react";
import { downloadSvg } from "@/lib/architecture-diagrams/export/svg";
import { downloadPng } from "@/lib/architecture-diagrams/export/png";
import { openPrintPreview } from "./PrintView";
import { emitArchitectureTelemetry } from "@/lib/architecture-diagrams/telemetry/client";
import SwitchRow from "@/components/ui/SwitchRow";
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

const ESTIMATED_CREDITS = 4; // PDF generation cost

export default function ExportPanel({
  svgText,
  systemName,
  diagramType,
  variantLabel,
  variantId,
  audience,
  goal,
  appendixMarkdown,
  briefMarkdown,
  adrMarkdown,
  inputVersion,
  footerRightText,
}) {
  const [pageSize, setPageSize] = useState("a4-portrait");
  const [status, setStatus] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [includeAppendix, setIncludeAppendix] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const { accepted, canProceed } = useCreditConsent(ESTIMATED_CREDITS, balance);

  useEffect(() => {
    fetch("/api/credits/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setBalance(typeof d?.balance === "number" ? d.balance : 0);
      })
      .catch(() => setBalance(0));
  }, []);

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
    if (!canProceed) {
      setStatus("Please accept the credit estimate and ensure sufficient credits.");
      return { ok: false, reason: "Credit consent required." };
    }
    setPdfBusy(true);
    setStatus("Preparing PDF...");

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
          pageSize: wantsA3 ? "A3" : "A4",
          outcome:
            res.status === 429 ? "rate_limited" : msg.toLowerCase().includes("too large") ? "too_large" : msg.toLowerCase().includes("svg") ? "sanitise_failed" : "failed",
        });
        return { ok: false, reason: msg };
      }

      const blob = await res.blob();
      let outBlob = blob;

      if (includeAppendix && appendixMarkdown) {
        try {
          const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
          const bytes = await blob.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          const font = await doc.embedFont(StandardFonts.Helvetica);
          const page = doc.addPage();
          const { width, height } = page.getSize();

          const header = "Appendix: Architecture brief and ADR";
          const meta = `Input version: ${String(inputVersion || "")}  Date: ${new Date().toLocaleDateString()}`;

          let y = height - 50;
          page.drawText(header, { x: 40, y, size: 14, font, color: rgb(0.06, 0.09, 0.16) });
          y -= 18;
          page.drawText(meta, { x: 40, y, size: 10, font, color: rgb(0.2, 0.25, 0.31) });
          y -= 18;

          const text = String(appendixMarkdown).split("\n");
          const maxWidth = width - 80;
          const size = 9;
          const lineHeight = 12;
          const wrapLine = (line) => {
            const words = line.split(" ");
            const out = [];
            let current = "";
            for (const w of words) {
              const candidate = current ? `${current} ${w}` : w;
              if (font.widthOfTextAtSize(candidate, size) > maxWidth) {
                if (current) out.push(current);
                current = w;
              } else {
                current = candidate;
              }
            }
            if (current) out.push(current);
            return out.length ? out : [""];
          };

          let currentPage = page;
          for (const line of text) {
            const lines = wrapLine(line);
            for (const l of lines) {
              if (y < 60) {
                currentPage = doc.addPage();
                y = currentPage.getSize().height - 50;
              }
              currentPage.drawText(l, { x: 40, y, size, font, color: rgb(0.06, 0.09, 0.16) });
              y -= lineHeight;
            }
          }

          const footer = "Generated with RansfordsNotes";
          currentPage.drawText(footer, { x: 40, y: 40, size: 9, font, color: rgb(0.2, 0.25, 0.31) });

          const outBytes = await doc.save();
          outBlob = new Blob([outBytes], { type: "application/pdf" });
        } catch {
          // If appendix fails, continue with base PDF.
        }
      }

      const url = URL.createObjectURL(outBlob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("content-disposition") || "";
      const m = cd.match(/filename="([^"]+)"/i);
      a.download = m?.[1] || "diagram.pdf";
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
        pageSize: wantsA3 ? "A3" : "A4",
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
                  includeWatermark,
                  footerRightText,
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
            disabled={disabled || pdfBusy || !canProceed}
            onClick={() => run(downloadPdf)}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled || pdfBusy || !canProceed ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Download PDF
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              emitArchitectureTelemetry({ event: "export_svg", diagramType, variantId, audience, goal, outcome: "ok" });
              return run(() => downloadSvg({ svgText, systemName, diagramType, variantLabel, includeWatermark, footerRightText }));
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Download SVG
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              emitArchitectureTelemetry({ event: "export_png", diagramType, variantId, audience, goal, outcome: "ok" });
              return run(() => downloadPng({ svgText, systemName, diagramType, variantLabel, scale: 2, includeWatermark, footerRightText }));
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              disabled ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Download PNG
          </button>
        </div>
      </div>

      {disabledReason ? <p className="mt-3 text-xs font-semibold text-slate-600">{disabledReason}</p> : null}
      {status ? <p className="mt-3 text-xs font-semibold text-slate-700">{status}</p> : null}

      <div className="mt-4">
        <CreditConsent
          estimatedCredits={ESTIMATED_CREDITS}
          currentBalance={balance}
          onAccept={() => {}}
        />
      </div>

      <div className="mt-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <SwitchRow
            label="Include watermark"
            description="Adds Draft architecture to exports."
            checked={includeWatermark}
            onCheckedChange={setIncludeWatermark}
            tone="slate"
            className="py-2"
          />
          <SwitchRow
            label="Include appendix"
            description="Adds brief and ADR stubs."
            checked={includeAppendix}
            onCheckedChange={setIncludeAppendix}
            tone="slate"
            className="py-2"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {briefMarkdown ? (
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([briefMarkdown], { type: "text/markdown;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "architecture-brief.md";
              document.body.appendChild(a);
              a.click();
              a.remove();
              setTimeout(() => URL.revokeObjectURL(url), 250);
            }}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Download brief (Markdown)
          </button>
        ) : null}
        {adrMarkdown ? (
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([adrMarkdown], { type: "text/markdown;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "adr-stub.md";
              document.body.appendChild(a);
              a.click();
              a.remove();
              setTimeout(() => URL.revokeObjectURL(url), 250);
            }}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Download ADR (Markdown)
          </button>
        ) : null}
      </div>
    </div>
  );
}


