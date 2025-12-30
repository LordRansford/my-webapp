/**
 * News Ingestion Orchestrator (TypeScript version)
 * 
 * Main script that:
 * 1. Loads source registry
 * 2. Fetches from each source
 * 3. Normalizes and validates items
 * 4. Writes snapshots (latest.json, last-good.json, archive)
 * 5. Generates ingestion report
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");

import { SOURCE_REGISTRY } from "../../src/lib/updates/sources.js";
import { readJsonFile, writeJsonFile } from "../../src/lib/storage/jsonFile.js";
import { NewsSnapshotSchema, IngestionStateSchema, IngestionReportSchema } from "../../src/lib/updates/schema.js";
import { validateSnapshot, validateItemPipeline } from "../../src/lib/updates/validation.js";
import { enrichItem } from "./enrich.js";
import type { SourceRegistryEntry, NormalisedItem, NewsSnapshot, IngestionState, IngestionReport } from "../../src/lib/updates/types.js";

const DATA_DIR = path.join(ROOT, "data", "news");
const LATEST_PATH = path.join(DATA_DIR, "latest.json");
const LAST_GOOD_PATH = path.join(DATA_DIR, "last-good.json");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const REPORT_PATH = path.join(DATA_DIR, "report.json");
const ARCHIVE_DIR = path.join(DATA_DIR, "archive");

// Ensure directories exist
function ensureDirs() {
  [DATA_DIR, ARCHIVE_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Load ingestion state
function loadState(): IngestionState {
  return readJsonFile<IngestionState>(STATE_PATH, {
    per_source_cursors: {},
    last_successful_run: undefined,
  });
}

// Save ingestion state
function saveState(state: IngestionState) {
  writeJsonFile(STATE_PATH, state);
}

// Load last good snapshot
function loadLastGood(): NewsSnapshot | null {
  try {
    return readJsonFile<NewsSnapshot>(LAST_GOOD_PATH, null as any);
  } catch {
    return null;
  }
}

// Save snapshot
function saveSnapshot(snapshot: NewsSnapshot, isGood = false) {
  writeJsonFile(LATEST_PATH, snapshot);
  if (isGood) {
    writeJsonFile(LAST_GOOD_PATH, snapshot);
    
    // Also archive
    const date = new Date().toISOString().split("T")[0];
    const archivePath = path.join(ARCHIVE_DIR, `${date}.json`);
    writeJsonFile(archivePath, snapshot);
    
    // Clean old archives (keep 60 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 60);
    const files = fs.readdirSync(ARCHIVE_DIR);
    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const fileDate = new Date(file.replace(".json", ""));
        if (fileDate < cutoffDate) {
          fs.unlinkSync(path.join(ARCHIVE_DIR, file));
        }
      }
    });
  }
}

// Main ingestion function
async function ingest() {
  ensureDirs();
  
  const startTime = Date.now();
  const report: IngestionReport = {
    run_at: new Date().toISOString(),
    duration_ms: 0,
    sources_processed: 0,
    sources_succeeded: 0,
    sources_failed: 0,
    items_added: 0,
    items_updated: 0,
    items_removed: 0,
    validation_passed: false,
    snapshot_written: false,
    per_source_results: {},
    errors: [],
  };
  
  const state = loadState();
  const lastGood = loadLastGood();
  const allItems = new Map<string, NormalisedItem>();  // id -> item
  
  // Load existing items from last good snapshot
  if (lastGood?.items) {
    for (const item of lastGood.items) {
      allItems.set(item.id, item);
    }
  }
  
  // Process each source
  for (const source of SOURCE_REGISTRY) {
    report.sources_processed++;
    
    try {
      const cursor = state.per_source_cursors[source.id] || {};
      
      // Import adapter based on source ID
      let fetchFn: any;
      
      switch (source.adapter_reference) {
        case "nvd":
          const nvdAdapter = await import("./adapters/nvd.js");
          fetchFn = nvdAdapter.fetchNVD;
          break;
        case "cisa-kev":
          const cisaAdapter = await import("./adapters/cisa-kev.js");
          fetchFn = cisaAdapter.fetchCISAKEV;
          break;
        case "govuk":
          const govukAdapter = await import("./adapters/govuk.js");
          fetchFn = govukAdapter.fetchGOVUK;
          break;
        case "ncsc":
          const ncscAdapter = await import("./adapters/ncsc.js");
          fetchFn = ncscAdapter.fetchNCSC;
          break;
        case "arxiv":
          const arxivAdapter = await import("./adapters/arxiv.js");
          fetchFn = arxivAdapter.fetchArxiv;
          break;
        default:
          throw new Error(`Unknown adapter reference: ${source.adapter_reference}`);
      }
      
      if (!fetchFn || typeof fetchFn !== "function") {
        throw new Error(`Adapter ${source.adapter_reference} does not export fetch function`);
      }
      
      const result = await fetchFn(source, cursor);
      
      let itemsFetched = 0;
      let itemsNormalised = 0;
      
      for (const item of result.items || []) {
        itemsFetched++;
        
        // Validate item
        const validation = await validateItemPipeline(item, source);
        if (validation.valid && validation.item) {
          itemsNormalised++;
          
          // Check if item exists
          const existing = allItems.get(validation.item.id);
          if (existing) {
            report.items_updated++;
            allItems.set(validation.item.id, validation.item);
          } else {
            report.items_added++;
            allItems.set(validation.item.id, validation.item);
          }
        }
      }
      
      // Update cursor
      if (result.nextCursor) {
        state.per_source_cursors[source.id] = {
          ...cursor,
          ...result.nextCursor,
          last_fetched: new Date().toISOString(),
        };
      }
      
      report.per_source_results[source.id] = {
        success: true,
        items_fetched: itemsFetched,
        items_normalised: itemsNormalised,
      };
      report.sources_succeeded++;
    } catch (error) {
      report.sources_failed++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      report.per_source_results[source.id] = {
        success: false,
        items_fetched: 0,
        items_normalised: 0,
        error: errorMsg,
      };
      report.errors.push(`Source ${source.id}: ${errorMsg}`);
      console.error(`Error processing source ${source.id}:`, error);
    }
  }
  
  // Build snapshot
  const snapshot: NewsSnapshot = {
    metadata: {
      generated_at: new Date().toISOString(),
      version: new Date().toISOString(),
      source_count: SOURCE_REGISTRY.length,
      item_count: allItems.size,
      per_source_counts: {},
      validation_passed: false,
    },
    items: Array.from(allItems.values()),
  };
  
  // Count per source
  for (const item of snapshot.items) {
    snapshot.metadata.per_source_counts[item.source_id] =
      (snapshot.metadata.per_source_counts[item.source_id] || 0) + 1;
  }
  
  // Validate snapshot
  const snapshotValidation = validateSnapshot(snapshot);
  if (snapshotValidation.valid && snapshotValidation.snapshot) {
    snapshot.metadata.validation_passed = true;
    report.validation_passed = true;
    
    // Save snapshot
    saveSnapshot(snapshotValidation.snapshot, true);
    report.snapshot_written = true;
    state.last_successful_run = new Date().toISOString();
  } else {
    snapshot.metadata.validation_passed = false;
    snapshot.metadata.errors = [snapshotValidation.error || "Validation failed"];
    report.errors.push(`Snapshot validation failed: ${snapshotValidation.error}`);
    
    // Still save as latest (but not as last-good)
    saveSnapshot(snapshot, false);
  }
  
  // Save state and report
  saveState(state);
  report.duration_ms = Date.now() - startTime;
  writeJsonFile(REPORT_PATH, report);
  
  console.log("Ingestion complete:");
  console.log(`  Sources: ${report.sources_succeeded}/${report.sources_processed} succeeded`);
  console.log(`  Items: ${report.items_added} added, ${report.items_updated} updated`);
  console.log(`  Validation: ${report.validation_passed ? "PASSED" : "FAILED"}`);
  
  if (report.errors.length > 0) {
    console.error("Errors:", report.errors);
    process.exit(1);
  }
}

// Run ingestion
ingest().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
