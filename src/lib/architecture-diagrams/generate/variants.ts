import type { VariantConfig } from "../types";
import type { Audience } from "../copy/audience";

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

export function getVariantsForAudience(audience: Audience): VariantConfig[] {
  // Deterministic: ids and ordering are stable; only label/verbosity settings adapt.
  return VARIANTS.map((v) => {
    if (audience === "kids") {
      // Kids: shorter labels everywhere.
      return {
        ...v,
        minimalLabels: true,
        plainLanguage: true,
      };
    }
    if (audience === "students") {
      return {
        ...v,
        minimalLabels: v.id === "minimal",
        plainLanguage: v.id === "stakeholder",
      };
    }
    // Professionals: allow slightly more verbose labels for clarity; keep stakeholder variant plain language.
    return {
      ...v,
      minimalLabels: false,
      plainLanguage: v.id === "stakeholder",
      emphasizeSecurity: v.id === "security" || v.emphasizeSecurity,
      emphasizeData: v.id === "data" || v.emphasizeData,
      emphasizeOps: v.id === "ops" || v.emphasizeOps,
    };
  });
}


