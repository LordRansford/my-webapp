"use client";

import { addTitleBlockToSvg } from "@/lib/architecture-diagrams/export/svg";

const PRINT_CSS = `
@media print {
  .rn-print-hide { display: none !important; }
  .rn-print-page { padding: 0 !important; margin: 0 !important; background: #ffffff !important; color: #0f172a !important; }
  .rn-print-sheet { page-break-after: always; }
  .rn-print-title { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size: 14pt; font-weight: 700; margin: 0 0 6pt 0; }
  .rn-print-meta { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size: 10pt; color: #334155; margin: 0 0 12pt 0; }
  .rn-print-footer { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size: 9pt; color: #334155; margin-top: 10pt; }
  .rn-print-diagram svg { width: 100% !important; height: auto !important; }
}
`;

function buildPrintHtml({ title, meta, svgMarkup, pageSize }) {
  const pageCss =
    pageSize === "a3-landscape"
      ? "@page { size: A3 landscape; margin: 12mm; }"
      : "@page { size: A4 portrait; margin: 12mm; }";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>${pageCss}</style>
    <style>${PRINT_CSS}</style>
  </head>
  <body class="rn-print-page">
    <div class="rn-print-sheet">
      <div class="rn-print-title">${title}</div>
      <div class="rn-print-meta">${meta}</div>
      <div class="rn-print-diagram">${svgMarkup}</div>
      <div class="rn-print-footer">Generated with RansfordsNotes</div>
    </div>
    <div class="rn-print-hide" style="margin-top:12px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;color:#334155">
      Close this tab after printing.
    </div>
  </body>
</html>`;
}

export function openPrintPreview({
  svgText,
  systemName,
  diagramType,
  variantLabel,
  pageSize,
}) {
  const prepared = addTitleBlockToSvg({ svgText, systemName, diagramType, variantLabel });
  if (!prepared.ok) return prepared;

  const title = `${systemName} · ${diagramType} · ${variantLabel}`;
  const meta = `${new Date().toLocaleString()}`;
  const html = buildPrintHtml({ title, meta, svgMarkup: prepared.value, pageSize });

  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return { ok: false, reason: "Pop-up blocked. Allow pop-ups to print." };
  w.document.open();
  w.document.write(html);
  w.document.close();
  // Give browser a moment to lay out before opening print.
  setTimeout(() => {
    try {
      w.focus();
      w.print();
    } catch (err) {
      // user can still trigger print manually
    }
  }, 250);

  return { ok: true };
}

export default function PrintView() {
  // Print is handled in a separate window via openPrintPreview().
  return null;
}


