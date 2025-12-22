import type { ArchitectureDiagramInput } from "../schema";
import type { VariantConfig } from "../types";
import { capList, sanitizeLabel } from "./safety";

function shortType(type: string) {
  if (type === "ui") return "UI";
  if (type === "api") return "API";
  if (type === "worker") return "Worker";
  if (type === "database") return "DB";
  if (type === "third-party") return "3rd party";
  return type;
}

export function generateContainerDiagram(input: ArchitectureDiagramInput, variant: VariantConfig) {
  const omissions: string[] = [];
  const assumptions: string[] = [
    "Container diagram shows deployable containers and external systems only.",
    "Links are derived from provided flows. No additional dependencies are inferred.",
  ];

  const containers = capList(input.containers || [], variant.caps.maxNodes)
    .map((c) => ({ name: c.name, type: c.type, description: c.description }))
    .filter((c) => String(c.name || "").trim().length > 0)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));

  const externals = capList(input.externalSystems || [], variant.caps.maxNodes)
    .map((s) => s.name)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));

  const sysSan = sanitizeLabel(input.systemName);
  const sysName = sysSan.ok ? sysSan.value : "System";
  const sysId = "SYS";

  const nodes: { id: string; label: string; kind: "container" | "external" }[] = [];
  containers.forEach((c, idx) => {
    const san = sanitizeLabel(c.name);
    if (!san.ok) {
      omissions.push(`Container omitted (${c.name}): ${san.reason}`);
      return;
    }
    const labelBase = variant.minimalLabels ? san.value.slice(0, 24) : san.value;
    const typeSuffix = variant.plainLanguage ? "" : ` (${shortType(String(c.type))})`;
    nodes.push({ id: `C${idx + 1}`, label: `${labelBase}${typeSuffix}`, kind: "container" });
  });

  externals.forEach((name, idx) => {
    const san = sanitizeLabel(name);
    if (!san.ok) {
      omissions.push(`External system omitted (${name}): ${san.reason}`);
      return;
    }
    nodes.push({ id: `X${idx + 1}`, label: variant.minimalLabels ? san.value.slice(0, 24) : san.value, kind: "external" });
  });

  // Deterministic edges from flows: only connect between known nodes.
  const labelToId = new Map<string, string>();
  nodes.forEach((n) => labelToId.set(n.label.replace(/\s+\(.+\)$/, ""), n.id)); // strip type suffix for matching

  const edges = new Set<string>();
  for (const f of input.flows || []) {
    const from = String(f.from || "").trim();
    const to = String(f.to || "").trim();
    if (!from || !to) continue;
    const fromSan = sanitizeLabel(from);
    const toSan = sanitizeLabel(to);
    const fromKey = fromSan.ok ? (variant.minimalLabels ? fromSan.value.slice(0, 24) : fromSan.value) : "";
    const toKey = toSan.ok ? (variant.minimalLabels ? toSan.value.slice(0, 24) : toSan.value) : "";
    const fromId = labelToId.get(fromKey);
    const toId = labelToId.get(toKey);
    if (fromId && toId) edges.add(`${fromId}-->${toId}`);
  }

  const lines: string[] = [];
  lines.push("flowchart LR");
  lines.push("%% Deterministic container diagram (Mermaid)");
  lines.push(`${sysId}["${sysName}"]`);

  if (nodes.length === 0) {
    omissions.push("No containers were provided.");
  }

  // Group by type in stakeholder mode to reduce noise.
  const containerNodes = nodes.filter((n) => n.kind === "container");
  const externalNodes = nodes.filter((n) => n.kind === "external");

  if (variant.plainLanguage) {
    lines.push("subgraph Internal[Inside the system]");
    containerNodes.forEach((n) => lines.push(`${n.id}["${n.label}"]`));
    lines.push("end");
    if (externalNodes.length) {
      lines.push("subgraph External[Outside dependencies]");
      externalNodes.forEach((n) => lines.push(`${n.id}["${n.label}"]`));
      lines.push("end");
    }
  } else {
    containerNodes.forEach((n) => lines.push(`${n.id}["${n.label}"]`));
    externalNodes.forEach((n) => lines.push(`${n.id}["${n.label}"]`));
  }

  // Connect system to all containers if no edges.
  if (edges.size === 0) {
    containerNodes.forEach((n) => lines.push(`${sysId} --> ${n.id}`));
    externalNodes.forEach((n) => lines.push(`${n.id} --> ${sysId}`));
    if (containerNodes.length + externalNodes.length === 0) omissions.push("No nodes available to connect in container diagram.");
  } else {
    Array.from(edges)
      .sort((a, b) => a.localeCompare(b))
      .forEach((e) => lines.push(e));
  }

  // Styling
  lines.push("classDef sys fill:#0f172a,color:#ffffff,stroke:#0f172a;");
  lines.push("classDef ext fill:#eef2ff,stroke:#64748b,color:#0f172a;");
  lines.push("class SYS sys;");
  externalNodes.forEach((n) => lines.push(`class ${n.id} ext;`));

  return { mermaid: lines.join("\n"), assumptions, omissions };
}


