import { UsageMode } from "@/utils/exportPolicy";

type MetadataInput = {
  title: string;
  usageMode: UsageMode;
  includeAttribution?: boolean;
};

export type DocumentMetadata = {
  title: string;
  author: string;
  organization: string;
  subject: string;
  keywords: string[];
  category: string;
  lastModifiedBy: string;
  custom: Record<string, string>;
};

const AUTHOR_NAME = "Ransford Hall";
const ORG_NAME = "Ransfords Notes";

const baseKeywords = ["template", "export", "planning", "ransfords-notes"];

export function buildDocumentMetadata({ title, usageMode, includeAttribution = false }: MetadataInput): DocumentMetadata {
  const useCategory = usageMode === "internal" ? "Internal use only" : "Attribution required unless unlocked";

  const custom: Record<string, string> = {
    "x-usage-mode": usageMode,
    "x-internal-use-only": usageMode === "internal" ? "yes" : "no",
    "x-attribution-required": includeAttribution ? "yes" : "no",
  };

  return {
    title,
    author: AUTHOR_NAME,
    organization: ORG_NAME,
    subject: "Template export from Ransfords Notes",
    keywords: [...baseKeywords, usageMode],
    category: useCategory,
    lastModifiedBy: AUTHOR_NAME,
    custom,
  };
}

export function stripGeneratorMetadata(metadata: Record<string, unknown>) {
  const sanitized = { ...metadata };
  delete sanitized.generator;
  delete sanitized["x-generator"];
  delete sanitized["creator"];
  return sanitized;
}
