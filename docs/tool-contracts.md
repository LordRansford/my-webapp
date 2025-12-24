# Tool & Studio Contracts (Purpose, Inputs, Limits, Outputs, Errors, Run Path)
Every tool/studio must declare this metadata and UI must render it. CI gate: tools missing any field fail.

## Fields (required per tool)
- `id`
- `route`
- `purpose`
- `inputs` (name, type, limits)
- `limits` (size/time/format)
- `outputs`
- `runPath` (local | compute-runner; endpoint/queue)
- `errorTaxonomy` (codes + user-facing guidance)
- `statusStates` (queued, running, completed, failed)

## Current Inventory

### Architecture Diagram Studio
- id: `architecture-diagram-studio`
- route: `/studios/architecture-diagram-studio`
- purpose: Generate draft architecture diagrams from structured inputs.
- inputs: systemName (string, 80 chars), systemDescription (string, 600 chars), audience (enum), goal (enum), actors/blocks/flows/security (arrays, capped by ARCH_DIAGRAM_LIMITS).
- limits: text length caps per field; diagram counts enforced in UI.
- outputs: Mermaid diagrams (context/container/DFD/sequence), SVG/PNG downloads, architecture brief and ADR stubs.
- runPath: local (browser-only).
- errorTaxonomy: `validation_error`, `generation_error`, `user_error` (missing required fields).
- statusStates: idle → validating → rendered | failed.

### Games (offline-capable)
- id: `game-canvas`
- routes: `/games/**`
- purpose: Interactive games with keyboard + touch; offline after first load.
- inputs: none; keyboard/touch controls.
- limits: offline caching after first load; device input required.
- outputs: run metrics, skill review.
- runPath: local (canvas).
- errorTaxonomy: `not_found`, `locked_route`, `offline_not_ready`.
- statusStates: loading → ready → running → paused → completed.

### Vision Quick Image Check (placeholder until wired)
- id: `vision-quick-check`
- route: `/labs/vision/quick-check`
- purpose: Validate and preview images; guide on size/format.
- inputs: image file (png/jpg/webp).
- limits: size <= defined lab limit; dimension guidance.
- outputs: validation result + preview.
- runPath: compute-runner (upload + validate) or local if small; clarify in UI.
- errorTaxonomy: `file_too_large`, `unsupported_format`, `processing_error`.
- statusStates: idle → uploading → processing → completed | failed.

### Speech Lab (sound analysis)
- id: `speech-sound-analysis`
- route: `/labs/speech/sound-analysis`
- purpose: Analyze uploaded/recorded audio; transcript + basic metrics.
- inputs: audio file (wav/mp3) or recording (if supported).
- limits: duration cap; filesize cap; recording requires browser support.
- outputs: transcript, duration, basic loudness/peaks.
- runPath: compute-runner (upload + process).
- errorTaxonomy: `recording_unsupported`, `file_too_large`, `unsupported_format`, `processing_error`.
- statusStates: idle → recording/uploading → processing → completed | failed.

### Code Lab (sandboxed execution)
- id: `code-lab`
- route: `/labs/code`
- purpose: Run code safely in sandbox (allowlisted languages).
- inputs: code, language selection.
- limits: CPU/memory/time quotas; no outbound network; package policy.
- outputs: stdout/stderr, exit status, resource usage summary.
- runPath: compute-runner via job queue (submit → poll → fetch artefact).
- errorTaxonomy: `validation_error`, `timeout`, `resource_limit`, `runtime_error`, `policy_denied`.
- statusStates: idle → queued → running → completed | failed.

> Expand this file as new tools/studios are added. CI should validate that every declared tool has UI metadata rendered.

