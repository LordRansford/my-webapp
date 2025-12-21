# Dashboards & tools inventory (Phase 3)

This is an internal single source of truth for the dashboards and interactive tools exposed under `/dashboards/*`.

## Status legend

- **implemented**: renders and is interactive
- **needs-polish**: implemented but UX/teaching depth needs improvement
- **stubbed**: visible UI shell only (no blank screens)

## Top-level dashboard areas

| id | course | concept taught | expected inputs | expected outputs | status |
|---|---|---|---|---|---|
| ai | AI | Model + evaluation intuition | sliders/toggles/text inputs | metrics, charts, trade-offs | implemented |
| architecture | Software Architecture | System design trade-offs | selectors/sliders/canvas inputs | diagrams, risk points, recommendations | implemented |
| cybersecurity | Cybersecurity | Practical security reasoning | inputs (URLs/values), toggles, planners | checklists, matrices, dashboards | implemented |
| digitalisation | Digitalisation | Strategy + capability mapping | canvases, score sliders, text fields | maps, scorecards, plans | implemented |

## AI dashboards (`/dashboards/ai/*`)

| id | concept taught | expected inputs | expected outputs | status |
|---|---|---|---|---|
| dataset-explorer | Data distributions + missingness | dataset controls | summary stats/plots | implemented |
| feature-engineering | Transformations change signal | toggles/sliders | before/after comparison | implemented |
| linear-model | Linear regression intuition | sliders for parameters | loss/fit feedback | implemented |
| decision-boundary | Classification boundaries | toggles/sliders | boundary visualisation | implemented |
| clustering | Unsupervised grouping | k selection | cluster assignments | implemented |
| dimensionality-reduction | Projection trade-offs | method selector | projected view | implemented |
| evaluation-metrics | Precision/recall trade-offs | TP/FP/TN/FN sliders | metric cards | implemented |
| confusion-matrix | Error pattern reading | cell inputs | per-class summaries | implemented |
| bias-fairness | Group rate differences | rate sliders | fairness indicators | implemented |
| embedding-visualiser | Embedding intuition | selection controls | neighborhood view | implemented |
| prompt-playground | Prompt constraints | prompt fields/toggles | rubric output | implemented |
| retrieval-sandbox | RAG context effects | toggles/search inputs | answer changes | implemented |
| inference-cost | Cost/latency trade-offs | token/traffic sliders | cost estimates | implemented |
| pipeline-orchestrator | MLOps stage dependencies | add steps | warnings + plan | implemented |
| drift-simulator | Drift + detection timing | drift sliders | detection signals | implemented |
| transformer-attention | Attention weight intuition | token controls | attention map | implemented |
| agent-workflow | Agent flow + approvals | workflow builder | missing checks | implemented |
| diffusion-toy | Denoising intuition | step controls | grid output | implemented |
| ai-use-case-portfolio | Value vs feasibility | sliders/placements | quadrant view | implemented |
| ai-governance | Governance board basics | add/edit controls | board view | implemented |

## Architecture dashboards (`/dashboards/architecture/*`)

| id | concept taught | expected inputs | expected outputs | status |
|---|---|---|---|---|
| system-landscape | Systems + boundaries | canvas inputs | landscape map | implemented |
| domain-model | Domain modelling | nodes/links | model view | implemented |
| coupling-cohesion | Coupling hot spots | sliders/toggles | risk indicators | implemented |
| microservice-boundaries | Service slicing | selectors | boundary suggestions | implemented |
| data-storage-planner | Storage trade-offs | selects/sliders | recommendation summary | implemented |
| request-journey | Request path reasoning | step controls | journey map | implemented |
| cqrs-planner | CQRS trade-offs | toggles | pros/cons | implemented |
| event-flow-model | Event thinking | inputs | flow diagram | implemented |
| resilience-sandbox | Failure modes | toggles/sliders | resilience score | implemented |
| capacity-scaling | Capacity planning | sliders | capacity summary | implemented |
| cache-effect | Caching trade-offs | sliders | latency/cost deltas | implemented |
| deployment-topology | Deployment mapping | inputs | topology map | implemented |
| latency-budget | Budget allocation | sliders | budget breakdown | implemented |
| availability-slo | SLO intuition | sliders | SLO indicators | implemented |
| change-risk | Change risk | toggles | risk summary | implemented |
| security-zones | Zone boundaries | selectors | zone map | implemented |
| observability-coverage | Observability gaps | toggles | coverage summary | implemented |
| multitenancy | Tenant isolation | toggles | risk points | implemented |
| tech-debt | Debt visibility | item sliders | risk points | implemented |
| adr-board | Decision records | inputs | ADR list | implemented |

## Cybersecurity dashboards (`/dashboards/cybersecurity/*`)

| id | concept taught | expected inputs | expected outputs | status |
|---|---|---|---|---|
| password-entropy | Password search space | length + charset toggles | entropy + estimates | implemented |
| hashing-playground | Hash sensitivity | text/salt inputs | hash output | implemented |
| symmetric-crypto-lab | Shared-key crypto | inputs/keys | encrypt/decrypt output | implemented |
| public-private-key-lab | Asymmetric crypto | key ops | signatures/verification | implemented |
| tls-toy-handshake | TLS handshake intuition | step controls | handshake state | implemented |
| url-safety-checklist | URL checklist | URL input | labelled checks | implemented |
| dns-resolution-explorer | DNS resolution | hostname input | step output | implemented |
| port-surface-concept | Attack surface | toggles | surface indicator | implemented |
| network-zones-map | Segmentation | layout inputs | zone map | implemented |
| threat-model-canvas | Threat modelling | canvas inputs | threats list | implemented |
| risk-matrix-builder | Likelihood vs impact | risk entries | matrix + priorities | **needs-polish** |
| access-control-matrix | RBAC reasoning | role/resource inputs | matrix view | implemented |
| data-classification-board | Classification labels | drag/select | board state | implemented |
| log-triage-sandbox | Triage thinking | classify inputs | triage output | implemented |
| phishing-email-trainer | Phishing cues | select choices | feedback | implemented |
| vulnerability-register | Vuln management | add/edit rows | register view | implemented |
| control-coverage-map | Control families | sliders | heatmap | implemented |
| incident-timeline-builder | Incident narratives | event inputs | timeline view | implemented |
| red-blue-exercise-planner | Exercise planning | text fields | plan summary | implemented |
| policy-exception-register | Exception governance | row inputs | due/overdue indicators | implemented |

## Digitalisation dashboards (`/dashboards/digitalisation/*`)

| id | concept taught | expected inputs | expected outputs | status |
|---|---|---|---|---|
| digital-maturity-radar | Maturity dimensions | sliders | radar summary | implemented |
| data-lifecycle-map | Lifecycle + controls | text fields | lifecycle map + checklist | implemented |
| system-capability-matrix | Capabilities | matrix inputs | gaps view | implemented |
| data-catalogue-explorer | Catalogue basics | filters | list view | implemented |
| data-quality-dashboard | Quality dimensions | sliders | composite + guidance | implemented |
| metadata-lineage-map | Lineage thinking | inputs | lineage map | implemented |
| interoperability-standards-map | Standards constraints | toggles | map view | implemented |
| api-catalogue | API inventory | inputs | catalogue view | implemented |
| consent-policy-sandbox | Consent logic | toggles | policy outcomes | implemented |
| data-sharing-agreement | Agreement canvas | text inputs | agreement summary | implemented |
| reference-data-stewardship | Stewardship roles | inputs | board view | implemented |
| digital-service-journey-map | Journey mapping | steps inputs | journey map | implemented |
| process-automation-heatmap | Automation opportunity | sliders | heatmap | implemented |
| legacy-target-planner | Target state planning | inputs | plan summary | implemented |
| platform-strategy-canvas | Platform strategy | canvas inputs | canvas output | implemented |
| outcome-kpi-dashboard | KPIs | sliders/inputs | KPI cards | implemented |
| risk-control-register | Risk vs controls | rows | register view | implemented |
| stakeholder-persona-map | Stakeholders | persona inputs | map view | implemented |
| roadmap-initiative-planner | Roadmaps | initiative inputs | roadmap view | implemented |
| benefit-realisation-tracker | Benefits tracking | inputs | tracker view | implemented |


