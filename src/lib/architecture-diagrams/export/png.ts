import { buildDiagramFileBase } from "./filename";
import { addTitleBlockToSvg } from "./svg";

const MAX_PNG_PIXELS = 30_000_000; // width * height

export async function downloadPng({
  svgText,
  systemName,
  diagramType,
  variantLabel,
  scale = 2,
}: {
  svgText: string;
  systemName: string;
  diagramType: string;
  variantLabel: string;
  scale?: number;
}) {
  const prepared = addTitleBlockToSvg({ svgText, systemName, diagramType, variantLabel });
  if (!prepared.ok) return prepared;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(prepared.value, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return { ok: false as const, reason: "Could not parse SVG for PNG export." };

    const viewBox = svg.getAttribute("viewBox");
    const width = viewBox ? Number(viewBox.split(/\s+/)[2]) : 1200;
    const height = viewBox ? Number(viewBox.split(/\s+/)[3]) : 800;

    const outW = Math.round(width * scale);
    const outH = Math.round(height * scale);
    if (outW * outH > MAX_PNG_PIXELS) {
      return { ok: false as const, reason: "Export is too large. Try removing some components or flows." };
    }

    const svgBlob = new Blob([prepared.value], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    // No remote fetches: SVG is local blob.
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image load failed"));
    });
    img.src = url;
    await loaded;

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { ok: false as const, reason: "Canvas not available for PNG export." };

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(img, 0, 0, outW, outH);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    URL.revokeObjectURL(url);
    if (!blob) return { ok: false as const, reason: "Could not create PNG. Please try again." };

    const base = buildDiagramFileBase({ systemName, diagramType, variant: variantLabel });
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = `${base}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(dlUrl), 250);
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, reason: "Could not export PNG. Please try again." };
  }
}


