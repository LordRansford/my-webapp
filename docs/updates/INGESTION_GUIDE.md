# Ingestion Guide

## How Ingestion Works

The ingestion system runs automatically via GitHub Actions every 6 hours, or can be triggered manually.

### Process Flow

1. **Load Source Registry**: Reads `src/lib/updates/sources.ts` to get allowlisted sources
2. **Fetch from Sources**: Each source adapter fetches new items using delta cursors
3. **Normalize Items**: Converts source-specific format to normalised item shape
4. **Validate**: Applies schema validation, licence gates, and safety checks
5. **Enrich**: Adds deterministic tags, severity scores, and attention metrics
6. **Write Snapshots**: 
   - `latest.json` - Always written (may be invalid)
   - `last-good.json` - Only written if validation passes
   - Archive - Daily snapshots kept for 60 days

### Delta Fetching

Each source maintains a cursor in `data/news/state.json`:
- `last_fetched`: ISO timestamp of last successful fetch
- `last_etag`: HTTP ETag for conditional requests
- `last_modified`: Last-Modified header value
- `last_item_id`: Last processed item ID

This allows fetching only new items, reducing API load and processing time.

### Validation Gates

1. **Schema Validation**: Zod schema ensures correct structure
2. **Licence Gate**: Strips content if licence is restrictive/unknown
3. **Provenance Gate**: Ensures source_id, fetched_at, url are present
4. **Safety Gate**: Rejects oversized payloads, suspicious patterns
5. **Content Hash**: Validates integrity (optional, computed during normalization)

### Failover Behavior

- If a source fails: Keep its previous items, mark as failed in report
- If validation fails: Write to `latest.json` but not `last-good.json`
- If entire ingestion fails: Keep `last-good.json` unchanged
- Frontend automatically falls back to `last-good.json` if `latest.json` is invalid

## Source Adapters

Each source has an adapter in `scripts/news-ingest/adapters/`:

### NVD (National Vulnerability Database)
- **Type**: API
- **Endpoint**: `https://services.nvd.nist.gov/rest/json/cves/2.0/`
- **Rate Limit**: 5 requests/minute
- **Fields**: CVE ID, CVSS scores, references, description

### CISA KEV (Known Exploited Vulnerabilities)
- **Type**: JSON file download
- **Endpoint**: `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json`
- **Fields**: CVE ID, vendor, product, date added, KEV flag

### GOV.UK
- **Type**: RSS/Atom feed
- **Endpoint**: `https://www.gov.uk/government/publications.atom`
- **Fields**: Title, link, published date, summary (OGL licence)

### NCSC (National Cyber Security Centre)
- **Type**: RSS feed
- **Endpoint**: `https://www.ncsc.gov.uk/api/1/services/v1/all-report-types-feed.xml`
- **Fields**: Metadata only (conservative approach)

### arXiv
- **Type**: Atom feed
- **Endpoint**: `http://export.arxiv.org/api/query?search_query=cat:cs.AI`
- **Fields**: Metadata + short abstract excerpt

## Troubleshooting

### Ingestion Fails
1. Check `data/news/report.json` for error details
2. Verify source endpoints are accessible
3. Check rate limits (especially NVD)
4. Review adapter logs for specific errors

### Validation Fails
1. Check `latest.json` for structure issues
2. Review `report.json` for validation errors
3. Ensure all required fields are present
4. Check content hash if integrity validation enabled

### No Items Appearing
1. Verify sources are returning data
2. Check cursor state in `state.json`
3. Ensure adapters are correctly parsing responses
4. Review normalization logic for field mapping

### Frontend Shows "Degraded"
- This means `latest.json` failed validation
- System is using `last-good.json` (safe fallback)
- Check ingestion report to fix validation issues
- Once fixed, next successful ingestion will update both files

## Manual Testing

```bash
# Test single source adapter
node -e "
  const { fetchNVD } = require('./scripts/news-ingest/adapters/nvd.ts');
  fetchNVD({ id: 'nvd', ... }, {}).then(r => console.log(r));
"

# Test normalization
node -e "
  const { normalizeItem } = require('./scripts/news-ingest/normalize.ts');
  normalizeItem({ title: 'Test', url: 'https://example.com' }, source, new Date().toISOString())
    .then(r => console.log(JSON.stringify(r, null, 2)));
"

# Test full ingestion (dry run)
node scripts/news-ingest/main.mjs
```

## Monitoring

- **GitHub Actions**: Check workflow runs in `.github/workflows/news-ingest.yml`
- **Ingestion Report**: `data/news/report.json` updated after each run
- **Frontend Status**: `/updates` page shows status badge
- **Health Check**: Use `src/lib/updates/health.ts` utilities
