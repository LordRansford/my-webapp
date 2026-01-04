import type { TemplateCatalogItem } from "./types";
import type { CatalogBadge } from "./types";

import registry from "../../../content/templates/registry.json";
import { templateDefinitions } from "../../../content/templates/definitions";

type PreviewRegistryEntry = {
  id: string;
  category: string;
  title: string;
  description: string;
  route: string;
  tags?: string[];
  difficulty?: string;
  estimatedMinutes?: number;
};

export function getTemplatesRegistry(): TemplateCatalogItem[] {
  const previewTemplates: TemplateCatalogItem[] = (registry as unknown as PreviewRegistryEntry[])
    .filter((t) => t && typeof t.route === "string" && t.route.startsWith("/templates/"))
    .map((t) => {
      const badges: CatalogBadge[] = [];
      if (t.difficulty) badges.push({ label: t.difficulty, tone: "slate" as const });
      if (typeof t.estimatedMinutes === "number") badges.push({ label: `${t.estimatedMinutes} min`, tone: "indigo" as const });
      return {
        id: t.id,
        kind: "template" as const,
        title: t.title,
        description: t.description,
        href: t.route,
        category: t.category,
        slug: t.id,
        hasRunner: false,
        estimatedMinutes: t.estimatedMinutes,
        tags: t.tags || [],
        badges,
      };
    });

  const runnerTemplates: TemplateCatalogItem[] = (templateDefinitions || []).map((def) => {
    const runHref = `/templates/run/${def.slug}`;
    const badges: CatalogBadge[] = [{ label: "Run live", tone: "emerald" as const }];
    if (typeof def.estimatedMinutes === "number") badges.push({ label: `${def.estimatedMinutes} min`, tone: "indigo" as const });
    return {
      id: `runner:${def.slug}`,
      kind: "template" as const,
      title: def.title,
      description: def.description || "Interactive template runner.",
      href: runHref,
      category: def.category,
      slug: def.slug,
      runHref,
      hasRunner: true,
      estimatedMinutes: def.estimatedMinutes,
      tags: ["runner", def.category],
      badges,
    };
  });

  return [...previewTemplates, ...runnerTemplates];
}

