import type { ArchitectureDiagramInput } from "../schema";
import type { VariantConfig } from "../types";
import { capList, sanitizeLabel } from "./safety";

export function generateSequenceDiagram(input: ArchitectureDiagramInput, variant: VariantConfig) {
  const omissions: string[] = [];
  const assumptions: string[] = [
    "Sequence diagram shows a happy path only.",
    "Steps are derived from the first few flows in order. No extra steps are inferred.",
  ];

  const flows = capList(input.flows || [], Math.min(10, variant.caps.maxEdges));
  const lines: string[] = [];
  lines.push("sequenceDiagram");
  lines.push("%% Deterministic sequence (Mermaid)");

  const participants = new Map<string, string>(); // label -> id
  const addParticipant = (raw: string) => {
    const san = sanitizeLabel(raw);
    if (!san.ok) return null;
    const label = variant.minimalLabels ? san.value.slice(0, 24) : san.value;
    if (participants.has(label)) return participants.get(label);
    const id = `P${participants.size + 1}`;
    participants.set(label, id);
    lines.push(`participant ${id} as "${label}"`);
    return id;
  };

  if (flows.length === 0) {
    omissions.push("No flows provided. Add flows to generate a happy path sequence.");
    // Still emit a minimal valid diagram.
    const sys = sanitizeLabel(input.systemName);
    lines.push(`participant SYS as "${sys.ok ? sys.value : "System"}"`);
    lines.push("Note over SYS: Add flows to generate a sequence");
    return { mermaid: lines.join("\n"), assumptions, omissions };
  }

  flows.forEach((f) => {
    const fromId = addParticipant(String(f.from || ""));
    const toId = addParticipant(String(f.to || ""));
    if (!fromId || !toId) return;
    const purposeSan = sanitizeLabel(f.purpose);
    const msg = purposeSan.ok ? (variant.minimalLabels ? purposeSan.value.slice(0, 28) : purposeSan.value) : "request";
    const suffix = variant.emphasizeSecurity && f.sensitive ? " (sensitive)" : "";
    lines.push(`${fromId}->>${toId}: ${msg}${suffix}`);
  });

  if (participants.size === 0) omissions.push("Flow participants could not be rendered due to invalid labels.");

  return { mermaid: lines.join("\n"), assumptions, omissions };
}


