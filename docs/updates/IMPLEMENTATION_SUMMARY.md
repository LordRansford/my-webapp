# News and Updates Implementation Summary

## What Was Built

A complete automated "News and Updates" system that:
- Ingests from authoritative, legally safe sources
- Stores snapshots in the repository (free, no external services)
- Provides a premium frontend with filtering, search, and audience modes
- Implements comprehensive security and failover mechanisms

## Legal Safety

The system is legally safe because:

1. **Explicit Source Allowlist**: Only sources explicitly registered in code can be ingested
2. **Licence Posture Enforcement**: Each source has a licence posture flag that determines what can be stored:
   - `OGL`, `CC0`, `public-domain-like`: Full content allowed
   - `unknown`, `restrictive`: Metadata only (title, date, URL, publisher)
3. **No Full Article Republishing**: For restrictive sources, only metadata is stored
4. **Always Link to Original**: Every item has a "View Source" button linking to the original
5. **Provenance on Every Item**: Source name, licence badge, and fetched timestamp shown
6. **Conservative Defaults**: Unknown licence = metadata only

## Files Created/Modified

### Core Libraries
- `src/lib/updates/types.ts` - TypeScript type definitions
- `src/lib/updates/sources.ts` - Source registry with allowlist
- `src/lib/updates/schema.ts` - Zod validation schemas
- `src/lib/updates/security.ts` - SSRF prevention and host allowlisting
- `src/lib/updates/sanitization.ts` - HTML stripping and text sanitization
- `src/lib/updates/validation.ts` - Schema validation and licence gates
- `src/lib/updates/load.ts` - Client-side snapshot loader
- `src/lib/updates/failover.ts` - Failover utilities
- `src/lib/updates/health.ts` - Health check utilities

### Ingestion Scripts
- `scripts/news-ingest/main.mjs` - Main orchestrator
- `scripts/news-ingest/fetch.ts` - Core fetch logic with retry
- `scripts/news-ingest/normalize.ts` - Normalisation logic
- `scripts/news-ingest/enrich.ts` - Deterministic enrichment
- `scripts/news-ingest/adapters/nvd.ts` - NVD CVE adapter
- `scripts/news-ingest/adapters/cisa-kev.ts` - CISA KEV adapter
- `scripts/news-ingest/adapters/govuk.ts` - GOV.UK RSS adapter
- `scripts/news-ingest/adapters/ncsc.ts` - NCSC RSS adapter
- `scripts/news-ingest/adapters/arxiv.ts` - arXiv Atom adapter

### Frontend Components
- `src/app/updates/page.tsx` - Main updates page
- `src/app/api/updates/latest/route.ts` - API route for latest.json
- `src/app/api/updates/last-good/route.ts` - API route for last-good.json
- `src/components/updates/UpdateCard.tsx` - Individual item card
- `src/components/updates/FilterBar.tsx` - Filtering UI
- `src/components/updates/SearchBar.tsx` - Client-side search
- `src/components/updates/AudienceModeToggle.tsx` - Exec/Engineer/Learner toggle
- `src/components/updates/ProvenanceBadge.tsx` - Licence and source badges

### Infrastructure
- `.github/workflows/news-ingest.yml` - GitHub Actions workflow (runs every 6 hours)
- `package.json` - Added `xml2js` dependency

### Navigation
- `src/components/Header.tsx` - Added "Updates" link

## How to Run Ingestion Locally

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run ingestion script**:
   ```bash
   node scripts/news-ingest/main.mjs
   ```

   Note: The adapters are TypeScript files. You may need to:
   - Use `tsx` to run TypeScript directly: `npx tsx scripts/news-ingest/main.mjs`
   - Or compile TypeScript first: `tsc scripts/news-ingest/**/*.ts --outDir dist`

3. **Check results**:
   - `data/news/latest.json` - Latest snapshot
   - `data/news/last-good.json` - Last validated snapshot
   - `data/news/report.json` - Ingestion report
   - `data/news/state.json` - Cursor state for delta fetching

## How GitHub Actions Works

1. **Schedule**: Runs every 6 hours via cron: `0 */6 * * *`
2. **Manual Trigger**: Can be triggered manually via `workflow_dispatch`
3. **Process**:
   - Checks out repository
   - Installs dependencies
   - Runs `scripts/news-ingest/main.mjs`
   - Commits changes to `data/news/*.json` if successful
   - Pushes changes back to repository

4. **Permissions**: Uses `GITHUB_TOKEN` with `contents: write` permission

## How Failover Works

1. **Client-Side Validation**:
   - Frontend tries to load `/api/updates/latest`
   - Validates using Zod schema
   - If validation fails, falls back to `/api/updates/last-good`

2. **Ingestion Failover**:
   - If ingestion fails, `last-good.json` is not overwritten
   - If validation fails, snapshot is written to `latest.json` but not `last-good.json`
   - Archive is only created for validated snapshots

3. **Per-Source Failures**:
   - If a source fails, its previous items are kept
   - Other sources continue to update
   - Failed sources are marked in the ingestion report

4. **Status Indicators**:
   - "Live" - Recent snapshot (< 12 hours old)
   - "Stale" - Snapshot > 12 hours old
   - "Degraded" - Using last-good snapshot

## Remaining Safe Optional Enhancements

1. **Sector Lens Mapping**: Add `data/news/sector-lens.json` mapping technologies to keywords for better tagging
2. **Verified Source Badges**: Tier sources (government, standards, primary dataset, vendor, community)
3. **Offline Support**: Cache snapshot JSON with Service Worker
4. **Weekly Digest Page**: Deterministic weekly summary with provenance list
5. **Ingestion Rules Changelog**: Track governance decisions over time in `docs/updates/ingestion-rules-changelog.md`

## Security Measures Implemented

1. **SSRF Prevention**: Host allowlisting, private IP blocking, redirect validation
2. **HTML Sanitization**: All text stripped of HTML before storage
3. **Content Hash**: SHA-256 hash for integrity checking
4. **Schema Validation**: Zod schemas at ingestion and client-side
5. **No Secrets**: All operations use public APIs, no API keys required
6. **Minimal Permissions**: GitHub Action only needs `contents: write`

## Performance Optimizations

1. **Single JSON Load**: Frontend loads one snapshot file
2. **Client-Side Filtering**: All filtering/search done in browser
3. **Memoization**: React.memo and useMemo used throughout
4. **Delta Fetching**: Only fetches new items using cursors
5. **Caching**: API routes use Cache-Control headers

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support
2. **Focus Indicators**: Visible focus rings on all interactive elements
3. **ARIA Labels**: All buttons and controls have proper labels
4. **Reduced Motion**: Respects user preferences
5. **High Contrast**: Uses existing color tokens

## Next Steps

1. **Test Ingestion**: Run locally to verify all adapters work
2. **Add More Sources**: Extend `SOURCE_REGISTRY` in `src/lib/updates/sources.ts`
3. **Monitor First Run**: Check GitHub Actions after first scheduled run
4. **Review Sample Data**: Verify items display correctly on `/updates` page
5. **Enhance Enrichment**: Add more deterministic tags based on content analysis
