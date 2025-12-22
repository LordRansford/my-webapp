import type { ArchitectureDiagramInput } from "./schema";

export type DiagramId = "context" | "container" | "deployment" | "dfd" | "sequence";

export type VariantId = "minimal" | "stakeholder" | "security" | "data" | "ops";

export type DiagramVariant = {
  id: VariantId;
  label: string;
  diagrams: Record<DiagramId, string>;
  assumptions: string[];
  omissions: string[];
};

export type DiagramPack = {
  input: ArchitectureDiagramInput;
  variants: DiagramVariant[];
};

export type SafetyCaps = {
  maxNodes: number;
  maxEdges: number;
};

export type VariantConfig = {
  id: VariantId;
  label: string;
  caps: SafetyCaps;
  plainLanguage: boolean;
  emphasizeSecurity: boolean;
  emphasizeData: boolean;
  emphasizeOps: boolean;
  minimalLabels: boolean;
};


