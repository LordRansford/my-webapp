import type { ArchitectureDiagramInput } from "../schema";
import type { VariantConfig } from "../types";
import { capList, sanitizeLabel } from "./safety";

function mermaidNode(id: string, label: string) {
  // Use bracket style for neutral nodes.
  return `${id}["${label}"]`;
}

export function generateContextDiagram(input: ArchitectureDiagramInput, variant: VariantConfig) {
  const omissions: string[] = [];
  const assumptions: string[] = [
    "Context diagram shows people, external systems, and the system under review only.",
    "Relationships are derived from provided flows and actor lists.",
  ];

  const systemLabelRaw = variant.plainLanguage ? `${input.systemName} (the system)` : input.systemName;
  const sysSan = sanitizeLabel(systemLabelRaw);
  const systemLabel = sysSan.ok ? sysSan.value : "System";
  if (!sysSan.ok) omissions.push(`System name omitted: ${sysSan.reason}`);

  const users = capList(input.users || [], variant.caps.maxNodes).map((u) => u.name);
  const externals = capList(input.externalSystems || [], variant.caps.maxNodes).map((s) => s.name);

  const userNodes: { id: string; label: string }[] = [];
  const externalNodes: { id: string; label: string }[] = [];

  const sortedUsers = [...users].map((x) => String(x || "")).filter(Boolean).sort((a, b) => a.localeCompare(b));
  const sortedExternal = [...externals].map((x) => String(x || "")).filter(Boolean).sort((a, b) => a.localeCompare(b));

  sortedUsers.forEach((name, idx) => {
    const san = sanitizeLabel(name);
    if (!san.ok) {
      omissions.push(`User omitted (${name}): ${san.reason}`);
      return;
    }
    userNodes.push({ id: `U${idx + 1}`, label: variant.minimalLabels ? san.value.slice(0, 24) : san.value });
  });

  sortedExternal.forEach((name, idx) => {
    const san = sanitizeLabel(name);
    if (!san.ok) {
      omissions.push(`External system omitted (${name}): ${san.reason}`);
      return;
    }
    externalNodes.push({ id: `X${idx + 1}`, label: variant.minimalLabels ? san.value.slice(0, 24) : san.value });
  });

  // Derive edges from flows: if from/to matches a user or external, link to system.
  const flowPairs = (input.flows || []).map((f) => [String(f.from || ""), String(f.to || "")]);
  const nodeByLabel = new Map<string, string>();
  userNodes.forEach((n) => nodeByLabel.set(n.label, n.id));
  externalNodes.forEach((n) => nodeByLabel.set(n.label, n.id));

  const rawActors = new Set<string>([...sortedUsers, ...sortedExternal].map((x) => x.trim()));
  const systemId = "SYS";

  const edges = new Set<string>();
  for (const [fromRaw, toRaw] of flowPairs) {
    const from = fromRaw.trim();
    const to = toRaw.trim();
    if (!from || !to) continue;
    // actor -> system
    if (rawActors.has(from) && (to === input.systemName || !rawActors.has(to))) {
      const fromSan = sanitizeLabel(from);
      if (fromSan.ok) edges.add(`${fromSan.value} -> ${systemLabel}`);
    }
    // system -> actor
    if (rawActors.has(to) && (from === input.systemName || !rawActors.has(from))) {
      const toSan = sanitizeLabel(to);
      if (toSan.ok) edges.add(`${systemLabel} -> ${toSan.value}`);
    }
  }

  const mermaidLines: string[] = [];
  mermaidLines.push("flowchart LR");
  mermaidLines.push("%% Deterministic context diagram (Mermaid)");
  mermaidLines.push(`${systemId}["${systemLabel}"]`);

  userNodes.forEach((n) => mermaidLines.push(mermaidNode(n.id, n.label)));
  externalNodes.forEach((n) => mermaidLines.push(mermaidNode(n.id, n.label)));

  // Deterministic edges: connect every user/external to SYS if we have no explicit edges.
  if (edges.size === 0) {
    [...userNodes, ...externalNodes].forEach((n) => {
      mermaidLines.push(`${n.id} --> ${systemId}`);
    });
    if (userNodes.length + externalNodes.length === 0) omissions.push("No users or external systems were provided for context.");
  } else {
    // Use label matching by sanitized label; fallback to connect to SYS.
    const labelToId = new Map<string, string>();
    userNodes.forEach((n) => labelToId.set(n.label, n.id));
    externalNodes.forEach((n) => labelToId.set(n.label, n.id));
    const sortedEdges = Array.from(edges).sort((a, b) => a.localeCompare(b));
    sortedEdges.forEach((e) => {
      const [fromLabel, toLabel] = e.split(" -> ").map((x) => x.trim());
      const fromId = labelToId.get(variant.minimalLabels ? fromLabel.slice(0, 24) : fromLabel);
      const toId = toLabel === systemLabel ? systemId : labelToId.get(variant.minimalLabels ? toLabel.slice(0, 24) : toLabel);
      if (fromId && toId) mermaidLines.push(`${fromId} --> ${toId}`);
    });
  }

  // Keep a calm, consistent style.
  mermaidLines.push("classDef sys fill:#0f172a,color:#ffffff,stroke:#0f172a;");
  mermaidLines.push("class SYS sys;");

  return {
    mermaid: mermaidLines.join("\n"),
    assumptions,
    omissions,
  };
}


