# Cybersecurity Master Syllabus (Canonical)

**Status:** Canonical source-of-truth for implementation  
**Scope:** Cybersecurity course across three stages (Foundations → Applied → Practice & Strategy)  
**Safety:** Defensive-only. No exploit development, malware creation, or targeting real systems.  
**Audience:** Product, content, and engineering teams implementing curriculum, tools, assessments, and CPD evidence.

This document defines:
- **Module IDs** (stable identifiers for content, progress tracking, evidence, and assessments)
- **Required UI components** and the minimum props/behaviour each must support
- **Evidence schema fields** (what we record for CPD logs and certificate-grade assessments)
- **Assessment blueprint** per stage (formative checks + optional summative certification)

---

## 1) Non-negotiables (the standard)

### 1.1 Defensive-only boundary
The course must **not** teach:
- exploit development
- malware creation
- instructions for targeting real systems

The course **may** teach (defensive, inspection, and design):
- how failures happen in principle (e.g., “injection is untrusted input treated as instructions”)
- how to prevent, verify, detect, and recover
- how to inspect and diagnose **your own** systems or controlled examples (e.g., certificate inspection)

### 1.2 Gold-standard-plus requirements (what “done” means)
Every module must include:
- **Outcomes**: action verbs, measurable (“explain”, “design”, “review”, “diagnose”, “triage”)
- **Practice**: a tool/lab or structured exercise
- **Verification**: “how we would confirm this control works” (not “how to attack”)
- **Reflection**: short prompt that produces CPD evidence and reinforces judgement
- **Evidence event(s)**: recorded via standard schema below

### 1.3 Standards alignment (authoritative anchors)
We use these as *reference frames* and vocabulary, not as memorisation targets:
- **NIST CSF 2.0**: Govern, Identify, Protect, Detect, Respond, Recover
- **NIST SSDF**: secure development lifecycle practices and release gates
- **NIST SP 800-63 family**: identity concepts and assurance language (risk-based)
- **OWASP Top 10 (2021)**: web risk language (high-level)
- **OWASP ASVS (4.x)**: verification language (what “good” looks like)
- **OWASP SAMM v2**: maturity framing (how programmes grow)
- **CIS Critical Security Controls v8**: operational baseline vocabulary
- **MITRE ATT&CK**: used only for *detection/coverage taxonomy* and communication (no step-by-step)

---

## 2) ID system (stable identifiers)

### 2.1 Course + stage IDs
- `courseId`: `cybersecurity`
- `stageId` (maps to existing level IDs):
  - Stage 1: `foundations`
  - Stage 2: `applied`
  - Stage 3: `practice`

### 2.2 Module ID format
Each module has a stable `moduleId`:

`cyber.<stageId>.<moduleKey>`

Example: `cyber.foundations.f0-what-security-is`

### 2.3 Section ID format (progress + evidence granularity)
Each module has one or more trackable `sectionId`s.

`<stageId>-<moduleKey>`

Example: `foundations-f0-what-security-is`

**Rule:** the `sectionId` used by UI progress toggles and quizzes must match this format.

### 2.4 Migration note (current implementation)
Current `cyberSections` and MDX section IDs are inconsistent in places. This master syllabus is the target. When implementing, add a mapping layer so existing IDs still resolve, then gradually migrate pages to canonical IDs.

---

## 3) Curriculum map (three stages)

### Stage 1 — Foundations
**Purpose:** first principles and safe everyday defensive judgement (personal + small org).

| moduleId | sectionId(s) | Canonical coverage | Primary outcomes (demonstrable) | Primary standards mapping |
|---|---|---|---|---|
| `cyber.foundations.f0-what-security-is` | `foundations-f0-what-security-is` | What security is/is not; vulnerability vs exploit vs incident vs breach; ethics/legal boundary | Explain core terms in plain language; explain why “secure” is contextual | CSF: Govern |
| `cyber.foundations.f1-risk-and-outcomes` | `foundations-f1-risk-and-outcomes` | assets, threats, likelihood/impact, residual risk; CIA + resilience/privacy/auditability intro | Justify a control choice using risk language; explain residual risk | CSF: Govern/Identify |
| `cyber.foundations.f2-data-and-integrity` | `foundations-f2-data-and-integrity` | bits/bytes/encodings; parsing/representation mistakes; hashing vs encryption (conceptually); integrity intuition | Explain why representation matters; explain hashing vs encryption correctly | CSF: Identify/Protect |
| `cyber.foundations.f3-networks-and-transport` | `foundations-f3-networks-and-transport` | networks/packets/metadata; HTTPS/TLS fundamentals; DNS basics; what “encrypted” does and does not hide | Explain what packets are; explain what metadata leaks; explain what TLS guarantees | CSF: Protect |
| `cyber.foundations.f4-cia-and-simple-attacks` | `foundations-f4-cia-and-simple-attacks` | CIA as decision lens; simple failure classes; controls as prevention/detection/recovery | Use CIA to explain impact; name controls by purpose | CSF: Govern/Protect/Detect |
| `cyber.foundations.f5-identity-and-access` | `foundations-f5-identity-and-access` | authentication vs authorisation; sessions/tokens (high level); MFA; least privilege | Spot risky shortcuts; explain blast radius | CSF: Protect; NIST 800-63 concepts |
| `cyber.foundations.f6-human-factors-and-phishing` | `foundations-f6-human-factors-and-phishing` | phishing/social engineering; incentives; safe verification habits; basic governance idea (ownership) | Identify phishing signals; explain why process failures matter | CSF: Protect/Detect/Govern |
| `cyber.foundations.f7-privacy-and-everyday-data-protection` | `foundations-f7-privacy-and-everyday-data-protection` | minimisation, retention, safe sharing; privacy threat modelling (intro) | Choose proportionate data handling; explain privacy trade-offs | CSF: Govern/Protect |
| `cyber.foundations.f8-foundations-capstone` | `foundations-f8-foundations-capstone` | Foundations capstone + checkpoint | Produce a defensible evidence artefact | All above |

**Required artefact (Stage 1):** Personal Security Baseline (PSB) — see §6.

---

### Stage 2 — Applied
**Purpose:** feature-level security reasoning: threat modelling, web/API risks, verification thinking.

| moduleId | sectionId(s) | Canonical coverage | Primary outcomes (demonstrable) | Primary standards mapping |
|---|---|---|---|---|
| `cyber.applied.a1-threat-modelling-as-design` | `applied-a1-threat-modelling-as-design` | trust boundaries, STRIDE (high-level), abuse cases vs user stories, mitigations | Produce a threat model for one feature; propose realistic mitigations | CSF: Identify; SSDF (design); STRIDE |
| `cyber.applied.a2-identity-and-access-control` | `applied-a2-identity-and-access-control` | sessions/cookies/tokens; RBAC vs ABAC; token leakage; broken access control patterns | Design/review access control; spot dangerous shortcuts | CSF: Protect; NIST 800-63 concepts |
| `cyber.applied.a3-web-app-security` | `applied-a3-web-app-security` | OWASP Top 10 in practice (risk categories); validation vs encoding; safe errors; secure defaults | Explain how vulnerabilities happen and how to prevent them | OWASP Top 10; ASVS (verification language) |
| `cyber.applied.a4-api-and-service-security` | `applied-a4-api-and-service-security` | auth models; key scope/rotation; rate limits; replay/idempotency; compatibility | Review an API design for abuse risks | CSF: Protect/Detect |
| `cyber.applied.a5-verification-and-release-gates` | `applied-a5-verification-and-release-gates` | “shift left”; what to verify; minimal gates; secure design reviews | Define verification steps; define release gates for a feature | SSDF; ASVS; SAMM |
| `cyber.applied.a6-logging-and-detection-basics` | `applied-a6-logging-and-detection-basics` | logging strategy; signals vs noise; first-hour thinking (intro) | Define high-value signals and a basic response plan | CSF: Detect/Respond; SRE (signals) |
| `cyber.applied.a7-applied-capstone` | `applied-a7-applied-capstone` | Applied capstone | Deliver a feature security review pack | All above |

**Required artefact (Stage 2):** Feature Security Review Pack (FSRP) — see §6.

---

### Stage 3 — Practice & Strategy
**Purpose:** operational security in real systems: SDLC, cloud/runtime, supply chain, vuln mgmt, detection/IR, and governance.

| moduleId | sectionId(s) | Canonical coverage | Primary outcomes (demonstrable) | Primary standards mapping |
|---|---|---|---|---|
| `cyber.practice.p1-secure-sdlc` | `practice-p1-secure-sdlc` | SSDF, SAMM maturity, secure requirements, design reviews, release gates | Place controls at each SDLC stage; define measurable gates | SSDF; SAMM |
| `cyber.practice.p2-exposure-reduction-zero-trust` | `practice-p2-exposure-reduction-zero-trust` | segmentation, WAF/WAF-like controls, closed-by-default, blast radius | Choose proportionate exposure reduction controls | CSF: Protect; CIS v8 vocab |
| `cyber.practice.p3-runtime-and-cloud-security` | `practice-p3-runtime-and-cloud-security` | secrets mgmt, env separation, least-privilege runtime identity, baselines | Reason about infra/runtime risk on managed platforms | CIS v8; CSF: Protect |
| `cyber.practice.p4-supply-chain-security` | `practice-p4-supply-chain-security` | provenance, patch cadence, build integrity, SBOM concept + limits | Define supply chain stance and policy | CSF: Govern/Protect; SSDF |
| `cyber.practice.p5-vulnerability-management` | `practice-p5-vulnerability-management` | CVEs, prioritisation, patch windows, coordinated disclosure | Triage vulns without panic; justify priority | CSF: Identify/Protect |
| `cyber.practice.p6-detection-and-incident-response` | `practice-p6-detection-and-incident-response` | logging/metrics/traces; alert quality; IR lifecycle; learning loop | Define signals + first-hour actions; produce incident timeline | CSF: Detect/Respond/Recover; SRE signals |
| `cyber.practice.p7-privacy-ethics-auditability` | `practice-p7-privacy-ethics-auditability` | privacy trade-offs, retention/deletion, auditability, ethics | Balance telemetry with privacy; define evidence quality | CSF: Govern |
| `cyber.practice.p8-system-ilities` | `practice-p8-system-ilities` | confidentiality, integrity, availability, resilience, reliability, auditability, usability, maintainability, etc. | Evaluate systems holistically, not control-by-control | CSF: Govern/Identify |
| `cyber.practice.p9-capstone-professional-practice` | `practice-p9-capstone-professional-practice` | portfolio capstone | Deliver an operational security pack | All above |

**Required artefact (Stage 3):** Operational Security Pack (OSP) — see §6.

---

## 4) Required UI components (implementation contract)

This section defines the **minimum UI building blocks** every cybersecurity module must use. Some already exist; others are required for the “gold standard+” implementation.

### 4.1 Required (already exists)
- **`SectionHeader`**
  - **Must support**: stable `id` anchors; consistent variants (`content`, `guide`, `practice`)
- **`SectionProgressToggle`**
  - **Must support**: `courseId`, `levelId`/`stageId`, and canonical `sectionId`
  - **Behaviour**: sets completion state; emits evidence events (see §5)
- **`CPDTracker`**
  - **Must support**: `courseId`, `levelId`/`stageId`, `estimatedHours`
  - **Behaviour**: records minutes and exports evidence summary
- **`ToolCard`**
  - **Must support**: stable `id`, `title`, `description`, and optional `courseId`, `levelId`, `sectionId`, `cpdMinutesOnUse`
  - **Behaviour**: on interaction, emits tool-use evidence event
- **`QuizBlock`**
  - **Must support**: stable `id`, `courseId`, `levelId`, `sectionId`, `title`, `questions`
  - **Behaviour**: records completion and score (if scored)
- **`Callout`**, **`GlossaryTip`**, **`DiagramBlock`**, **`MermaidDiagram`**, **`PageNav`**, **`Recap`**
  - Used to keep explanations human, structured, and accessible.

### 4.2 Required (to implement for certification-grade flow)
- **`VerificationChecklist`**
  - Captures: “How would you confirm this control works?” (checkboxes + short notes)
  - Outputs: evidence record attached to module completion
- **`EvidenceArtifactPanel`**
  - Shows the module’s contribution to PSB/FSRP/OSP
  - Supports export preview: what will be included in CPD evidence pack
- **`AssessmentGate`**
  - Rules: must be signed in + paid + prerequisites completed
  - Must hide paid questions until gate passes
- **`ScenarioExam`**
  - Item bank; timed; shuffling; attempt tracking; accessibility-friendly UI
- **`RubricViewer`**
  - Displays pass criteria and quality tiers for artefact marking

---

## 5) Evidence schema (fields and events)

### 5.1 Evidence record goals
Evidence must be:
- **auditable** (what happened, when, by whom)
- **portable** (exportable summary for CPD use)
- **privacy-preserving** (no sensitive user data required; redaction-friendly)

### 5.2 Core types (canonical)
Implement evidence storage as structured records. Suggested canonical shape:

```json
{
  "version": "1.0",
  "courseId": "cybersecurity",
  "stageId": "foundations",
  "moduleId": "cyber.foundations.f1-risk-and-outcomes",
  "sectionId": "foundations-f1-risk-and-outcomes",
  "eventType": "section_completed",
  "eventId": "uuid",
  "occurredAt": "2026-01-02T12:34:56.000Z",
  "minutes": 12,
  "metadata": {
    "source": "web",
    "ui": "SectionProgressToggle",
    "contentVersion": "git:COMMIT_SHA",
    "notes": "short learner note, optional"
  }
}
```

### 5.3 Required fields (all events)
- `version`
- `courseId`
- `stageId`
- `moduleId`
- `sectionId` (or `null` for course-wide events)
- `eventType` (see below)
- `eventId`
- `occurredAt` (ISO 8601)
- `minutes` (0 allowed; use when meaningful)
- `metadata.source` (e.g., `web`, `export`)
- `metadata.contentVersion` (commit SHA or content index version)

### 5.4 Event types
- `time_logged` (from CPD tracker)
- `section_started`
- `section_completed`
- `tool_used`
- `quiz_completed`
- `verification_completed`
- `artifact_updated`
- `artifact_submitted`
- `exam_attempt_started`
- `exam_attempt_completed`

### 5.5 Artefact linkage
Artefacts are bundles of evidence records plus learner-authored content.

Artefact IDs:
- Stage 1: `artifact.psb.v1`
- Stage 2: `artifact.fsrp.v1`
- Stage 3: `artifact.osp.v1`

Artefact record (suggested):

```json
{
  "artifactId": "artifact.fsrp.v1",
  "courseId": "cybersecurity",
  "stageId": "applied",
  "title": "Feature Security Review Pack",
  "createdAt": "2026-01-02T12:34:56.000Z",
  "updatedAt": "2026-01-02T13:10:00.000Z",
  "sections": [
    { "key": "scope", "content": "..." },
    { "key": "threatModel", "content": "..." },
    { "key": "controls", "content": "..." },
    { "key": "verification", "content": "..." },
    { "key": "signals", "content": "..." },
    { "key": "acceptedRisks", "content": "..." }
  ],
  "linkedEvidenceEventIds": ["uuid-1", "uuid-2"]
}
```

---

## 6) Artefact requirements (PSB / FSRP / OSP)

### 6.1 Stage 1 artefact: Personal Security Baseline (PSB)
**Artefact ID:** `artifact.psb.v1`

**Required sections**
- `identitySafety` (MFA coverage, recovery readiness, least-privilege habits)
- `passwordStrategy` (manager usage plan; avoids brittle rules)
- `phishingReflection` (what you missed + what you changed)
- `recoveryPlan` (device/account loss story + steps)
- `topRisks` (3 risks + mitigations + residual risk)

### 6.2 Stage 2 artefact: Feature Security Review Pack (FSRP)
**Artefact ID:** `artifact.fsrp.v1`

**Required sections**
- `scope` (feature boundary + assets)
- `dataFlows` (trust boundaries)
- `abuseCases` (vs user stories)
- `threatModel` (STRIDE-informed, high level)
- `controls` (preventive + detective)
- `verification` (how to confirm controls)
- `signals` (3–6 high-value signals + owner + action)
- `tradeOffs` (constraints + why)
- `acceptedRisks` (explicit + time-boxed)

### 6.3 Stage 3 artefact: Operational Security Pack (OSP)
**Artefact ID:** `artifact.osp.v1`

**Required sections**
- `sdlcAndGates` (requirements → design review → build/release gates → post-release monitoring)
- `runtimeSecurity` (secrets, env separation, identities, baselines)
- `supplyChain` (dependency policy, patch cadence, build integrity, SBOM stance + limits)
- `vulnTriageRubric` (severity + exploitability + exposure + asset criticality)
- `irFirstHourPlaybook` (roles, evidence, containment, comms)
- `detectionSignals` (quality vs noise; at least one effectiveness metric)
- `privacyAndAuditability` (retention/deletion + evidence quality)
- `maturityRoadmap90Days` (what changes next)

---

## 7) Assessment blueprint (per stage)

This blueprint supports two layers:
- **Formative learning checks** (free, low stakes)
- **Optional certification-grade assessment** (paid, timed, attempt-tracked)

### 7.1 Formative checks (all stages)
Minimum per module:
- 1 short **scenario-based** checkpoint (avoid pure definition questions)
- 1 verification prompt (“how would you confirm this works?”)
- 1 reflection prompt captured as evidence

### 7.2 Certification-grade assessment (optional, paid)
**Global rules**
- **Access**: gated by sign-in + payment + prerequisites complete
- **Attempts**: unlimited retakes allowed, but record attempt count internally
- **Anti-memorisation**: item bank, shuffling, variants, and (optional) cooldown after fails
- **Pass mark**: recommended **80%** for certification
- **Time limit**: recommended **75 minutes** for the timed exam component

#### Stage 1 (Foundations) certification blueprint
- **Timed scenario exam**
  - Target: **50 items / 75 minutes**
  - Distribution:
    - 30% phishing/social engineering judgement
    - 25% identity + safe defaults
    - 25% risk/CIA + trade-offs
    - 20% transport/TLS basics + privacy trade-offs
- **Practical artefact**
  - PSB submission required (`artifact.psb.v1`)
  - Rubric-based pass (meets minimum sections + coherence)

#### Stage 2 (Applied) certification blueprint
- **Timed scenario exam**
  - Target: **50 items / 75 minutes**
  - Distribution:
    - 30% threat modelling + abuse cases
    - 30% OWASP risk reasoning (not exploit steps)
    - 20% API/service abuse prevention design
    - 20% verification + logging signals
- **Practical artefact**
  - FSRP submission required (`artifact.fsrp.v1`)

#### Stage 3 (Practice & Strategy) certification blueprint
- **Timed scenario exam**
  - Target: **50 items / 75 minutes**
  - Distribution:
    - 25% SDLC + gates + maturity
    - 20% supply chain + vuln triage
    - 25% detection/IR first hour decisions
    - 15% cloud/runtime baselines
    - 15% privacy/auditability + “ilities” judgement
- **Capstone portfolio**
  - OSP submission required (`artifact.osp.v1`)
  - Includes at least one end-to-end scenario: design → verify → detect → recover

---

## 8) Relationship to existing docs

Existing documents provide useful detail but must not conflict with this master syllabus:
- `docs/courses/cybersecurity-foundations-spec.md`
- `docs/courses/cybersecurity-applied-spec.md`
- `docs/courses/cybersecurity-practice-spec.md`
- `docs/courses/rubrics/*`
- `docs/cpd/submission/cybersecurity-evidence.md`

**Rule:** when there is disagreement (e.g., module IDs, hours, assessment structure), this document wins. Update the others to match as a follow-up change.

---

## 9) Implementation checklist (engineering + content)
- Adopt canonical module + section IDs (§2) and add migration mapping for legacy IDs.
- Ensure every module page includes the required UI blocks (§4.1).
- Implement certification-grade UI blocks (§4.2) behind assessment gating.
- Implement evidence events and artefact storage per schema (§5–§6).
- Implement assessment blueprint per stage (§7) using item banks and attempt tracking.

