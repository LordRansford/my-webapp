import type { VariantConfig } from "../types";

export const VARIANTS: VariantConfig[] = [
  {
    id: "minimal",
    label: "Minimal",
    caps: { maxNodes: 18, maxEdges: 22 },
    plainLanguage: false,
    emphasizeSecurity: false,
    emphasizeData: false,
    emphasizeOps: false,
    minimalLabels: true,
  },
  {
    id: "stakeholder",
    label: "Stakeholder friendly",
    caps: { maxNodes: 20, maxEdges: 24 },
    plainLanguage: true,
    emphasizeSecurity: false,
    emphasizeData: false,
    emphasizeOps: false,
    minimalLabels: false,
  },
  {
    id: "security",
    label: "Security focused",
    caps: { maxNodes: 22, maxEdges: 28 },
    plainLanguage: false,
    emphasizeSecurity: true,
    emphasizeData: false,
    emphasizeOps: false,
    minimalLabels: false,
  },
  {
    id: "data",
    label: "Data focused",
    caps: { maxNodes: 22, maxEdges: 28 },
    plainLanguage: false,
    emphasizeSecurity: false,
    emphasizeData: true,
    emphasizeOps: false,
    minimalLabels: false,
  },
  {
    id: "ops",
    label: "Ops focused",
    caps: { maxNodes: 22, maxEdges: 28 },
    plainLanguage: false,
    emphasizeSecurity: false,
    emphasizeData: false,
    emphasizeOps: true,
    minimalLabels: false,
  },
];


