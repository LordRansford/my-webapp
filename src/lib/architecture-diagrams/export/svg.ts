import sanitizeHtml from "sanitize-html";
import { buildDiagramFileBase } from "./filename";

const MAX_SVG_CHARS = 250_000;

const SAFE_SVG_TAGS = [
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "defs",
  "marker",
  "title",
  "desc",
];

const SAFE_SVG_ATTR = [
  "xmlns",
  "width",
  "height",
  "viewBox",
  "preserveAspectRatio",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "opacity",
  "transform",
  "d",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "rx",
  "ry",
  "r",
  "cx",
  "cy",
  "points",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "dominant-baseline",
  "class",
  "id",
  "style",
];

export function sanitizeSvgForExport(svgText: string) {
  const raw = String(svgText || "");
  if (!raw) return { ok: false as const, reason: "No SVG available to export yet." };
  if (raw.length > MAX_SVG_CHARS) {
    return { ok: false as const, reason: "Export is too large. Try removing some components or flows." };
  }

  const cleaned = sanitizeHtml(raw, {
    allowedTags: SAFE_SVG_TAGS,
    allowedAttributes: { "*": SAFE_SVG_ATTR },
    allowedSchemes: [],
    disallowedTagsMode: "discard",
    allowVulnerableTags: false,
    transformTags: {
      a: () => ({ tagName: "g", attribs: {} }),
    },
    exclusiveFilter: (frame) => frame.tag === "foreignObject" || frame.tag === "script",
  })
    .replace(/\son[a-zA-Z]+\s*=\s*(['"]).*?\1/g, "")
    .replace(/\s(xlink:href|href)\s*=\s*(['"])\s*(javascript:|https?:|data:).*?\2/gi, "");

  return { ok: true as const, value: cleaned };
}

export function addTitleBlockToSvg({
  svgText,
  systemName,
  diagramType,
  variantLabel,
  date = new Date(),
  footerText = "Generated with RansfordsNotes",
}: {
  svgText: string;
  systemName: string;
  diagramType: string;
  variantLabel: string;
  date?: Date;
  footerText?: string;
}) {
  const sanitized = sanitizeSvgForExport(svgText);
  if (!sanitized.ok) return sanitized;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized.value, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return { ok: false as const, reason: "Could not parse SVG for export." };

    const viewBox = svg.getAttribute("viewBox");
    const width = viewBox ? Number(viewBox.split(/\s+/)[2]) : 1200;
    const height = viewBox ? Number(viewBox.split(/\s+/)[3]) : 800;

    // Expand viewBox vertically to make room for header/footer.
    const headerH = 48;
    const footerH = 28;
    const newH = height + headerH + footerH;
    svg.setAttribute("viewBox", `0 0 ${width} ${newH}`);

    const g = doc.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "rn-titleblock");

    const headerBg = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
    headerBg.setAttribute("x", "0");
    headerBg.setAttribute("y", "0");
    headerBg.setAttribute("width", String(width));
    headerBg.setAttribute("height", String(headerH));
    headerBg.setAttribute("fill", "#0f172a");
    g.appendChild(headerBg);

    const title = doc.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "18");
    title.setAttribute("y", "30");
    title.setAttribute("fill", "#ffffff");
    title.setAttribute("font-size", "16");
    title.setAttribute("font-family", "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial");
    title.textContent = `${systemName} · ${diagramType} · ${variantLabel}`;
    g.appendChild(title);

    const subtitle = doc.createElementNS("http://www.w3.org/2000/svg", "text");
    subtitle.setAttribute("x", String(width - 18));
    subtitle.setAttribute("y", "30");
    subtitle.setAttribute("fill", "#cbd5e1");
    subtitle.setAttribute("font-size", "12");
    subtitle.setAttribute("text-anchor", "end");
    subtitle.setAttribute("font-family", "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial");
    subtitle.textContent = new Date(date).toLocaleDateString();
    g.appendChild(subtitle);

    // Shift original contents down.
    const content = doc.createElementNS("http://www.w3.org/2000/svg", "g");
    content.setAttribute("transform", `translate(0 ${headerH})`);
    while (svg.firstChild) {
      const node = svg.firstChild;
      svg.removeChild(node);
      content.appendChild(node);
    }

    const footerBg = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
    footerBg.setAttribute("x", "0");
    footerBg.setAttribute("y", String(headerH + height));
    footerBg.setAttribute("width", String(width));
    footerBg.setAttribute("height", String(footerH));
    footerBg.setAttribute("fill", "#f8fafc");

    const footer = doc.createElementNS("http://www.w3.org/2000/svg", "text");
    footer.setAttribute("x", "18");
    footer.setAttribute("y", String(headerH + height + 18));
    footer.setAttribute("fill", "#334155");
    footer.setAttribute("font-size", "11");
    footer.setAttribute("font-family", "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial");
    footer.textContent = footerText;

    svg.appendChild(g);
    svg.appendChild(content);
    svg.appendChild(footerBg);
    svg.appendChild(footer);

    const serializer = new XMLSerializer();
    const out = serializer.serializeToString(svg);
    return { ok: true as const, value: out };
  } catch (err) {
    return { ok: false as const, reason: "Could not prepare SVG export. Please try again." };
  }
}

export function downloadSvg({
  svgText,
  systemName,
  diagramType,
  variantLabel,
}: {
  svgText: string;
  systemName: string;
  diagramType: string;
  variantLabel: string;
}) {
  const prepared = addTitleBlockToSvg({ svgText, systemName, diagramType, variantLabel });
  if (!prepared.ok) return prepared;

  const base = buildDiagramFileBase({ systemName, diagramType, variant: variantLabel });
  const blob = new Blob([prepared.value], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${base}.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 250);
  return { ok: true as const };
}


