/**
 * Zod schemas for News and Updates validation
 * 
 * Runtime validation for ingestion and client-side failover
 */

import { z } from "zod";

export const LicencePostureSchema = z.enum([
  "OGL",
  "CC0",
  "public-domain-like",
  "unknown",
  "restrictive",
]);

export const SourceTypeSchema = z.enum([
  "dataset",
  "advisory",
  "rss",
  "atom",
]);

export const AudienceNotesSchema = z.object({
  exec_brief: z.string().min(1).max(500),
  engineer_detail: z.string().min(1).max(2000),
  learner_explain: z.string().min(1).max(1000),
});

export const CVEItemSchema = z.object({
  cve_id: z.string().regex(/^CVE-\d{4}-\d{4,}$/),
  cvss: z.object({
    v2: z.number().min(0).max(10).optional(),
    v3: z.number().min(0).max(10).optional(),
    v31: z.number().min(0).max(10).optional(),
  }).optional(),
  cwe: z.array(z.string()).optional(),
  affected_products: z.array(z.string()).optional(),
  kev: z.boolean(),
  references: z.array(z.string().url()),
});

export const NormalisedItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(500),
  url: z.string().url(),
  publisher: z.string().min(1).max(200),
  published_at: z.string().datetime(),
  fetched_at: z.string().datetime(),
  source_id: z.string().min(1),
  source_type: SourceTypeSchema,
  licence_posture: LicencePostureSchema,
  content_hash: z.string().length(64),  // SHA-256 hex
  topic_tags: z.array(z.string()),
  audience_notes: AudienceNotesSchema,
  raw: z.record(z.string(), z.unknown()),
  cve: CVEItemSchema.optional(),
});

export const SnapshotMetadataSchema = z.object({
  generated_at: z.string().datetime(),
  version: z.string(),
  source_count: z.number().int().min(0),
  item_count: z.number().int().min(0),
  per_source_counts: z.record(z.string(), z.number().int().min(0)),
  validation_passed: z.boolean(),
  errors: z.array(z.string()).optional(),
});

export const NewsSnapshotSchema = z.object({
  metadata: SnapshotMetadataSchema,
  items: z.array(NormalisedItemSchema),
});

export const IngestionStateSchema = z.object({
  per_source_cursors: z.record(z.string(), z.object({
    last_fetched: z.string().datetime().optional(),
    last_etag: z.string().optional(),
    last_modified: z.string().datetime().optional(),
    last_item_id: z.string().optional(),
  })),
  last_successful_run: z.string().datetime().optional(),
});

export const IngestionReportSchema = z.object({
  run_at: z.string().datetime(),
  duration_ms: z.number().int().min(0),
  sources_processed: z.number().int().min(0),
  sources_succeeded: z.number().int().min(0),
  sources_failed: z.number().int().min(0),
  items_added: z.number().int().min(0),
  items_updated: z.number().int().min(0),
  items_removed: z.number().int().min(0),
  validation_passed: z.boolean(),
  snapshot_written: z.boolean(),
  per_source_results: z.record(z.string(), z.object({
    success: z.boolean(),
    items_fetched: z.number().int().min(0),
    items_normalised: z.number().int().min(0),
    error: z.string().optional(),
  })),
  errors: z.array(z.string()),
});

// Type exports for use in code
export type NormalisedItem = z.infer<typeof NormalisedItemSchema>;
export type NewsSnapshot = z.infer<typeof NewsSnapshotSchema>;
export type IngestionState = z.infer<typeof IngestionStateSchema>;
export type IngestionReport = z.infer<typeof IngestionReportSchema>;
