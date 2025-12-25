/**
 * Load tool contract from public/tools-index.json
 * Client-safe: uses static JSON import (bundled at build time)
 */

// @ts-ignore - JSON import
import toolsIndexData from "../../../public/tools-index.json";

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

interface ToolsIndex {
  generatedAt: string;
  tools: Array<{
    id: string;
    title: string;
    description: string;
    category?: string;
    difficulty?: string;
    route: string;
    executionModes: ("local" | "compute")[];
    defaultMode: "local" | "compute";
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
    inputs: Array<{
      name: string;
      type: string;
      limits: string;
      required?: boolean;
      default?: unknown;
    }>;
    securityNotes?: string;
    defaultInputs?: Record<string, unknown>;
    examples?: Array<{
      title: string;
      inputs: Record<string, unknown>;
      expectedOutput?: string;
    }>;
    explain?: string;
  }>;
}

const toolsIndex = toolsIndexData as ToolsIndex;

export function getToolContract(toolId: string): ToolContract | null {
  const tool = toolsIndex.tools.find((t) => t.id === toolId);
  if (!tool) return null;

  return {
    id: tool.id,
    title: tool.title,
    description: tool.description,
    category: tool.category,
    difficulty: tool.difficulty,
    route: tool.route,
    executionModes: tool.executionModes,
    defaultMode: tool.defaultMode,
    inputs: tool.inputs || [],
    limits: {
      cpuMs: tool.limits.cpuMs,
      wallMs: tool.limits.wallMs,
      memoryMb: tool.limits.memoryMb,
      inputKb: tool.limits.inputKb || 64,
      outputKb: tool.limits.outputKb,
    },
    creditModel: tool.creditModel,
    runner: tool.runner || "local",
    failureModes: tool.failureModes || ["validation_error", "execution_error", "timeout", "security_error"],
    statusStates: tool.statusStates || ["idle", "running", "completed", "failed"],
    securityNotes: tool.securityNotes,
  };
}

export function getAllToolContracts(): ToolContract[] {
  return toolsIndex.tools
    .map((t) => getToolContract(t.id))
    .filter((t): t is ToolContract => t !== null);
}
