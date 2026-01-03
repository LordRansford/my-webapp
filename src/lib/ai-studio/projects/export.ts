/**
 * Export helpers for AI Studio projects (client-side).
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import JSZip from "jszip";
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

async function buildProjectPdfBytes(project: AIStudioProject) {
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
  return bytes;
}

export async function exportProjectAsPdf(project: AIStudioProject) {
  const bytes = await buildProjectPdfBytes(project);
  // pdf-lib returns Uint8Array<ArrayBufferLike> in some environments; BlobPart expects ArrayBuffer.
  const safeArrayBuffer = Uint8Array.from(bytes).buffer;
  downloadBlob(
    `${project.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${project.id}.pdf`,
    new Blob([safeArrayBuffer], { type: "application/pdf" })
  );
}

function checklistForExample(exampleId: string) {
  if (exampleId === "story-generator") {
    return [
      "Decide your audience (children, teens, adults).",
      "Define tone rules (kind, non-violent, no personal data).",
      "Add a 'character sheet' section to the prompt.",
      "Add a 'length' parameter (short/medium/long) and test cost vs quality.",
      "Export a few runs and keep the best as a portfolio pack.",
    ];
  }
  if (exampleId === "homework-helper") {
    return [
      "Choose a narrow scope (e.g., linear equations only) and state it clearly.",
      "Always show steps and a final check step (substitution).",
      "Add friendly hints before revealing the answer.",
      "Create 10 sample questions and save the best outputs.",
      "Add a “teacher mode” vs “student mode” toggle later.",
    ];
  }
  if (exampleId === "customer-support-bot") {
    return [
      "Write a safe policy (no sensitive data, no account takeover advice).",
      "Add an intent classifier (returns/refunds/shipping/login).",
      "Add a knowledge base stub (static FAQ snippets) and cite which snippet was used.",
      "Add escalation rules (when to hand off to human).",
      "Export a set of response templates for a portfolio.",
    ];
  }
  return ["Add a clear goal for this project.", "Make one small improvement, then re-run and compare outputs.", "Export a pack and share it."];
}

function artefactMarkdown(project: AIStudioProject) {
  const run = project.lastRun;
  const header = `# ${project.title}\n\nTemplate: \`${project.exampleId}\`\n\n`;
  if (!run) {
    return `${header}No runs yet.\n`;
  }
  const receipt = run.receipt;
  const receiptLine = receipt
    ? `Receipt: mode=${receipt.mode} durationMs=${receipt.durationMs} creditsCharged=${receipt.creditsCharged}\n\n`
    : "Receipt: not available\n\n";
  return `${header}## Latest run\n\nRan at: ${run.ranAt}\n\n${receiptLine}## Output\n\n\`\`\`json\n${JSON.stringify(run.output, null, 2)}\n\`\`\`\n`;
}

export async function exportProjectAsPackZip(project: AIStudioProject) {
  const slug = project.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const base = `${slug}-${project.id}`;
  const zip = new JSZip();

  const runs = Array.isArray(project.runs) ? project.runs : project.lastRun ? [project.lastRun] : [];

  zip.file("README.md", `# ${project.title}\n\nTemplate: \`${project.exampleId}\`\n\n## What this is\n\nThis is an AI Studio project pack export.\n\n## How to import\n\n1. Go to \`/ai-studio/projects\`\n2. Click **Import project JSON**\n3. Select \`project.json\`\n\n## What’s inside\n\n- \`project.json\`: full project (local-first) export\n- \`project-summary.pdf\`: PDF summary\n- \`run-history.json\`: recent runs (output + receipts)\n- \`NEXT_STEPS.md\`: practical next steps\n`);

  zip.file("project.json", JSON.stringify(project, null, 2));
  zip.file("run-history.json", JSON.stringify({ projectId: project.id, runs }, null, 2));

  const checklist = checklistForExample(project.exampleId);
  zip.file("NEXT_STEPS.md", `# Next steps\n\n${checklist.map((c) => `- ${c}`).join("\n")}\n`);
  zip.file("ARTEFACT.md", artefactMarkdown(project));

  const pdfBytes = await buildProjectPdfBytes(project);
  zip.file("project-summary.pdf", pdfBytes);

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(`${base}.zip`, blob);
}

