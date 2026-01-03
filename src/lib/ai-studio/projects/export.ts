/**
 * Export helpers for AI Studio projects (client-side).
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { AIStudioProject } from "./store";

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportProjectAsJson(project: AIStudioProject) {
  const payload = JSON.stringify(project, null, 2);
  downloadBlob(`${project.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${project.id}.json`, new Blob([payload], { type: "application/json" }));
}

export async function exportProjectAsPdf(project: AIStudioProject) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const left = 50;
  const line = 14;

  const draw = (text: string, opts?: { bold?: boolean; size?: number }) => {
    page.drawText(text, {
      x: left,
      y,
      size: opts?.size ?? 12,
      font: opts?.bold ? fontBold : font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= line;
  };

  draw("AI Studio Project Summary", { bold: true, size: 16 });
  y -= 8;

  draw(`Title: ${project.title}`, { bold: true });
  draw(`Project ID: ${project.id}`);
  draw(`Template: ${project.exampleId}`);
  draw(`Audience: ${project.audience} · Difficulty: ${project.difficulty}`);
  draw(`Created: ${project.createdAt}`);
  draw(`Updated: ${project.updatedAt}`);
  y -= 10;

  draw("Latest run", { bold: true });
  if (project.lastRun) {
    draw(`Ran at: ${project.lastRun.ranAt}`);
    if (project.lastRun.receipt) {
      const r = project.lastRun.receipt;
      draw(`Mode: ${r.mode}`);
      draw(`Duration: ${r.durationMs} ms`);
      draw(`Input: ${r.inputBytes} bytes · Output: ${r.outputBytes} bytes`);
      draw(`Credits charged: ${r.creditsCharged}`);
    } else {
      draw("Receipt: not available");
    }
  } else {
    draw("No runs yet");
  }

  y -= 10;
  draw("Notes", { bold: true });
  draw("This export contains project configuration and the latest run summary only.");

  const bytes = await doc.save();
  downloadBlob(`${project.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${project.id}.pdf`, new Blob([bytes], { type: "application/pdf" }));
}

