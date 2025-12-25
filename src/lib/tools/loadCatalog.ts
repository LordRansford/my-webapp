/**
 * Load tool catalog with defaults, examples, and explain content
 * Client-safe: uses static JSON import from public/tools-index.json (bundled at build time)
 */

// @ts-ignore - JSON import
import toolsIndexData from "../../../public/tools-index.json";

interface ToolCatalogEntry {
  id: string;
  defaultInputs: Record<string, unknown>;
  examples: Array<{
    title: string;
    inputs: Record<string, unknown>;
    expectedOutput?: string;
  }>;
  explain: string;
}

interface ToolsIndex {
  generatedAt: string;
  tools: Array<{
    id: string;
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

export function getToolCatalogEntry(toolId: string): ToolCatalogEntry | null {
  const tool = toolsIndex.tools.find((t) => t.id === toolId);
  if (!tool) return null;

  return {
    id: tool.id,
    defaultInputs: tool.defaultInputs || {},
    examples: tool.examples || [],
    explain: tool.explain || "",
  };
}

export function getDefaultInputs(toolId: string): Record<string, unknown> {
  const entry = getToolCatalogEntry(toolId);
  return entry?.defaultInputs || {};
}

export function getToolExamples(toolId: string): Array<{
  title: string;
  inputs: Record<string, unknown>;
  expectedOutput?: string;
}> {
  const entry = getToolCatalogEntry(toolId);
  return entry?.examples || [];
}

export function getToolExplain(toolId: string): string {
  const entry = getToolCatalogEntry(toolId);
  return entry?.explain || "No explanation available for this tool.";
}
