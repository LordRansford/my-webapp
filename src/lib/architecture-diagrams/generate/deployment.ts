import type { ArchitectureDiagramInput } from "../schema";
import type { VariantConfig } from "../types";
import { capList, sanitizeLabel } from "./safety";

export function generateDeploymentDiagram(input: ArchitectureDiagramInput, variant: VariantConfig) {
  const omissions: string[] = [];
  const assumptions: string[] = [
    "Deployment diagram is a sketch. Runtime nodes are inferred only by container type groups, not infrastructure specifics.",
    "No cloud provider, regions, or security controls are inferred in v1.",
  ];

  const containers = capList(input.containers || [], variant.caps.maxNodes)
    .map((c) => ({ name: c.name, type: c.type }))
    .filter((c) => String(c.name || "").trim().length > 0)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));

  const externals = capList(input.externalSystems || [], variant.caps.maxNodes)
    .map((s) => s.name)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));

  const lines: string[] = [];
  lines.push("flowchart TB");
  lines.push("%% Deterministic deployment diagram (Mermaid)");

  const sysSan = sanitizeLabel(input.systemName);
  const sysLabel = sysSan.ok ? sysSan.value : "System";
  lines.push(`SYS["${sysLabel}"]`);

  const ui: string[] = [];
  const app: string[] = [];
  const data: string[] = [];
  const worker: string[] = [];
  const other: string[] = [];

  containers.forEach((c) => {
    const san = sanitizeLabel(c.name);
    if (!san.ok) {
      omissions.push(`Container omitted (${c.name}): ${san.reason}`);
      return;
    }
    const label = variant.minimalLabels ? san.value.slice(0, 24) : san.value;
    if (c.type === "ui") ui.push(label);
    else if (c.type === "api") app.push(label);
    else if (c.type === "worker") worker.push(label);
    else if (c.type === "database") data.push(label);
    else other.push(label);
  });

  const addSubgraph = (id: string, title: string, items: string[]) => {
    if (items.length === 0) return;
    lines.push(`subgraph ${id}["${title}"]`);
    items.forEach((label, idx) => {
      const nodeId = `${id}_${idx + 1}`;
      lines.push(`${nodeId}["${label}"]`);
      lines.push(`SYS --> ${nodeId}`);
    });
    lines.push("end");
  };

  addSubgraph("Client", "Client", ui.length ? ui : ["Browser"]);
  addSubgraph("App", "Application runtime", app.concat(worker));
  addSubgraph("Data", "Data stores", data);
  addSubgraph("Other", "Other components", other);

  if (variant.emphasizeOps) {
    externals.forEach((name, idx) => {
      const san = sanitizeLabel(name);
      if (!san.ok) {
        omissions.push(`External omitted (${name}): ${san.reason}`);
        return;
      }
      const label = variant.minimalLabels ? san.value.slice(0, 24) : san.value;
      const id = `EXT_${idx + 1}`;
      lines.push(`${id}["${label}"]`);
      lines.push(`${id} -. dependency .-> SYS`);
    });
  } else if (externals.length > 0) {
    omissions.push("External dependencies are shown in the ops focused variant.");
  }

  lines.push("classDef sys fill:#0f172a,color:#ffffff,stroke:#0f172a;");
  lines.push("class SYS sys;");

  return { mermaid: lines.join("\n"), assumptions, omissions };
}


