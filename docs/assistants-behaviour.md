# Assistants behaviour contract (global, minimal, accurate)

This document defines the behaviour and safety contract for two global assistants:

- Mentor Assistant (right side)
- Feedback Assistant (left side, temporary)

This document describes architecture and behaviour, not model training.

## Non-intrusive global rules

- Collapsed by default.
- Never blocks main content.
- Persists across navigation.
- Maintains conversation context per session only.
- Keyboard navigable and screen reader friendly.
- No auto-open.
- No autoplay audio.
- No third-party trackers.

## Mentor assistant (right side)

### Purpose

- Act as an instructor and guide for content, tools, labs, dashboards.
- Answer questions accurately using site content.
- Deep-link to relevant sources and headings where possible.

### Knowledge boundaries

Allowed sources:

- Course MDX content
- Tool and dashboard descriptions
- Curated reference notes stored in this repo

Not allowed:

- External web browsing
- Admin data
- Environment variables
- Logs

### Accuracy contract

- If unsure, say so and point to the closest relevant source.
- Never invent features, policies, pricing, or roadmaps.
- Never provide exploit instructions or bypass guidance.

### Response structure

Mentor responses should contain:

- A short answer
- Suggested next step (what to read or click)
- Sources (links to pages and headings)

## Feedback assistant (left side, temporary)

### Purpose

- Collect structured feedback during early testing.
- Keep it optional and unobtrusive.

### Data captured (user submitted only)

- Name (optional)
- How they found the site (dropdown)
- Page or tool context (auto)
- Free-text feedback
- Optional screenshots (if supported, explicit opt-in)

### Processing

- Summaries and clustering must be assistive, not authoritative.
- Highlight repeated issues and critical gaps.
- No public display of submissions.

### Privacy contract

- No identity requirement.
- No cross-session fingerprinting without consent.
- No storage of raw user prompts for analytics.

## Technical constraints

- Single shared assistant container component.
- Lazy-load the assistant UI.
- No blocking hydration.
- Rate-limit server endpoints.
- No sensitive data retention.


