/**
 * Load tool catalog with defaults, examples, and explain content
 */

import catalogData from "../../../data/tools/catalog.json";

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

interface ToolCatalog {
  tools: ToolCatalogEntry[];
}

const catalog = catalogData as ToolCatalog;

export function getToolCatalogEntry(toolId: string): ToolCatalogEntry | null {
  return catalog.tools.find((t) => t.id === toolId) || null;
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

