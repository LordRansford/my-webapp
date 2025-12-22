import type { SafetyCaps } from "../types";

const URL_REGEX = /\bhttps?:\/\/\S+|\bwww\.\S+/i;
const HTML_REGEX = /<[^>]*>/;

export type SanitizedLabelResult =
  | { ok: true; value: string }
  | { ok: false; reason: string };

export function sanitizeLabel(raw: unknown): SanitizedLabelResult {
  const value = String(raw ?? "").trim();
  if (!value) return { ok: false, reason: "Empty label." };
  if (HTML_REGEX.test(value)) return { ok: false, reason: "HTML is not allowed in labels." };
  if (URL_REGEX.test(value)) return { ok: false, reason: "URLs are not allowed in labels." };
  // Disallow user provided Mermaid directives by blocking typical tokens.
  const lowered = value.toLowerCase();
  const blocked = ["graph", "flowchart", "sequencediagram", "classdef", "click", "style", "subgraph", "%%", "linkstyle"];
  if (blocked.some((b) => lowered.includes(b))) return { ok: false, reason: "Mermaid directives are not allowed in labels." };
  // Keep labels short and predictable.
  const compact = value.replace(/\s+/g, " ").slice(0, 80);
  return { ok: true, value: compact };
}

export function capList<T>(items: T[], cap: number) {
  return (items || []).slice(0, Math.max(0, cap));
}

export function enforceCaps({ nodes, edges, caps }: { nodes: number; edges: number; caps: SafetyCaps }) {
  const omissions: string[] = [];
  if (nodes > caps.maxNodes) omissions.push(`Node cap reached (${caps.maxNodes}). Extra items were omitted.`);
  if (edges > caps.maxEdges) omissions.push(`Edge cap reached (${caps.maxEdges}). Extra flows were omitted.`);
  return omissions;
}


