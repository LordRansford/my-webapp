# Credit model and metering contract (user trust first)

This document defines the policy contract for credits and compute metering in Ransford’s Notes.

This is specification only. It does not implement payments, Stripe, UI, backend billing logic, or storing balances.

## 1) Credit unit model

### 1.1 What 1 credit represents

**1 credit represents 1 compute unit (CU)**, an abstract unit that maps to bounded compute work, not to time spent on the site.

A compute unit is designed to be:

- deterministic
- comparable across tools
- stable during a user session

### 1.2 Why credits are abstracted

Credits are abstracted from raw infrastructure cost because raw cost changes over time:

- provider pricing changes
- optimisation work changes cost per run
- workloads differ across tools

If users were billed directly on infrastructure cost, they could be surprised by backend changes. Credits protect users by keeping the unit stable and predictable, while the platform absorbs small backend cost changes.

### 1.3 Determinism and stability rules

Credits must:

- be deterministic for the same tool, inputs, and options
- be consistent across tools through a shared metering model
- never fluctuate mid-session
- be computed from declared drivers (input size, iterations, model choice), not from hidden factors

## 2) Free tier vs paid tier boundary

The free tier exists to keep learning accessible and to maintain trust.

### 2.1 Free-tier ceilings

Define three ceilings:

- **Per run** free ceiling: the maximum compute allowed for a single run without credits.
- **Per session** free ceiling: the total free compute allowed per session across tools.
- **Per day** free ceiling: the total free compute allowed per day across tools.

Rules:

- Free-tier usage never consumes credits.
- Paid usage applies only above free-tier limits.
- Free-tier limits sit slightly below typical browser capability to avoid crashes and device overheating.

### 2.2 Why this boundary is essential

- It prevents surprise charging for baseline learning.
- It keeps the platform usable without accounts.
- It protects device health and user experience on mobile.
- It creates a clear, auditable rule: free remains free, paid is explicit.

## 3) Pre-run cost estimation

Any run that may exceed the free tier must show a pre-run estimate.

### 3.1 Required estimation

Estimation is mandatory when:

- inputs are near free-tier thresholds
- advanced options increase compute materially
- the run could become credit-consuming

### 3.2 What the estimate must show

For a potentially paid run, show:

- expected-case credits
- worst-case credits (upper bound)
- drivers: file size, rows, text length, iterations, selected options
- whether browser-only mode is available

### 3.3 Confirmation requirement

If credits may be consumed:

- require explicit user confirmation
- show the maximum spend cap for that run
- default to “do not spend credits”

### 3.4 When estimation may be skipped

Estimation may be skipped only when:

- the run is guaranteed to stay within free-tier limits, based on known drivers

## 4) Post-run cost breakdown

After every run, show:

- credits consumed (0 for free tier)
- time taken (wall clock)
- whether the run crossed the free boundary
- what triggered paid usage
- optimisation tips

User test:

If a learner cannot answer “What did I do that cost money?” from the post-run summary, the contract is failing.

## 5) Insufficient credit handling

If the user lacks sufficient credit:

- block execution before starting
- explain what would have happened
- offer downgrade options:
  - smaller dataset
  - fewer iterations
  - browser-only mode

Explicitly prohibited:

- partial silent execution
- truncating output while claiming completion

## 6) Credit expiry and visibility

### 6.1 Default expiry recommendation

Default recommended expiry window: **24 months** from purchase.

Why expiry exists:

- fairness and sustainability
- long-term accounting clarity
- avoids “stored value forever” expectations

### 6.2 Visibility rules

Expiry must be visible:

- wherever credit balance is displayed
- before any credit-consuming action
- in purchase receipts (once payments exist)

Warnings:

- warn clearly before expiry (for example 30 days and 7 days)
- no hidden forfeiture

## 7) Donation separation

Donations are not credits.

Rules:

- donations fund free-tier sustainability
- donations do not grant paid compute entitlement
- donations do not alter limits

Optional courtesy tokens:

If courtesy tokens are ever introduced, they must:

- be clearly labelled as temporary and discretionary
- never replace purchased credits
- never imply entitlement

Ethical justification:

Separating donations from credits prevents confusion and avoids pressure on learners to donate in order to learn.

## 8) Conservative scenarios for user understanding

These are examples for explanation only. They are estimates, not guarantees.

1. **£10 gets you roughly**
   - Enough for occasional credit-consuming runs over a few weeks, if you keep inputs small and avoid reruns.

2. **This lab will usually cost**
   - Most runs should be free tier. Costs appear when you increase dataset size or iterations beyond the free boundary.

3. **Optimising inputs saves**
   - Reducing rows, shortening text, and avoiding unnecessary reruns typically reduces compute units and keeps you within free tier.

4. **Browser-only mode costs**
   - Browser-only mode is free tier and aims to remain available for learning.

5. **Large files increase cost by**
   - Larger files increase cost because they increase parsing, memory pressure, and algorithmic steps. The estimate will show this before you run.

## Text diagrams (contract flow)

Free run:

Business intent → Estimate (free) → Run → Cost breakdown (0 credits)

Potentially paid run:

Business intent → Estimate (expected + worst) → Confirm max spend → Run → Cost breakdown + explanation

## Rejected alternatives

- **Unlimited subscriptions**: hard to keep trust, encourages overuse, increases abuse and cost risk.
- **Charging for access**: conflicts with education-first and open access principles.
- **Dynamic pricing per run**: unpredictable and likely to feel unfair.
- **Silent “best effort” truncation**: breaks trust and undermines learning evidence.

## Assumptions and trade-offs

- Browser-first computation remains the default.
- Paid compute is for extra capacity, not basic learning.
- Clear limits and explanations beat maximum capability.


