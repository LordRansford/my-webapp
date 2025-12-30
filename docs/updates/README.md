# News and Updates System

This directory contains documentation for the automated News and Updates ingestion and display system.

## Overview

The News and Updates system provides a curated index of authoritative sources for:
- Energy system digitalisation
- Cybersecurity (CVE tracking, advisories)
- AI governance and regulation
- Data architecture and standards
- Tooling and interoperability

## Key Features

- **Free to Run**: Uses only GitHub Actions and repository storage
- **Legally Safe**: Explicit source allowlist with licence posture enforcement
- **Secure**: SSRF prevention, HTML sanitization, host allowlisting
- **Resilient**: Automatic failover to last-good snapshot
- **Accessible**: WCAG 2.2 AA compliant, keyboard navigation, screen reader support

## Documentation

- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Complete technical overview
- [Source Registry](../src/lib/updates/sources.ts) - Source allowlist and configuration
- [Ingestion Scripts](../../scripts/news-ingest/) - Source adapters and orchestration

## Running Locally

```bash
# Install dependencies (if needed)
npm install

# Run ingestion
node scripts/news-ingest/main.mjs

# Or with TypeScript support
npx tsx scripts/news-ingest/main.mjs
```

## Adding New Sources

1. Add entry to `SOURCE_REGISTRY` in `src/lib/updates/sources.ts`
2. Create adapter in `scripts/news-ingest/adapters/[source-id].ts`
3. Export fetch function: `export async function fetch[SourceId](...)`
4. Test locally before committing

## Source Requirements

- Must be authoritative (government, standards body, primary dataset)
- Must have clear licence posture (OGL, CC0, public-domain-like, or restrictive)
- Must provide RSS/Atom feed, API, or downloadable dataset
- Must be legally safe to index (metadata-only if licence unclear)

## Status

The system runs automatically via GitHub Actions every 6 hours. Check `.github/workflows/news-ingest.yml` for schedule.

Frontend is available at `/updates` route.
