/**
 * CISA Known Exploited Vulnerabilities (KEV) adapter
 * 
 * Fetches KEV dataset (CC0 licence)
 */

import type { SourceRegistryEntry, NormalisedItem } from "../../../src/lib/updates/types";
import { fetchWithRetry } from "../fetch";
import { normalizeItem } from "../normalize";
import { enrichItem } from "../enrich";

export interface CISAKEVEntry {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  notes: string;
}

export async function fetchCISAKEV(
  source: SourceRegistryEntry,
  cursor?: { last_fetched?: string; last_modified?: string; lastModified?: string }
): Promise<{ items: Partial<NormalisedItem>[]; nextCursor?: { lastModified: string } }> {
  const lastModified = cursor?.lastModified || cursor?.last_modified;
  // CISA KEV CSV endpoint
  const url = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
  
  const result = await fetchWithRetry({
    source,
    url,
    lastModified,
  });
  
  if (!result.success || !result.data) {
    return { items: [] };
  }
  
  // CISA provides JSON format
  const data = result.data as { vulnerabilities: CISAKEVEntry[] };
  const items: Partial<NormalisedItem>[] = [];
  const fetchedAt = new Date().toISOString();
  
  let currentLastModified = lastModified || "";
  
  for (const entry of data.vulnerabilities || []) {
    if (entry.dateAdded > currentLastModified) {
      currentLastModified = entry.dateAdded;
    }
    
    const normalized = await normalizeItem(
      {
        id: entry.cveID,
        title: `${entry.cveID}: ${entry.vulnerabilityName}`,
        url: `https://www.cisa.gov/known-exploited-vulnerabilities-catalog`,
        publisher: "CISA",
        published_at: entry.dateAdded,
        summary: entry.shortDescription,
        cve_id: entry.cveID,
        kev: true,
        affected_products: [entry.product],
      },
      source,
      fetchedAt
    );
    
    if (normalized) {
      // Mark as KEV
      normalized.cve = {
        cve_id: entry.cveID,
        kev: true,
        references: [`https://www.cisa.gov/known-exploited-vulnerabilities-catalog`],
        affected_products: [entry.product],
      };
      
      const enriched = enrichItem(normalized as NormalisedItem);
      items.push(enriched);
    }
  }
  
  return {
    items,
    nextCursor: currentLastModified ? { lastModified: currentLastModified } : undefined,
  };
}
