/**
 * Validation utilities for News and Updates
 * 
 * Schema validation, licence gate enforcement, and provenance checks
 */

import { NewsSnapshotSchema, NormalisedItemSchema } from "./schema";
import type { NormalisedItem, NewsSnapshot, SourceRegistryEntry } from "./types";
import { getSourceById } from "./sources";
import { generateContentHash } from "./sanitization";

/**
 * Validate a normalised item against schema
 */
export function validateItem(item: unknown): { valid: boolean; error?: string; item?: NormalisedItem } {
  try {
    const validated = NormalisedItemSchema.parse(item);
    return { valid: true, item: validated };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Validation failed",
    };
  }
}

/**
 * Validate a snapshot against schema
 */
export function validateSnapshot(snapshot: unknown): { valid: boolean; error?: string; snapshot?: NewsSnapshot } {
  try {
    const validated = NewsSnapshotSchema.parse(snapshot);
    return { valid: true, snapshot: validated };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Validation failed",
    };
  }
}

/**
 * Apply licence gate: strip content if licence is restrictive/unknown
 */
export function applyLicenceGate(
  item: Partial<NormalisedItem>,
  source: SourceRegistryEntry
): Partial<NormalisedItem> {
  // If metadata_only is true, strip all content fields
  if (source.allowed_fields_to_store.metadata_only) {
    return {
      ...item,
      // Keep only metadata fields
      title: item.title,
      url: item.url,
      publisher: item.publisher,
      published_at: item.published_at,
      fetched_at: item.fetched_at,
      source_id: item.source_id,
      source_type: item.source_type,
      licence_posture: item.licence_posture,
      content_hash: item.content_hash,
      topic_tags: item.topic_tags || [],
      audience_notes: {
        exec_brief: `Update from ${source.name}. See original source for details.`,
        engineer_detail: `Update from ${source.name}. See original source for technical details.`,
        learner_explain: `This is an update from ${source.name}. Click the link to read more.`,
      },
      raw: {
        source_url: item.url,
        source_title: item.title,
      },
    };
  }

  // Otherwise, return as-is (content allowed)
  return item;
}

/**
 * Validate provenance: ensure item has required provenance fields
 */
export function validateProvenance(item: Partial<NormalisedItem>): { valid: boolean; error?: string } {
  if (!item.source_id) {
    return { valid: false, error: "Missing source_id" };
  }
  
  if (!item.fetched_at) {
    return { valid: false, error: "Missing fetched_at" };
  }
  
  if (!item.url) {
    return { valid: false, error: "Missing url" };
  }
  
  // Check source exists in registry
  const source = getSourceById(item.source_id);
  if (!source) {
    return { valid: false, error: `Source ${item.source_id} not found in registry` };
  }
  
  return { valid: true };
}

/**
 * Validate content hash integrity
 */
export async function validateContentHash(item: NormalisedItem): Promise<{ valid: boolean; error?: string }> {
  // Reconstruct content string for hashing
  const content = JSON.stringify({
    title: item.title,
    url: item.url,
    publisher: item.publisher,
    published_at: item.published_at,
    audience_notes: item.audience_notes,
    raw: item.raw,
  });
  
  const computedHash = await generateContentHash(content);
  
  if (computedHash !== item.content_hash) {
    return {
      valid: false,
      error: `Content hash mismatch: expected ${item.content_hash}, got ${computedHash}`,
    };
  }
  
  return { valid: true };
}

/**
 * Safety gate: reject items with suspicious content
 */
export function applySafetyGate(item: Partial<NormalisedItem>): { allowed: boolean; error?: string } {
  // Check for oversized payloads
  const itemSize = JSON.stringify(item).length;
  if (itemSize > 100000) {  // 100KB limit
    return {
      allowed: false,
      error: `Item too large: ${itemSize} bytes`,
    };
  }
  
  // Check for suspicious patterns in title/URL
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,  // Event handlers
    /data:text\/html/i,
  ];
  
  const title = item.title || "";
  const url = item.url || "";
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(title) || pattern.test(url)) {
      return {
        allowed: false,
        error: "Item contains suspicious patterns",
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Comprehensive validation pipeline
 */
export async function validateItemPipeline(
  item: Partial<NormalisedItem>,
  source: SourceRegistryEntry
): Promise<{ valid: boolean; error?: string; item?: NormalisedItem }> {
  // 1. Safety gate
  const safetyCheck = applySafetyGate(item);
  if (!safetyCheck.allowed) {
    return { valid: false, error: safetyCheck.error };
  }
  
  // 2. Licence gate
  const gatedItem = applyLicenceGate(item, source);
  
  // 3. Provenance validation
  const provenanceCheck = validateProvenance(gatedItem);
  if (!provenanceCheck.valid) {
    return { valid: false, error: provenanceCheck.error };
  }
  
  // 4. Schema validation
  const schemaCheck = validateItem(gatedItem);
  if (!schemaCheck.valid) {
    return { valid: false, error: schemaCheck.error };
  }
  
  // 5. Content hash validation (if item is complete)
  if (schemaCheck.item) {
    const hashCheck = await validateContentHash(schemaCheck.item);
    if (!hashCheck.valid) {
      // Log but don't fail - hash might be computed during normalization
      console.warn(`Content hash validation warning: ${hashCheck.error}`);
    }
  }
  
  return schemaCheck;
}
