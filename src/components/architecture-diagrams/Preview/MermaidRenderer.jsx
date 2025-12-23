"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import sanitizeHtml from "sanitize-html";

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

function sanitizeSvg(svgText) {
  // sanitize-html expects HTML; SVG is XML-ish but works for our whitelist approach.
  const cleaned = sanitizeHtml(svgText, {
    allowedTags: SAFE_SVG_TAGS,
    allowedAttributes: {
      "*": SAFE_SVG_ATTR,
    },
    // No URLs, no scripts, no iframes, no events.
    allowedSchemes: [],
    disallowedTagsMode: "discard",
    allowVulnerableTags: false,
    transformTags: {
      a: () => ({ tagName: "g", attribs: {} }),
    },
    exclusiveFilter: (frame) => {
      if (frame.tag === "foreignObject") return true;
      if (frame.tag === "script") return true;
      return false;
    },
  });
  // Extra belt-and-braces: strip event handlers and external references.
  return cleaned
    .replace(/\son[a-zA-Z]+\s*=\s*(['"]).*?\1/g, "")
    .replace(/\s(xlink:href|href)\s*=\s*(['"])\s*(javascript:|https?:|data:).*?\2/gi, "");
}

function countMermaidEdges(text) {
  const t = String(text || "");
  const arrows = t.match(/-->|-\.->|->>|->/g) || [];
  return arrows.length;
}

function countMermaidNodes(text) {
  const t = String(text || "");
  // Rough deterministic counts based on our generators.
  const flowNodes = t.match(/\[\"/g) || [];
  const storeNodes = t.match(/\[\(\"/g) || [];
  const participants = t.match(/^\s*participant\s+/gm) || [];
  return flowNodes.length + storeNodes.length + participants.length;
}

function validateMermaidText(text) {
  const t = String(text || "");
  const trimmed = t.trim();
  if (!trimmed) return { ok: false, reason: "No diagram available." };

  // Only allow the diagram types we generate in v1.
  const firstLine = trimmed.split("\n")[0]?.trim() || "";
  const allowedHeaders = ["flowchart", "sequenceDiagram"];
  if (!allowedHeaders.some((h) => firstLine.startsWith(h))) {
    return { ok: false, reason: "Unsupported diagram format." };
  }

  // Explicitly block interactive directives and external links.
  const blocked = ["click ", "href", "link ", "callback", "%%{", "init:", "classDiagram", "stateDiagram", "erDiagram"];
  const lowered = trimmed.toLowerCase();
  if (blocked.some((b) => lowered.includes(b))) {
    return { ok: false, reason: "This diagram includes unsupported directives." };
  }

  return { ok: true };
}

export default function MermaidRenderer({
  mermaidText,
  ariaLabel = "Diagram preview",
  maxChars = 30_000,
  maxNodes = 40,
  maxEdges = 60,
  onRenderedSvg,
}) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [scale, setScale] = useState(1);

  const safeInput = useMemo(() => {
    const text = String(mermaidText || "");
    const fmt = validateMermaidText(text);
    if (!fmt.ok) return { ok: false, reason: fmt.reason };
    if (text.length > maxChars) return { ok: false, reason: "This diagram is too large to render safely. Try removing some components or flows." };
    const nodes = countMermaidNodes(text);
    const edges = countMermaidEdges(text);
    if (nodes > maxNodes || edges > maxEdges) {
      return { ok: false, reason: "This diagram is too large to render safely. Try removing some components or flows." };
    }
    return { ok: true, value: text };
  }, [maxChars, maxEdges, maxNodes, mermaidText]);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      if (!safeInput.ok) {
        setStatus({ state: "error", message: safeInput.reason });
        return;
      }

      setStatus({ state: "loading", message: "" });
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          flowchart: { htmlLabels: false },
          sequence: { actorMargin: 50 },
        });

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, safeInput.value);
        const sanitized = sanitizeSvg(svg);

        if (cancelled) return;
        containerRef.current.innerHTML = sanitized;
        if (typeof onRenderedSvg === "function") onRenderedSvg(sanitized);
        setStatus({ state: "ready", message: "" });
      } catch (err) {
        if (cancelled) return;
        setStatus({ state: "error", message: "Could not render this diagram. Check inputs and try again." });
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [safeInput, onRenderedSvg]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Preview</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.1).toFixed(2))))}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Zoom out
          </button>
          <button
            type="button"
            onClick={() => setScale(1)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(1.8, Number((s + 0.1).toFixed(2))))}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Zoom in
          </button>
        </div>
      </div>

      {status.state === "loading" ? <p className="mt-3 text-sm text-slate-700">Rendering diagram…</p> : null}
      {status.state === "error" ? (
        <p className="mt-3 text-sm font-semibold text-rose-800">{status.message}</p>
      ) : null}

      <div className="mt-4 overflow-auto rounded-2xl border border-slate-100 bg-slate-50/60 p-3" aria-label={ariaLabel}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <div ref={containerRef} />
        </div>
      </div>
    </div>
  );
}


