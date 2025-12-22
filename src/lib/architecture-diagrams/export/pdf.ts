import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
// @ts-ignore - svg-to-pdfkit has no bundled types in this repo
import svgToPdfKit from "svg-to-pdfkit";
import { sanitiseSvgStrict } from "@/lib/security/svgSanitise";

const PAGE_SIZES = {
  A4: { w: 595.28, h: 841.89 },
  A3: { w: 841.89, h: 1190.55 },
} as const;

type PdfMeta = {
  systemName: string;
  diagramType: string;
  variant: string;
  pageSize: "A4" | "A3";
  orientation: "portrait" | "landscape";
};

function clampText(value: string, max = 80) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function svgToPdf(svgText: string, meta: PdfMeta) {
  const sanitized = sanitiseSvgStrict(svgText);
  if (!sanitized.ok) return { ok: false as const, reason: sanitized.reason };

  const base = PAGE_SIZES[meta.pageSize];
  const pageW = meta.orientation === "landscape" ? base.h : base.w;
  const pageH = meta.orientation === "landscape" ? base.w : base.h;

  const margin = 36;
  const headerH = 36;
  const footerH = 24;
  const contentW = pageW - margin * 2;
  const contentH = pageH - margin * 2 - headerH - footerH;

  // Create PDF (pure JS, deterministic, no network).
  const doc = new PDFDocument({ size: [pageW, pageH], margin: 0, autoFirstPage: true });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  // White background.
  doc.save();
  doc.rect(0, 0, pageW, pageH).fill("#ffffff");
  doc.restore();

  // Title block.
  const title = `${clampText(meta.systemName)} · ${clampText(meta.diagramType)} · ${clampText(meta.variant)}`;
  const date = new Date().toLocaleDateString();
  doc.fillColor("#0f172a");
  doc.font("Helvetica-Bold").fontSize(12).text(title, margin, margin + 10, { width: pageW - margin * 2 });
  doc.fillColor("#334155");
  doc.font("Helvetica").fontSize(10).text(date, margin, margin + 10, { width: pageW - margin * 2, align: "right" });

  // Render SVG into content area.
  try {
    svgToPdfKit(doc as any, sanitized.svg, margin, margin + headerH, {
      width: contentW,
      height: contentH,
      preserveAspectRatio: "xMidYMid meet",
      useCSS: true,
    });
  } catch (err) {
    doc.end();
    return { ok: false as const, reason: "PDF export failed. Please try again." };
  }

  // Footer.
  doc.fillColor("#334155");
  doc.font("Helvetica").fontSize(9).text("Generated with RansfordsNotes", margin, pageH - margin - 10, {
    width: pageW - margin * 2,
  });

  doc.end();
  const bytes = await done;
  return { ok: true as const, bytes };
}


