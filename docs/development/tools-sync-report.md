# Tools sync report

Generated: 2026-01-03T20:40:06.509Z

## Summary
- tools.js entries: 23
- contracts: 28
- catalog entries: 23

## Gaps (tools.js → contracts/catalog)
- Missing contract: 0
- Missing catalog: 0

## Potential drift (contracts/catalog not listed on tools page)
- Contracts not listed in tools.js: 5
  - architecture-diagram-studio
  - game-canvas
  - vision-quick-check
  - speech-sound-analysis
  - code-lab
- Catalog not listed in tools.js: 0

## Recommended next move
- Decide a single source of truth for "what is listed" (suggest: a `listed: true` flag in tool contracts).
- Generate tools page from merged tools-index (filtering by listed flag) to eliminate drift.
