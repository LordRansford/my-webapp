/**
 * Source Registry for News and Updates
 * 
 * Explicit allowlist of authoritative sources with licence and security metadata.
 * This is the single source of truth for what can be ingested.
 */

import type { SourceRegistryEntry } from "./types";

/**
 * Day 1 authoritative sources
 * 
 * Prioritised list of legally safe, authoritative sources:
 * 1. NVD API for CVE enrichment
 * 2. CISA KEV dataset (CC0)
 * 3. GOV.UK publications (OGL)
 * 4. NCSC RSS feeds (indexing only)
 * 5. arXiv RSS (metadata + abstract if permitted)
 */
export const SOURCE_REGISTRY: SourceRegistryEntry[] = [
  {
    id: "nvd",
    name: "National Vulnerability Database",
    type: "dataset",
    base_url: "https://services.nvd.nist.gov",
    allowed_hostnames: ["services.nvd.nist.gov", "nvd.nist.gov"],
    fetch_method: "api",
    licence_posture: "public-domain-like",
    allowed_fields_to_store: {
      structured_fields: true,
      summary_text: true,
    },
    refresh_cadence: "daily",
    adapter_reference: "nvd",
    rate_limit_policy: {
      requests_per_minute: 5,  // NVD rate limit
      backoff_seconds: 12,
    },
  },
  {
    id: "cisa-kev",
    name: "CISA Known Exploited Vulnerabilities",
    type: "dataset",
    base_url: "https://www.cisa.gov",
    allowed_hostnames: ["www.cisa.gov", "www.cisa.gov"],
    fetch_method: "file_download",
    licence_posture: "CC0",
    allowed_fields_to_store: {
      structured_fields: true,
      summary_text: true,
    },
    refresh_cadence: "daily",
    adapter_reference: "cisa-kev",
  },
  {
    id: "govuk-ai",
    name: "GOV.UK AI Publications",
    type: "rss",
    base_url: "https://www.gov.uk",
    allowed_hostnames: ["www.gov.uk", "www.gov.uk"],
    fetch_method: "rss",
    licence_posture: "OGL",
    allowed_fields_to_store: {
      structured_fields: true,
      summary_text: true,
    },
    refresh_cadence: "daily",
    adapter_reference: "govuk",
  },
  {
    id: "ncsc-advisories",
    name: "NCSC Security Advisories",
    type: "rss",
    base_url: "https://www.ncsc.gov.uk",
    allowed_hostnames: ["www.ncsc.gov.uk"],
    fetch_method: "rss",
    licence_posture: "OGL",
    allowed_fields_to_store: {
      metadata_only: true,  // Conservative: metadata only for NCSC
    },
    refresh_cadence: "daily",
    adapter_reference: "ncsc",
  },
  {
    id: "arxiv-cs-ai",
    name: "arXiv Computer Science - AI",
    type: "atom",
    base_url: "https://arxiv.org",
    allowed_hostnames: ["arxiv.org", "export.arxiv.org"],
    fetch_method: "atom",
    licence_posture: "unknown",  // arXiv policy unclear on republishing
    allowed_fields_to_store: {
      metadata_only: true,  // Store metadata + abstract only if policy permits
    },
    refresh_cadence: "daily",
    adapter_reference: "arxiv",
  },
];

/**
 * Get source by ID
 */
export function getSourceById(id: string): SourceRegistryEntry | undefined {
  return SOURCE_REGISTRY.find((s) => s.id === id);
}

/**
 * Get all sources
 */
export function getAllSources(): SourceRegistryEntry[] {
  return SOURCE_REGISTRY;
}

/**
 * Check if a hostname is allowed for a source
 */
export function isHostnameAllowed(hostname: string, sourceId: string): boolean {
  const source = getSourceById(sourceId);
  if (!source) return false;
  return source.allowed_hostnames.includes(hostname);
}

/**
 * Check if a URL is allowed (hostname check)
 */
export function isUrlAllowed(url: string, sourceId: string): boolean {
  try {
    const parsed = new URL(url);
    return isHostnameAllowed(parsed.hostname, sourceId);
  } catch {
    return false;
  }
}
