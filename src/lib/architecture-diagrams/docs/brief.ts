import type { ArchitectureDiagramInput } from "../schema";

export function buildArchitectureBriefMarkdown({
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
  lines.push(`# Architecture brief`);
  lines.push(``);
  lines.push(`System: ${input.systemName}`);
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  lines.push(`Input version: ${inputVersion}`);
  if (input.versionName) lines.push(`Version name: ${input.versionName}`);
  lines.push(``);
  lines.push(`## System purpose`);
  lines.push(input.systemDescription || "No description provided.");
  lines.push(``);
  lines.push(`## Main containers and responsibilities`);
  if (!input.containers?.length) {
    lines.push(`No containers provided.`);
  } else {
    input.containers.forEach((c) => {
      lines.push(`- ${c.name} (${c.type}): ${c.description || "No description."}`);
    });
  }
  lines.push(``);
  lines.push(`## Key data types`);
  lines.push((input.dataTypes || []).length ? `- ${input.dataTypes.join("\n- ")}` : `No data types selected.`);
  lines.push(``);
  lines.push(`## Trust boundaries`);
  if ((input.security?.trustBoundaries || []).length) {
    lines.push(`- ${(input.security.trustBoundaries || []).join("\n- ")}`);
  } else if (input.security?.hasNoTrustBoundariesConfirmed) {
    lines.push(`Confirmed: This system has no trust boundaries.`);
  } else {
    lines.push(`Not set.`);
  }
  lines.push(``);
  lines.push(`## Key risks and open questions`);
  lines.push(`- What are the highest impact failure modes?`);
  lines.push(`- What sensitive data crosses boundaries?`);
  lines.push(`- What is owned internally vs provided by third parties?`);
  lines.push(``);
  lines.push(`## Assumptions`);
  lines.push(assumptions.length ? `- ${assumptions.join("\n- ")}` : `No assumptions recorded.`);
  lines.push(``);
  lines.push(`## Omissions`);
  lines.push(omissions.length ? `- ${omissions.join("\n- ")}` : `No omissions recorded.`);
  lines.push(``);
  lines.push(`Generated with RansfordsNotes`);
  return lines.join("\n");
}


