import type { CatalogBadge, ToolCatalogItem } from "./types";

// Source of truth for tool metadata is the generated index.
// IMPORTANT: do not edit public/tools-index.json by hand; regenerate via scripts/build-tools-index.mjs.
import toolsIndex from "../../../public/tools-index.json";

type ToolsIndex = {
  tools: Array<{
    id: string;
    title?: string;
    description?: string;
    route?: string;
    executionModes?: string[];
    defaultMode?: string;
    tags?: string[];
  }>;
};

const index = toolsIndex as unknown as ToolsIndex;

export function getToolsRegistry(): ToolCatalogItem[] {
  return (index.tools || [])
    .filter((t) => typeof t?.route === "string" && t.route.startsWith("/tools"))
    .map((t) => {
      const badges: CatalogBadge[] = [];
      if (t.defaultMode) badges.push({ label: t.defaultMode, tone: "slate" as const });
      if (Array.isArray(t.executionModes) && t.executionModes.length > 1) {
        badges.push({ label: `${t.executionModes.length} modes`, tone: "indigo" as const });
      }
      return {
        id: t.id,
        kind: "tool",
        title: t.title || t.id,
        description: t.description || "Tool workspace.",
        href: t.route || `/tools/${t.id}`,
        route: t.route || `/tools/${t.id}`,
        executionModes: t.executionModes || [],
        defaultMode: t.defaultMode,
        tags: t.tags || [],
        badges,
      };
    });
}

