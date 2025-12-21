# Data migration plan (JSON store to database)

This repo currently uses JSON files under `data/` for auth, billing/history, templates, and audit logs.
This document outlines a future migration path without changing product behavior.

## Target tables (proposed)

### auth_users
- **pk**: `id` (string UUID)
- fields: `email`, `name`, `image`, `provider`, `created_at`, `entitlements`, `entitlement_source`
- indexes: `email` unique

### auth_accounts
- **pk**: `id`
- fields: `user_id`, `provider`, `provider_account_id`, tokens, metadata
- indexes: (`provider`, `provider_account_id`) unique

### auth_sessions
- **pk**: `id`
- fields: `session_token`, `user_id`, `expires`
- indexes: `session_token` unique, `user_id`

### cpd_state
- **pk**: `user_id`
- fields: `state_json`, `updated_at`

### billing_user_plan
- **pk**: `user_id`
- fields: `plan`, `source`, `updated_at`

### billing_tool_runs
- **pk**: `id`
- fields: `user_id` nullable, `anonymous_user_id` nullable, `tool_id`, `timestamp`, `metadata_json`
- indexes: (`user_id`, `timestamp`), (`anonymous_user_id`, `timestamp`)

### billing_template_downloads
- **pk**: `id`
- fields: `user_id` nullable, `anonymous_user_id` nullable, `template_id`, `license_choice`, `signature_policy`, `timestamp`, `metadata_json`
- indexes: (`user_id`, `timestamp`)

### billing_donations
- **pk**: `id`
- fields: `stripe_event_id` unique, `stripe_session_id`, `stripe_payment_intent_id`, `amount`, `currency`, `status`, `user_id` nullable, `created_at`
- indexes: `stripe_event_id` unique, `user_id`

### cpd_audit_log
- **pk**: `id`
- fields: `event_type`, `entity_type`, `entity_id`, `previous_version`, `new_version`, `changed_by`, `timestamp`, `notes`
- indexes: (`entity_type`, `entity_id`, `timestamp`)

## Immutability expectations
- Evidence, tool runs, template downloads, donations, and audit logs are append-only.
- Corrections create new rows, never in-place overwrites.

## Migration steps (outline)
1. Introduce storage interfaces that wrap current JSON reads and writes.
2. Implement database storage behind the same interfaces.
3. Backfill:
   - users, sessions, accounts
   - billing events
   - CPD state and audit log
4. Add dual-write in a short transition window if required.
5. Remove JSON writes after verification.


