export type CatalogItemKind = "dashboard" | "tool" | "template" | "game";

export type CatalogBadgeTone = "slate" | "emerald" | "indigo" | "amber" | "rose";

export type CatalogBadge = {
  label: string;
  tone?: CatalogBadgeTone;
};

/**
 * Unified registry item shape used by hubs (dashboards/tools/templates/games).
 * Keep this intentionally small and stable: hubs need consistent data for search/filters/badges.
 */
export type CatalogItemBase = {
  id: string;
  kind: CatalogItemKind;
  title: string;
  description: string;
  href: string;
  tags?: string[];
  badges?: CatalogBadge[];
};

export type DashboardCategoryId = "ai" | "architecture" | "cybersecurity" | "digitalisation";

export type DashboardCatalogItem = CatalogItemBase & {
  kind: "dashboard";
  category: DashboardCategoryId;
  tool: string;
};

export type ToolCatalogItem = CatalogItemBase & {
  kind: "tool";
  route: string;
  executionModes?: string[];
  defaultMode?: string;
};

export type TemplateCatalogItem = CatalogItemBase & {
  kind: "template";
  category: string;
  slug: string;
  runHref?: string;
  hasRunner?: boolean;
  estimatedMinutes?: number;
};

export type GameCatalogItem = CatalogItemBase & {
  kind: "game";
  minutes?: number;
  difficulty?: string;
  source?: "games" | "play";
};

export type CatalogItem = DashboardCatalogItem | ToolCatalogItem | TemplateCatalogItem | GameCatalogItem;

