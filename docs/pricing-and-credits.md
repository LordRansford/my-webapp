# Pricing, credits and compute metering (design only)

This document defines the pricing philosophy and a technically enforceable credits and compute metering model for Ransford’s Notes.

This is design and specification only. It does not implement payments, Stripe, billing logic, UI changes, or authentication changes.

## 1) Pricing philosophy (education-first and trust-first)

The platform exists to teach. Pricing must never undermine learning or trust.

Principles:

- **Education first**: core courses and baseline tools remain usable without an account.
- **Trust first**: no hidden charges, no surprise limits, no vague pricing.
- **Free tier remains free**: baseline usage stays free forever.
- **Credits are for extra computation**: credits do not unlock content or basic access.
- **Donations are separate**: donations support the work. Donations do not grant credits and do not change limits.
- **Predictable cost**: users should understand what they are paying for, before they spend.
- **Safety over revenue**: hard technical limits exist to protect devices and the service, even for paying users.

## 2) Credit model (precise definition)

### 2.1 What a credit is

- A **credit** is a monetary abstraction used to pay for compute above the free tier threshold.
- Credits represent the cost of running a job, not time spent on the site.
- Credits are not a subscription and do not imply entitlement to unlimited compute.

### 2.2 Minimum purchase

- Minimum credit purchase: **£10**.

### 2.3 Free tier interaction

- Free-tier computation is always free, even if a user has credits.
- Credits are only consumed **above** the free computation threshold.

### 2.4 Consumption rules

- Credits are consumed only when a run is explicitly confirmed as credit-consuming.
- A run must show an estimate and require a clear user confirmation before any credit consumption.
- Credits are **non-refundable once consumed**.

### 2.5 Expiry recommendation

Recommendation: credits should expire after **24 months** from purchase.

Justification:

- Keeps liabilities manageable and encourages predictable accounting.
- Gives users a reasonable amount of time for casual use.
- Avoids indefinite “stored value” expectations while still being fair.

Constraints:

- Expiry must be communicated clearly at purchase time and in the pricing page.
- If expiry is introduced, it must apply only to newly purchased credits, with clear notice.

Alternative considered and rejected:

- **No expiry**: simpler, but increases long-term liability and operational ambiguity.
- **Short expiry (3 to 6 months)**: likely to feel punitive and erode trust.

## 3) Free computation threshold (browser-first)

### 3.1 Why “below browser capability”

The free threshold should sit slightly below what a typical browser can technically do, because:

- Browsers vary widely by device, thermal constraints, and background load.
- A run that “almost” works is worse than a clear limit, because it causes timeouts, battery drain, and poor trust.
- Predictable performance is part of the learning experience.

### 3.2 Device-aware thresholds (safely)

The free threshold must vary by device class:

- **Mobile browsers**: lower thresholds to avoid thermal throttling and background suspension.
- **Desktop browsers**: higher thresholds, still bounded.

The device class should be inferred using safe heuristics (screen size and concurrency hints) without fingerprinting.

### 3.3 Hard stop vs soft warning

- **Soft warning**: shown when a run is likely to exceed free limits, before execution.
- **Hard stop**: enforced when the run would exceed the free tier boundary without explicit opt-in.

Soft warnings help users adjust input sizes. Hard stops protect device health and platform cost.

## 4) Compute metering model (what is measured)

Metering must be understandable and technically enforceable.

### 4.1 What to measure

Measure a small set of drivers that map to cost and stability:

- **Input size**: number of rows, characters, tokens, file size.
- **Algorithmic work**: iterations, steps, or rule evaluations.
- **Wall-clock time**: time spent executing the run.
- **Memory pressure**: peak memory estimate where feasible.

The metering model should avoid measuring private device characteristics and should not require invasive fingerprinting.

### 4.2 Browser-only computation

For Class A (browser-only) work:

- Meter primarily for user visibility and device safety, not server cost.
- Free usage stays free, but runs can still be capped to prevent runaway computation.

### 4.3 Hybrid browser + server helpers

For Class B (hybrid) work:

- Meter server-assisted steps explicitly.
- Prefer bounded transforms with known upper limits.
- Credit eligibility applies only above the free threshold and only after explicit confirmation.

### 4.4 Estimated vs actual cost

Users must see:

- An **estimated cost** before running (with clear “estimate” labelling).
- The **actual cost** after running.

If the estimate changes materially during execution, the run must pause and ask for confirmation before exceeding the estimate.

### 4.5 Insufficient credits mid-run

If credits are insufficient:

- The run must stop politely.
- The user must see what completed and what did not.
- The system must not silently truncate results and pretend the job completed.

## 5) User-facing transparency requirements

### 5.1 Compute meter per run

Each run should show:

- Inputs that drove cost (rows, file size, text length)
- Execution time (wall clock)
- Whether the run was free-tier or credit-eligible
- Any hard stops triggered

### 5.2 Plain-English explanation

After each run, provide a short explanation:

- “This run used more compute because you uploaded a larger file.”
- “This run used more compute because you enabled an advanced option.”

### 5.3 “How to reduce compute usage” guidance

Provide contextual guidance, not generic scolding:

- Use smaller inputs
- Use sample datasets first
- Reduce rows or shorten text
- Avoid unnecessary reruns
- Start with the simplest option and scale up

### 5.4 Scenario transparency

Provide example scenarios for **£10, £25, £50** with clear “estimate” language.

Examples must be framed as:

- placeholders
- dependent on device, tool, and input size
- not a guarantee

## 6) File size and capability scaling

### 6.1 Free-tier limits

Define conservative default limits per tool type:

- text-based tools: a max character or token budget
- tabular tools: a max row and column budget
- file uploads: a strict maximum file size and type whitelist

### 6.2 Credit-extended limits

Credits may unlock higher limits above free tier, but always within absolute caps.

### 6.3 Absolute hard caps

Hard caps exist to prevent abuse and protect reliability:

- never allow unbounded uploads
- never allow unbounded run time
- never allow unbounded memory growth

### 6.4 Pre-upload warnings and validation

Before upload or run:

- show the relevant limit
- show a short explanation of why the limit exists
- offer suggestions to reduce input size

## 7) Compliance and ethics

- No dark patterns.
- No hidden background computation.
- No surprise charges.
- Explicit opt-in before any credit-consuming action.
- No identity-tied behavioural profiling.
- No third-party tracking in the core learning flow.

## 8) Future-proofing notes

### 8.1 Mapping to future mobile apps

The model must translate cleanly to Android and iOS:

- treat runs as bounded “jobs”
- keep the metering model simple and deterministic
- avoid reliance on background execution
- design for interruption and resumption where appropriate

### 8.2 CPD certificates later

Credits should not be required for CPD evidence. CPD certificates can be paid products later, but learning access must remain open.

### 8.3 Enterprise licensing later

Enterprise licensing can sit above this model by:

- bundling credits or funded usage caps
- adding organisational reporting

It must not introduce hidden metering or surprise charges.

## Assumptions and trade-offs

- The platform is browser-first and must remain usable on mobile.
- Serverless hosting must be treated as non-durable for local filesystem writes.
- Predictable limits and honest messaging are more important than extracting revenue early.


