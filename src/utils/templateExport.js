import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Document, HeadingLevel, Packer, Paragraph, TextRun, ImageRun } from "docx";
import * as XLSX from "xlsx";
import { applyDocxMetadata, applyPdfMetadata, applyXlsxMetadata, buildTemplateMetadata } from "./templateMetadata";
import { recordExport } from "@/lib/history/exportHistory";
import { unlockCommercialNoAttribution } from "@/lib/entitlements/entitlements";
import { captureElementImage, sliceImageDataUrl } from "./exportCapture";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "template";

const wrapLines = (text, maxChars = 90) => {
  if (!text) return [""];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const words = line.split(" ");
      const lines = [];
      let current = "";
      words.forEach((word) => {
        if ((current + " " + word).trim().length > maxChars) {
          lines.push(current.trim());
          current = word;
        } else {
          current = `${current} ${word}`.trim();
        }
      });
      if (current) lines.push(current.trim());
      return lines;
    });
};

const normalizeSections = (sections) => {
  if (!Array.isArray(sections)) return [];
  return sections
    .filter(Boolean)
    .map((section) => ({
      heading: String(section.heading || "Untitled section"),
      body: Array.isArray(section.body)
        ? section.body.map((item) => String(item ?? ""))
        : String(section.body ?? "No details provided."),
    }));
};

async function tryCapture({ captureSelector, captureElement, scale }) {
  if (typeof window === "undefined") return null;
  const selectors = Array.isArray(captureSelector) ? captureSelector : [captureSelector];
  let target = captureElement?.();
  if (!target) {
    for (const sel of selectors) {
      if (!sel) continue;
      const node = document.querySelector(sel);
      if (node) {
        target = node;
        break;
      }
    }
  }
  if (!target) target = document.body;
  try {
    return await captureElementImage(target, { scale });
  } catch (error) {
    console.warn("Capture failed, falling back to structured export", error);
    return null;
  }
}

async function exportPdf({ title, category, sections, footerLine, metadata }) {
  const safeSections = normalizeSections(sections);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const margin = 40;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const compiledMetadata = applyPdfMetadata(pdfDoc, metadata);

  let y = height - margin;

  const drawText = (text, size = 12, opts = {}) => {
    const lines = wrapLines(text, 95);
    lines.forEach((line) => {
      page.drawText(line, {
        x: margin,
        y,
        size,
        font,
        color: opts.color || rgb(0.15, 0.16, 0.18),
      });
      y -= size + 4;
    });
    y -= 6;
  };

  const drawHeading = (text, size = 18) => {
    drawText(text, size, { color: rgb(0.1, 0.12, 0.2) });
  };

  drawHeading(title);
  drawText(`${category}`);
  drawText(`Exported: ${new Date(compiledMetadata.exportedAt).toLocaleString()}`, 10);
  y -= 6;

  safeSections.forEach((section) => {
    // section card background
    const boxTop = y;
    const bodyLines = Array.isArray(section.body) ? section.body : [section.body];
    const estimatedHeight = bodyLines.reduce((acc, line) => acc + wrapLines(line, 95).length * 16 + 12, 30);
    const boxHeight = Math.min(Math.max(estimatedHeight, 60), y - margin - 30);

    page.drawRectangle({
      x: margin - 6,
      y: y - boxHeight,
      width: width - margin * 2 + 12,
      height: boxHeight,
      color: rgb(0.95, 0.97, 1),
      borderColor: rgb(0.82, 0.86, 0.94),
      borderWidth: 0.6,
    });

    y -= 12;
    drawHeading(section.heading, 14);
    bodyLines.forEach((item) => {
      drawText(item, 12);
    });
    y = y - 2;
    // ensure spacing between cards
    y = Math.max(y, boxTop - boxHeight - 10);
  });

  if (footerLine) {
    y = Math.max(y, margin + 60);
    y -= 10;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(0.8, 0.82, 0.86),
    });
    y -= 16;
    drawText(footerLine, 11, { color: rgb(0.25, 0.28, 0.32) });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

async function exportPdfFromImage({ image, metadata }) {
  const pdfDoc = await PDFDocument.create();
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89;
  const sliceHeightPx = Math.ceil((pageHeight / pageWidth) * image.width); // proportional slice
  const slices = await sliceImageDataUrl(image.dataUrl, image.width, image.height, sliceHeightPx);
  applyPdfMetadata(pdfDoc, metadata);

  for (const slice of slices) {
    const pngBytes = await (await fetch(slice.dataUrl)).arrayBuffer();
    const embedded = await pdfDoc.embedPng(pngBytes);
    const scale = pageWidth / slice.width;
    const scaledHeight = slice.height * scale;
    const page = pdfDoc.addPage([pageWidth, scaledHeight]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: scaledHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

async function exportDocx({ title, category, sections, footerLine, metadata }) {
  const safeSections = normalizeSections(sections);
  const doc = new Document({
    creator: metadata.author,
    description: title,
    title,
    sections: [],
  });

  applyDocxMetadata(doc, metadata);

  const paragraphs = [];
  paragraphs.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
    })
  );
  paragraphs.push(
    new Paragraph({
      text: `${category}`,
      heading: HeadingLevel.HEADING_3,
    })
  );
  paragraphs.push(
    new Paragraph({
      text: `Exported: ${new Date(metadata.exportedAt).toLocaleString()}`,
    })
  );

  safeSections.forEach((section) => {
    paragraphs.push(
      new Paragraph({
        text: section.heading,
        heading: HeadingLevel.HEADING_2,
      })
    );
    const bodyItems = Array.isArray(section.body) ? section.body : [section.body];
    bodyItems.forEach((item) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: item, size: 24 })],
          spacing: { before: 120, after: 240 },
          shading: {
            type: "clear",
            fill: "F4F8FF",
            color: "F4F8FF",
          },
        })
      );
    });
  });

  if (footerLine) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: footerLine, italics: true, size: 20 })],
        spacing: { before: 200, after: 100 },
      })
    );
  }

  doc.addSection({
    properties: {},
    children: paragraphs,
  });

  const blob = await Packer.toBlob(doc);
  return new Blob([blob], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

async function exportDocxFromImage({ image, metadata }) {
  const slices = await sliceImageDataUrl(image.dataUrl, image.width, image.height, image.width * 1); // vertical slices of full width
  const children = [];
  for (const slice of slices) {
    const res = await fetch(slice.dataUrl);
    const buffer = await res.arrayBuffer();
    const width = 600;
    const scale = width / slice.width;
    const height = slice.height * scale;
    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: buffer,
            transformation: { width, height },
          }),
        ],
      })
    );
  }

  const doc = new Document({
    creator: metadata.author,
    description: metadata.title,
    title: metadata.title,
    sections: [
      {
        children,
      },
    ],
  });
  applyDocxMetadata(doc, metadata);
  const blob = await Packer.toBlob(doc);
  return new Blob([blob], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

async function exportPngFromImage({ image }) {
  const blob = await image.toBlob();
  return new Blob([blob], { type: "image/png" });
}

function exportXlsx({ title, category, sections, version, intendedUse, includeAttribution, footerLine, metadata }) {
  const safeSections = normalizeSections(sections);
  const wb = XLSX.utils.book_new();
  applyXlsxMetadata(wb, metadata);

  const rows = [
    ["Title", title],
    ["Category", category],
    ["Version", version],
    ["Intended use", intendedUse],
    ["Exported at", new Date(metadata.exportedAt).toLocaleString()],
  ];
  if (footerLine) {
    rows.push(["Footer", footerLine]);
  }
  const summarySheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const sectionRows = [["Section", "Details"]];
  safeSections.forEach((section) => {
    const items = Array.isArray(section.body) ? section.body : [section.body];
    items.forEach((item, index) => {
      sectionRows.push([index === 0 ? section.heading : "", item]);
    });
  });
  const detailSheet = XLSX.utils.aoa_to_sheet(sectionRows);
  XLSX.utils.book_append_sheet(wb, detailSheet, "Details");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

export async function exportTemplate({
  format,
  templateId,
  title,
  category,
  sections,
  footerText,
  version = "1.0.0",
  intendedUse = "internal",
  includeAttribution = true,
  captureSelector = [".template-layout", ".template-capture-root"],
  captureElement,
}) {
  const exportedAt = new Date().toISOString();
  const metadata = buildTemplateMetadata({ title, category, version, exportedAt });
  const safeSections = normalizeSections(sections);
  const sectionsForExport =
    safeSections.length > 0
      ? safeSections
      : [{ heading: "Notes", body: "No content captured yet. Add details before exporting for best results." }];
  const footerLine = includeAttribution
    ? `${footerText} | Version ${version} | Exported ${new Date(exportedAt).toLocaleString()} | Use: ${intendedUse}`
    : `Version ${version} | Exported ${new Date(exportedAt).toLocaleString()} | Use: ${intendedUse}`;

  if (intendedUse === "commercial-no-attr" && !unlockCommercialNoAttribution()) {
    throw new Error("Commercial export without attribution requires a donation or permission token.");
  }

  const captured = await tryCapture({ captureSelector, captureElement, scale: 2.5 });

  let blob;
  if (format === "pdf") {
    if (captured) {
      blob = await exportPdfFromImage({ image: captured, metadata });
    } else {
      blob = await exportPdf({
        title,
        category,
        sections: sectionsForExport,
        footerLine,
        metadata,
      });
    }
  } else if (format === "docx") {
    if (captured) {
      blob = await exportDocxFromImage({ image: captured, metadata });
    } else {
      blob = await exportDocx({
        title,
        category,
        sections: sectionsForExport,
        footerLine,
        metadata,
      });
    }
  } else if (format === "xlsx") {
    blob = exportXlsx({
      title,
      category,
      sections: sectionsForExport,
      version,
      intendedUse,
      includeAttribution,
      footerLine,
      metadata,
    });
  } else if (format === "png") {
    if (!captured) {
      throw new Error("Unable to capture template for PNG export. Scroll to top and try again.");
    }
    blob = await exportPngFromImage({ image: captured });
  } else {
    throw new Error(`Unsupported export format: ${format}`);
  }

  recordExport({ templateId, format, intendedUse, includeAttribution, exportedAt });
  const filename = `${slugify(title)}-${format}.${format}`;
  saveAs(blob, filename);
  return { exportedAt };
}
