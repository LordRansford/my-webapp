# Known limitations (CPD evidence and certificates)

This document tracks intentional limitations in the current CPD evidence, audit trail, and certificate system.
Learning remains free and accessible regardless of certificate status.

## Evidence capture

- Evidence capture is intentionally minimal. It is designed to be defensible, not exhaustive.
- Not all learning signals are captured yet. Some activity remains local until more server backed tracking is added.
- Evidence payloads are sanitized and length limited. Uploaded files are not stored as evidence in this phase.

## Eligibility rules

- Eligibility uses a simple rule set:
  - entitlement status must be eligible
  - evidence count must be at least 3
  - at least one quiz evidence must exist
- Course completion checks are still evolving. Where completion is not fully authoritative, the system uses best available signals and leaves TODOs for hardening.

## Certificate ID generation

- Certificate IDs are generated to be human friendly and unique.
- The current implementation uses a retry strategy to avoid collisions under concurrent issuance.
  - A dedicated sequence table can be added later if needed for strict monotonic guarantees.

## Storage

- Local development stores PDFs on disk.
- Production uses Vercel Blob when configured via `BLOB_READ_WRITE_TOKEN`.
- Downloads are always access controlled by the authenticated user, and the API streams the PDF bytes.

## Audit trail

- Audit events are recorded for evidence, payment confirmation, issuance, and downloads.
- Stripe webhook retries can create duplicate audit events in rare cases. This is acceptable for compliance, but can be de duplicated later if needed.


