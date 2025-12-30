# News and Updates - Quick Start Guide

## Overview

The News and Updates feature provides an automated, secure, and legally compliant way to aggregate and display updates from authoritative sources related to energy system digitalisation, cybersecurity, AI governance, data architecture, standards, and tooling.

## Key Features

- **Automated Ingestion**: Scheduled GitHub Actions workflow runs every 6 hours
- **Security First**: SSRF protection, hostname allowlisting, content sanitization
- **Legal Compliance**: Licence-aware content handling, metadata-only for restrictive sources
- **Trust & Provenance**: Every item shows source, fetch time, and licence posture
- **Multiple Audience Modes**: Executive, Engineer, and Learner views
- **Fail-Safe Design**: Automatic fallback to last-good snapshot if validation fails

## Running Ingestion Locally

```bash
npm run news:ingest
```

This will:
1. Fetch data from all configured sources (NVD, CISA KEV, GOV.UK, NCSC, arXiv)
2. Normalize and validate all items
3. Generate snapshots (`latest.json`, `last-good.json`)
4. Create an ingestion report
5. Archive snapshots (60-day retention)

## Viewing Updates

Visit `/updates` in your browser to see the News and Updates interface.

## Source Configuration

Sources are configured in `src/lib/updates/sources.ts`. Each source includes:
- Allowed hostnames (SSRF protection)
- Licence posture
- Refresh cadence
- Adapter reference

## Data Storage

- **Location**: `data/news/`
- **Files**:
  - `latest.json` - Most recent snapshot (may be invalid)
  - `last-good.json` - Last validated snapshot (used as fallback)
  - `state.json` - Ingestion state (cursors, timestamps)
  - `report.json` - Latest ingestion report
  - `archive/` - Daily snapshots (60-day retention)

## Manual Trigger

The GitHub Actions workflow can be manually triggered:
1. Go to Actions tab in GitHub
2. Select "News Ingestion Pipeline"
3. Click "Run workflow"

## Troubleshooting

### Ingestion Fails

Check `data/news/report.json` for detailed error information per source.

### No Data Showing

1. Verify `data/news/last-good.json` exists
2. Check API routes are accessible: `/api/updates/latest` and `/api/updates/last-good`
3. Review browser console for errors

### Build Errors

Ensure all dependencies are installed:
```bash
npm install
```

## Architecture

- **Ingestion**: `scripts/news-ingest/main.ts` orchestrates the pipeline
- **Adapters**: `scripts/news-ingest/adapters/` handle source-specific parsing
- **Validation**: `src/lib/updates/validation.ts` provides multi-stage validation
- **UI**: `src/app/updates/page.tsx` displays the interface
- **API**: `src/app/api/updates/` serves snapshots

## Security Considerations

- All URLs are validated against allowlists
- Private IP ranges are blocked
- Content is sanitized to prevent XSS
- Licence gates enforce content restrictions
- Content hashes ensure integrity

## Adding New Sources

1. Add source entry to `src/lib/updates/sources.ts`
2. Create adapter in `scripts/news-ingest/adapters/`
3. Update adapter switch in `scripts/news-ingest/main.ts`
4. Test locally before deploying
