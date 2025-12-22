import sanitizeHtml from "sanitize-html";

const MAX_SVG_BYTES = 300_000;
const MAX_SVG_NODES = 4500;
const MAX_DIMENSION = 6000;

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

function byteLength(str: string) {
  return Buffer.byteLength(str || "", "utf8");
}

function countNodes(svg: string) {
  const matches = svg.match(/<([a-zA-Z][\w:-]*)\b/g);
  return matches ? matches.length : 0;
}

function getViewBoxDims(svg: string) {
  const m = svg.match(/viewBox\s*=\s*["']\s*([0-9.\s-]+)\s*["']/i);
  if (!m) return { width: 1200, height: 800 };
  const parts = m[1].trim().split(/\s+/).map((x) => Number(x));
  const w = parts[2] || 1200;
  const h = parts[3] || 800;
  return { width: w, height: h };
}

function rejects(svg: string) {
  const lowered = svg.toLowerCase();
  if (lowered.includes("<script")) return "Scripts are not allowed in SVG.";
  if (lowered.includes("<foreignobject")) return "foreignObject is not allowed in SVG.";
  if (/\son[a-zA-Z]+\s*=\s*(['"]).*?\1/.test(svg)) return "Event handlers are not allowed in SVG.";
  if (/\s(xlink:href|href)\s*=\s*(['"])\s*(https?:|data:|javascript:).*?\2/i.test(svg)) return "External references are not allowed in SVG.";
  if (/url\(\s*['"]?\s*https?:/i.test(svg)) return "External URLs are not allowed in SVG styles.";
  if (/@font-face/i.test(svg)) return "Embedded fonts are not allowed in SVG.";
  if (/<font\b/i.test(svg)) return "Font elements are not allowed in SVG.";
  return null;
}

export type SvgSanitiseResult =
  | {
      ok: true;
      svg: string;
      bytes: number;
      nodes: number;
      width: number;
      height: number;
    }
  | { ok: false; reason: string };

export function sanitiseSvgStrict(svgText: unknown): SvgSanitiseResult {
  const raw = String(svgText || "");
  const bytes = byteLength(raw);
  if (!raw) return { ok: false, reason: "SVG is required." };
  if (bytes > MAX_SVG_BYTES) return { ok: false, reason: "This diagram is too large to export as a PDF. Try removing some components or flows." };

  const rejected = rejects(raw);
  if (rejected) return { ok: false, reason: rejected };

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

  const nodes = countNodes(cleaned);
  if (nodes > MAX_SVG_NODES) return { ok: false, reason: "This diagram is too large to export as a PDF. Try removing some components or flows." };

  const { width, height } = getViewBoxDims(cleaned);
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) return { ok: false, reason: "SVG dimensions are too large for PDF export." };

  return { ok: true, svg: cleaned, bytes, nodes, width, height };
}


