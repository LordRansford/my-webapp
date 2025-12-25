/**
 * Load tool contract from data/tool-contracts.json
 * Client-safe: uses static JSON import (bundled at build time)
 */

// @ts-ignore - JSON import
import toolContractsData from "../../../data/tool-contracts.json";

export interface ToolContract {
  id: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: string;
  route: string;
  executionModes: ("local" | "compute")[];
  defaultMode: "local" | "compute";
  inputs: Array<{
    name: string;
    type: string;
    limits: string;
    required?: boolean;
    default?: unknown;
  }>;
  limits: {
    cpuMs: number;
    wallMs: number;
    memoryMb: number;
    inputKb: number;
    outputKb: number;
  };
  creditModel: {
    baseCredits: number;
    perKbCredits: number;
    complexityMultiplierHints?: Record<string, number>;
  };
  runner: string;
  failureModes: string[];
  statusStates: string[];
  securityNotes?: string;
}

export function getToolContract(toolId: string): ToolContract | null {
  const data = toolContractsData as { tools: unknown[] };
  const tool = data.tools.find((t: unknown) => {
    const toolObj = t as { id?: string };
    return toolObj.id === toolId;
  }) as ToolContract | undefined;
  
  if (!tool) return null;
  
  // Ensure required fields exist, map legacy fields
  const toolAny = tool as unknown as Record<string, unknown>;
  const execution = toolAny.execution as string | undefined;
  
  return {
    ...tool,
    executionModes: tool.executionModes || (execution === "sandboxed-server" ? ["compute"] : ["local"]),
    defaultMode: tool.defaultMode || "local",
    description: tool.description || (toolAny.purpose as string) || "",
    limits: {
      ...tool.limits,
      wallMs: tool.limits.wallMs || tool.limits.cpuMs * 2,
    },
    creditModel: tool.creditModel || {
      baseCredits: (toolAny.credits as { costPerRun?: number })?.costPerRun || 0,
      perKbCredits: 0,
      complexityMultiplierHints: {},
    },
  };
}

export function getAllToolContracts(): ToolContract[] {
  const data = toolContractsData as { tools: unknown[] };
  return data.tools.map((t: unknown) => {
    const tool = t as { id: string };
    return getToolContract(tool.id);
  }).filter((t): t is ToolContract => t !== null);
}
