import type { ArchitectureDiagramInput } from "../schema";

export function buildAdrStubMarkdown({
  input,
  inputVersion,
  assumptions,
  omissions,
}: {
  input: ArchitectureDiagramInput;
  inputVersion: string;
  assumptions: string[];
  omissions: string[];
}) {
  const lines: string[] = [];
  lines.push(`# ADR`);
  lines.push(``);
  lines.push(`Title: `);
  lines.push(`Date: ${new Date().toLocaleDateString()}`);
  lines.push(`Input version: ${inputVersion}`);
  if (input.versionName) lines.push(`Version name: ${input.versionName}`);
  lines.push(``);
  lines.push(`## Context`);
  lines.push(input.systemDescription || "No description provided.");
  lines.push(``);
  lines.push(`## Decision`);
  lines.push(``);
  lines.push(`## Consequences`);
  lines.push(`- Positive:`);
  lines.push(`- Negative:`);
  lines.push(``);
  lines.push(`## Open questions`);
  lines.push(`- What remains unknown or unvalidated?`);
  lines.push(``);
  lines.push(`## Key assumptions`);
  lines.push(assumptions.length ? `- ${assumptions.join("\n- ")}` : `No assumptions recorded.`);
  lines.push(``);
  lines.push(`## Known omissions`);
  lines.push(omissions.length ? `- ${omissions.join("\n- ")}` : `No omissions recorded.`);
  lines.push(``);
  lines.push(`Generated with RansfordsNotes`);
  return lines.join("\n");
}


