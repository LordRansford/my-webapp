/**
 * Type definitions for News and Updates system
 * 
 * Defines the normalised data model and source registry types
 */

export type LicencePosture = 
  | "OGL"           // Open Government Licence
  | "CC0"           // Creative Commons Zero
  | "public-domain-like"  // Public domain or equivalent
  | "unknown"       // Unknown licence - metadata only
  | "restrictive";   // Restrictive - metadata only

export type SourceType = 
  | "dataset"       // Structured dataset (JSON, CSV)
  | "advisory"      // Security advisory
  | "rss"          // RSS feed
  | "atom";        // Atom feed

export type RefreshCadence = "hourly" | "daily";

export interface SourceRegistryEntry {
  id: string;
  name: string;
  type: SourceType;
  base_url: string;
  allowed_hostnames: string[];  // SSRF protection
  fetch_method: "api" | "file_download" | "rss" | "atom";
  licence_posture: LicencePosture;
  allowed_fields_to_store: {
    structured_fields?: boolean;
    summary_text?: boolean;
    metadata_only?: boolean;  // If true, only store title, date, url, publisher
  };
  refresh_cadence: RefreshCadence;
  adapter_reference: string;  // Reference to adapter function
  rate_limit_policy?: {
    requests_per_minute?: number;
    backoff_seconds?: number;
  };
}

export interface AudienceNotes {
  exec_brief: string;      // Short summary for executives
  engineer_detail: string; // Technical details for engineers
  learner_explain: string; // Plain language explanation for learners
}

export interface CVEItem {
  cve_id: string;
  cvss?: {
    v2?: number;
    v3?: number;
    v31?: number;
  };
  cwe?: string[];
  affected_products?: string[];
  kev: boolean;  // Known Exploited Vulnerabilities flag
  references: string[];
}

export interface NormalisedItem {
  id: string;                    // Stable ID: source_id + canonical identifier
  title: string;
  url: string;
  publisher: string;
  published_at: string;          // ISO 8601
  fetched_at: string;            // ISO 8601
  source_id: string;
  source_type: SourceType;
  licence_posture: LicencePosture;
  content_hash: string;           // SHA-256 hash of content for integrity
  topic_tags: string[];
  audience_notes: AudienceNotes;
  raw: Record<string, unknown>;   // Minimal raw fields for traceability
  
  // CVE-specific fields (optional)
  cve?: CVEItem;
}

export interface SnapshotMetadata {
  generated_at: string;           // ISO 8601
  version: string;                 // Semantic version or timestamp
  source_count: number;
  item_count: number;
  per_source_counts: Record<string, number>;
  validation_passed: boolean;
  errors?: string[];
}

export interface NewsSnapshot {
  metadata: SnapshotMetadata;
  items: NormalisedItem[];
}

export interface IngestionState {
  per_source_cursors: Record<string, {
    last_fetched?: string;        // ISO 8601
    last_etag?: string;
    last_modified?: string;       // ISO 8601
    last_item_id?: string;
  }>;
  last_successful_run?: string;   // ISO 8601
}

export interface IngestionReport {
  run_at: string;                 // ISO 8601
  duration_ms: number;
  sources_processed: number;
  sources_succeeded: number;
  sources_failed: number;
  items_added: number;
  items_updated: number;
  items_removed: number;
  validation_passed: boolean;
  snapshot_written: boolean;
  per_source_results: Record<string, {
    success: boolean;
    items_fetched: number;
    items_normalised: number;
    error?: string;
  }>;
  errors: string[];
}
