# Compute architecture and limits (browser-first, safe by design)

This document defines the compute execution model, limits, lifecycle, and safety protections for Ransford’s Notes.

This is architecture and policy only. It does not implement code, infrastructure, queues, workers, orchestration, or UI.

## 1) Compute execution model

We define three execution classes. They exist to protect trust, cost, and device health.

### Class A: Browser-only compute

Characteristics:

- Runs fully client-side (WebAssembly, Web Workers, Pyodide, WebCrypto, JavaScript).
- Zero server compute cost by default.
- Default for all tools whenever feasible and safe.

Rationale:

- Keeps learning accessible without accounts.
- Avoids operational cost and billing complexity.
- Reduces the risk of abuse of server compute.

### Class B: Hybrid compute

Characteristics:

- Browser does most work.
- Server assists with validation, preprocessing, bounded transforms, or data shaping.
- Credit-eligible above the free tier threshold.

Rationale:

- Enables a few capabilities that are hard to do purely in-browser (bounded transforms, server-only validation, safe lookups).
- Keeps server work small and predictable.

### Class C: Server-bound compute

Characteristics:

- Explicitly opt-in and clearly labelled.
- Always credit-consuming (never free tier).
- Heavily sandboxed, rate-limited, and time-bounded.

Why Class C must remain rare:

- It is the primary driver of variable cost.
- It increases security risk and abuse risk.
- It undermines trust if not tightly controlled.
- It complicates future mobile support because background execution is unreliable on iOS and Android.

Class C should be used only when the educational value is high and browser-first alternatives are not feasible.

## 2) Hard technical limits (enforceable ceilings)

Limits exist for safety and predictability. Hard stops are non-negotiable, even for paying users.

Each tool run must have three limit tiers:

- **Free tier value**: always available.
- **Credit-extended value**: higher limit, only after explicit opt-in.
- **Absolute hard stop**: never exceeded.

### 2.1 CPU time per run

- Free tier: low, designed for interactive use.
- Credit-extended: moderate, still bounded.
- Absolute: strict cap to prevent runaway computation.

### 2.2 Memory usage per run

- Free tier: below typical mobile safe limits.
- Credit-extended: below typical desktop safe limits.
- Absolute: cap that prevents browser tab crashes and server OOM risks.

### 2.3 Iterations or steps

- Free tier: capped to keep runs responsive.
- Credit-extended: higher but bounded.
- Absolute: prevents infinite loops and pathological inputs.

### 2.4 Dataset size

- Free tier: conservative row or token budgets.
- Credit-extended: increased budgets where safe.
- Absolute: cap prevents abuse and ensures predictable execution.

### 2.5 Wall-clock timeout

- Free tier: short, interactive.
- Credit-extended: longer, still bounded.
- Absolute: always enforced to guarantee eventual termination.

Why hard stops are non-negotiable:

- Protects devices (thermal, battery, UI responsiveness).
- Protects service cost and reliability.
- Prevents denial-of-wallet and denial-of-service behaviour.
- Enables consistent user expectations and defensible CPD evidence.

## 3) Run lifecycle states

Every run must follow a clear lifecycle with explicit user-visible transitions.

1. **Pre-run estimation**
   - Show estimated cost and the drivers (input size, options, expected steps).
   - Identify whether the run is free tier or may consume credits.

2. **User confirmation**
   - Required if credits may be consumed.
   - Must be an explicit opt-in, not implied by clicking “run”.

3. **Execution**
   - Runs inside the selected compute class (A, B, or C).
   - Must support user cancellation.

4. **Metering**
   - Track usage according to the metering model.
   - If the run is exceeding estimate materially, pause and ask for confirmation before credit consumption beyond the estimate.

5. **Completion, partial completion, or termination**
   - Completion: normal result.
   - Partial completion: clearly labelled with explanation.
   - Termination: hard stop with explanation.

6. **Post-run explanation**
   - Explain what happened, what drove cost, and what could be changed to reduce compute.

Behaviour for interruptions:

- **Browser tab closes**: run terminates; no background continuation.
- **Navigation away**: run terminates unless explicitly designed to resume (future work, not assumed).
- **Device sleeps**: run pauses or terminates depending on environment; must report the reason.
- **Credit runs out mid-run**: run stops politely and explains what completed and why it stopped.

## 4) Graceful failure rules

The system must:

- Fail loudly but politely.
- Never silently truncate results.
- Always explain what stopped and why.
- Offer a retry suggestion or optimisation hint.

Explicitly prohibited:

- Silent “best effort” degradation without notice.
- Continuing computation after a user-visible cancellation.
- Partial results presented as complete.

## 5) Abuse and safety protections

These protections apply even to paying users. Payment does not entitle anyone to unlimited compute.

Non-negotiable protections:

- **Per-session compute caps**: limits on total compute per session across tools.
- **Per-IP rate limits**: protects server endpoints (hybrid and server-bound).
- **Per-device heuristics**: coarse classing (mobile vs desktop) without fingerprinting.
- **Anti-loop detection**: detect repeated runs with no input changes and warn or throttle.
- **Denial-of-wallet protection**: require explicit confirmation for any credit-consuming action and enforce per-run maximum spend.
- **Automated shutdown triggers**: if error rates spike or abuse signals appear, disable credit-consuming paths quickly.

## 6) Observability (user vs operator)

Separate what users can see from what operators can see.

Users can see:

- estimated cost before a run
- actual cost after a run
- what drove the cost (input size, options, steps)
- whether limits were hit and why

Operators can see (aggregated only):

- overall tool usage counts
- aggregate failure rates and timeouts
- aggregate compute class usage (A vs B vs C)
- aggregate credit consumption totals (when enabled)

Explicitly forbidden:

- user-level tracking beyond what is necessary for explicit account features
- cross-session fingerprinting without consent
- storing raw user prompts or raw tool inputs as analytics

## 7) Legal and ethical boundaries

This platform is not compute-as-a-service. It is an educational sandbox.

Not allowed:

- crypto-mining
- scraping at scale
- attack tooling or exploitation guidance
- any hidden background computation

Tools must remain educational and demonstrative.

## 8) Mobile and app store constraints

Design must not block future native apps.

iOS constraints:

- background execution is limited
- long-running compute may be suspended
- payment flows must use compliant store policies if sold in-app

Android constraints:

- thermal throttling is common on sustained compute
- background execution has limits depending on OS version and device policy

Implications:

- favour short, resumable jobs
- require explicit user intent for expensive runs
- never assume uninterrupted execution

## Assumptions, trade-offs, and rejected alternatives

Assumptions:

- Browser-first is the default.
- Serverless hosting requires careful cost bounding.
- Trust requires clear limits and honest messaging.

Trade-offs:

- Conservative limits may restrict some advanced demos, but protect reliability and learning experience.
- Hybrid and server-bound features should be rare to preserve predictability.

Rejected alternatives:

- Unlimited paid compute: unacceptable cost and abuse risk, undermines trust.
- Silent truncation: undermines CPD evidence and learner understanding.
- Device fingerprinting for limits: high privacy risk, not aligned with trust-first principles.


