import type { Audience } from "./audience";
import type { VariantId } from "../types";

export function getVariantCardLabel(audience: Audience, variantId: VariantId) {
  if (audience === "kids") {
    if (variantId === "minimal") return "Simple";
    if (variantId === "stakeholder") return "Friendly";
    if (variantId === "security") return "Safer";
    if (variantId === "data") return "Data";
    if (variantId === "ops") return "How it runs";
  }
  if (audience === "students") {
    if (variantId === "minimal") return "Minimal";
    if (variantId === "stakeholder") return "Stakeholder";
    if (variantId === "security") return "Security";
    if (variantId === "data") return "Data";
    if (variantId === "ops") return "Ops";
  }
  if (variantId === "minimal") return "Minimal";
  if (variantId === "stakeholder") return "Stakeholder friendly";
  if (variantId === "security") return "Security focused";
  if (variantId === "data") return "Data focused";
  return "Ops focused";
}

export function getVariantCardDescription(audience: Audience, variantId: VariantId) {
  if (audience === "kids") {
    if (variantId === "minimal") return "Only the most important parts.";
    if (variantId === "stakeholder") return "Easy words and friendly grouping.";
    if (variantId === "security") return "Highlights boundaries and private data.";
    if (variantId === "data") return "Shows where data is stored and moved.";
    return "Shows how the system runs.";
  }
  if (audience === "students") {
    if (variantId === "minimal") return "Essential nodes and short labels.";
    if (variantId === "stakeholder") return "Plain language and grouped structure.";
    if (variantId === "security") return "Boundaries and sensitive flows.";
    if (variantId === "data") return "Stores and flow direction.";
    return "Runtime separation and dependencies.";
  }
  if (variantId === "minimal") return "Essential nodes and short labels.";
  if (variantId === "stakeholder") return "Plain language labels and grouping for reviews.";
  if (variantId === "security") return "Trust boundaries and sensitive flows highlighted.";
  if (variantId === "data") return "Data stores emphasised with clearer direction.";
  return "Deployment and dependencies made explicit.";
}


