import type { ArchitectureDiagramInput } from "../schema";
import type { VariantConfig } from "../types";
import { capList, enforceCaps, sanitizeLabel } from "./safety";

export function generateDfdDiagram(input: ArchitectureDiagramInput, variant: VariantConfig) {
  const omissions: string[] = [];
  const assumptions: string[] = [
    "DFD shows processes, data stores, external entities, and flows only.",
    "Sensitive marking is taken only from the provided flows and selected data categories.",
  ];

  const lines: string[] = [];
  lines.push("flowchart LR");
  lines.push("%% Deterministic DFD (Mermaid)");

  const processes = capList(input.containers || [], variant.caps.maxNodes)
    .filter((c) => c.type !== "database")
    .map((c) => c.name)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));

  const stores = capList(input.dataStores || [], variant.caps.maxNodes)
    .map((s) => s.name)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));

  const externals = capList(input.externalSystems || [], variant.caps.maxNodes)
    .map((s) => s.name)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));

  const trustBoundaries = (input.security?.trustBoundaries || []).map((b) => String(b || "").trim()).filter(Boolean);
  const showBoundaries =
    (input.goal === "security-review" || input.goal === "data-review" || variant.emphasizeSecurity) &&
    (trustBoundaries.length > 0 || input.security?.hasNoTrustBoundariesConfirmed);

  const procNodes: { id: string; label: string }[] = [];
  const storeNodes: { id: string; label: string }[] = [];
  const extNodes: { id: string; label: string }[] = [];

  processes.forEach((p, idx) => {
    const san = sanitizeLabel(p);
    if (!san.ok) {
      omissions.push(`Process omitted (${p}): ${san.reason}`);
      return;
    }
    procNodes.push({ id: `P${idx + 1}`, label: variant.minimalLabels ? san.value.slice(0, 24) : san.value });
  });

  stores.forEach((s, idx) => {
    const san = sanitizeLabel(s);
    if (!san.ok) {
      omissions.push(`Data store omitted (${s}): ${san.reason}`);
      return;
    }
    storeNodes.push({ id: `D${idx + 1}`, label: variant.minimalLabels ? san.value.slice(0, 24) : san.value });
  });

  externals.forEach((e, idx) => {
    const san = sanitizeLabel(e);
    if (!san.ok) {
      omissions.push(`External entity omitted (${e}): ${san.reason}`);
      return;
    }
    extNodes.push({ id: `E${idx + 1}`, label: variant.minimalLabels ? san.value.slice(0, 24) : san.value });
  });

  const labelToId = new Map<string, string>();
  [...procNodes, ...storeNodes, ...extNodes].forEach((n) => labelToId.set(n.label, n.id));

  const addNodes = () => {
    procNodes.forEach((n) => lines.push(`${n.id}["${n.label}"]`));
    storeNodes.forEach((n) => lines.push(`${n.id}[("${n.label}")]`));
    extNodes.forEach((n) => lines.push(`${n.id}["${n.label}"]`));
  };

  if (showBoundaries) {
    lines.push('subgraph TB1["Trust boundary"]');
    addNodes();
    lines.push("end");
    if (trustBoundaries.length === 0 && input.security?.hasNoTrustBoundariesConfirmed) {
      omissions.push("Trust boundaries were confirmed as none.");
    }
  } else {
    addNodes();
    if (variant.emphasizeSecurity) omissions.push("No trust boundaries were provided.");
  }

  const edges: string[] = [];
  const sensitiveIdx: number[] = [];

  const sortedFlows = capList(input.flows || [], variant.caps.maxEdges).slice().sort((a, b) => `${a.from}->${a.to}`.localeCompare(`${b.from}->${b.to}`));
  sortedFlows.forEach((f) => {
    const fromSan = sanitizeLabel(f.from);
    const toSan = sanitizeLabel(f.to);
    if (!fromSan.ok || !toSan.ok) return;
    const fromLabel = variant.minimalLabels ? fromSan.value.slice(0, 24) : fromSan.value;
    const toLabel = variant.minimalLabels ? toSan.value.slice(0, 24) : toSan.value;
    const fromId = labelToId.get(fromLabel);
    const toId = labelToId.get(toLabel);
    if (!fromId || !toId) return;

    const purposeSan = sanitizeLabel(f.purpose);
    const purpose = purposeSan.ok ? (variant.minimalLabels ? purposeSan.value.slice(0, 18) : purposeSan.value) : "flow";
    const edge = `${fromId} -->|${purpose}| ${toId}`;
    if (variant.emphasizeData && input.dataTypes?.length) {
      const suffix = ` (${input.dataTypes.join(", ")})`;
      edges.push(`${fromId} -->|${purpose}${suffix}| ${toId}`);
    } else {
      edges.push(edge);
    }
    if ((input.goal === "security-review" || variant.emphasizeSecurity) && f.sensitive) {
      sensitiveIdx.push(edges.length - 1);
    }
  });

  edges.slice(0, variant.caps.maxEdges).forEach((e) => lines.push(e));
  if (edges.length === 0) omissions.push("No flows could be rendered in the DFD. Add flows that connect known entities.");

  // Security variant: visually distinct sensitive flows.
  if (input.goal === "security-review" || variant.emphasizeSecurity) {
    // Default edges.
    lines.push("linkStyle default stroke:#334155,stroke-width:2px;");
    // Highlight sensitive edges by index (mermaid uses link order).
    sensitiveIdx.slice(0, 40).forEach((idx) => {
      lines.push(`linkStyle ${idx} stroke:#b91c1c,stroke-width:3px;`);
    });
    if (sensitiveIdx.length > 0) {
      lines.push("%% Sensitive flows are highlighted for review.");
      assumptions.push("Sensitive flows are highlighted based on the sensitive toggle in flows.");
    } else if (input.dataTypes?.length) {
      omissions.push("No flows were marked as sensitive.");
    }
  }

  lines.push("classDef store fill:#f8fafc,stroke:#64748b,color:#0f172a;");
  storeNodes.forEach((n) => lines.push(`class ${n.id} store;`));

  const nodeCount = procNodes.length + storeNodes.length + extNodes.length;
  const edgeCount = edges.slice(0, variant.caps.maxEdges).length;
  omissions.push(...enforceCaps({ nodes: nodeCount, edges: edgeCount, caps: variant.caps }));

  return { mermaid: lines.join("\n"), assumptions, omissions };
}


