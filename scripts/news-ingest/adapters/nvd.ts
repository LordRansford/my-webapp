/**
 * NVD (National Vulnerability Database) adapter
 * 
 * Fetches CVE data from NVD API
 */

import type { SourceRegistryEntry, NormalisedItem } from "../../../src/lib/updates/types";
import { fetchWithRetry } from "../fetch";
import { normalizeItem } from "../normalize";
import { enrichItem } from "../enrich";

export interface NVDResponse {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  result: {
    CVE_data_type: string;
    CVE_data_format: string;
    CVE_data_version: string;
    CVE_data_timestamp: string;
    CVE_Items: Array<{
      cve: {
        CVE_data_meta: {
          ID: string;
          ASSIGNER: string;
        };
        description: {
          description_data: Array<{
            lang: string;
            value: string;
          }>;
        };
        references: {
          reference_data: Array<{
            url: string;
            name: string;
            refsource: string;
            tags: string[];
          }>;
        };
      };
      impact?: {
        baseMetricV2?: {
          cvssV2: {
            baseScore: number;
          };
        };
        baseMetricV3?: {
          cvssV3: {
            baseScore: number;
            baseSeverity: string;
          };
        };
        baseMetricV31?: {
          cvssV31: {
            baseScore: number;
            baseSeverity: string;
          };
        };
      };
      publishedDate: string;
      lastModifiedDate: string;
    }>;
  };
}

export async function fetchNVD(
  source: SourceRegistryEntry,
  cursor?: { last_fetched?: string; last_modified?: string; last_item_id?: string; lastModified?: string; lastItemId?: string }
): Promise<{ items: Partial<NormalisedItem>[]; nextCursor?: { lastModified: string; lastItemId: string } }> {
  // Support both naming conventions
  const lastModified = cursor?.lastModified || cursor?.last_modified;
  const lastItemId = cursor?.lastItemId || cursor?.last_item_id;
  
  // NVD API endpoint - fetch recent CVEs
  const url = lastModified
    ? `https://services.nvd.nist.gov/rest/json/cves/2.0/?lastModStartDate=${lastModified}&resultsPerPage=50`
    : `https://services.nvd.nist.gov/rest/json/cves/2.0/?resultsPerPage=50&pubStartDate=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`;
  
  const result = await fetchWithRetry({
    source,
    url,
    lastModified: lastModified || undefined,
  });
  
  if (!result.success || !result.data) {
    return { items: [] };
  }
  
  const data = result.data as NVDResponse;
  const items: Partial<NormalisedItem>[] = [];
  const fetchedAt = new Date().toISOString();
  
  let currentLastModified = lastModified || "";
  let currentLastItemId = lastItemId || "";
  
  for (const cveItem of data.result?.CVE_Items || []) {
    const cveId = cveItem.cve.CVE_data_meta.ID;
    const description = cveItem.cve.description.description_data.find((d) => d.lang === "en")?.value || "";
    
    // Check if this is newer than our cursor
    if (cveItem.lastModifiedDate > currentLastModified) {
      currentLastModified = cveItem.lastModifiedDate;
    }
    if (cveId > currentLastItemId) {
      currentLastItemId = cveId;
    }
    
    // Extract CVSS scores
    const cvss = cveItem.impact
      ? {
          v2: cveItem.impact.baseMetricV2?.cvssV2.baseScore,
          v3: cveItem.impact.baseMetricV3?.cvssV3.baseScore,
          v31: cveItem.impact.baseMetricV31?.cvssV31.baseScore,
        }
      : undefined;
    
    // Extract references
    const references = cveItem.cve.references.reference_data.map((r) => r.url);
    
    // Normalize item
    const normalized = await normalizeItem(
      {
        id: cveId,
        title: `CVE-${cveId}: ${description.substring(0, 100)}`,
        url: `https://nvd.nist.gov/vuln/detail/${cveId}`,
        publisher: "NIST NVD",
        published_at: cveItem.publishedDate,
        summary: description,
        cve_id: cveId,
        cvss,
        references,
        kev: false,  // Will be enriched by CISA KEV data
      },
      source,
      fetchedAt
    );
    
    // Add CVE-specific data
    if (normalized) {
      normalized.cve = {
        cve_id: cveId,
        cvss,
        references,
        kev: false,
      };
      
      const enriched = enrichItem(normalized as NormalisedItem);
      items.push(enriched);
    }
  }
  
  return {
    items,
    nextCursor: currentLastModified ? { lastModified: currentLastModified, lastItemId: currentLastItemId } : undefined,
  };
}
