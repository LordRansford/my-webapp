"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import LoadingState from "@/components/LoadingState";
import type { DashboardCategoryId, DashboardCatalogItem } from "./types";

const loading = () => <LoadingState label="Preparing tool" compact />;

function resolveDashboardComponent(mod: any) {
  if (mod?.default) return mod.default;
  const firstFn = Object.values(mod || {}).find((v) => typeof v === "function");
  return firstFn || (() => null);
}

// Dashboards are loaded per-route to keep the /dashboards tool shell small and predictable.
// These are all client-side educational tools; SSR is disabled for each tool component.
const AIDatasetExplorer = dynamic(() => import("@/components/dashboards/ai/AIDatasetExplorer").then(resolveDashboardComponent), { ssr: false, loading });
const FeatureEngineeringPlayground = dynamic(() => import("@/components/dashboards/ai/FeatureEngineeringPlayground").then(resolveDashboardComponent), { ssr: false, loading });
const LinearModelPlayground = dynamic(() => import("@/components/dashboards/ai/LinearModelPlayground").then(resolveDashboardComponent), { ssr: false, loading });
const DecisionBoundarySandbox = dynamic(() => import("@/components/dashboards/ai/DecisionBoundarySandbox").then(resolveDashboardComponent), { ssr: false, loading });
const ClusteringExplorer = dynamic(() => import("@/components/dashboards/ai/ClusteringExplorer").then(resolveDashboardComponent), { ssr: false, loading });
const DimensionalityReductionView = dynamic(() => import("@/components/dashboards/ai/DimensionalityReductionView").then(resolveDashboardComponent), { ssr: false, loading });
const EvaluationMetricsExplorer = dynamic(() => import("@/components/dashboards/ai/EvaluationMetricsExplorer").then(resolveDashboardComponent), { ssr: false, loading });
const ConfusionMatrixInspector = dynamic(() => import("@/components/dashboards/ai/ConfusionMatrixInspector").then(resolveDashboardComponent), { ssr: false, loading });
const BiasFairnessDashboard = dynamic(() => import("@/components/dashboards/ai/BiasFairnessDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const EmbeddingVisualizer = dynamic(() => import("@/components/dashboards/ai/EmbeddingVisualizer").then(resolveDashboardComponent), { ssr: false, loading });
const PromptPlayground = dynamic(() => import("@/components/dashboards/ai/PromptPlayground").then(resolveDashboardComponent), { ssr: false, loading });
const RetrievalSandbox = dynamic(() => import("@/components/dashboards/ai/RetrievalSandbox").then(resolveDashboardComponent), { ssr: false, loading });
const InferenceCostEstimator = dynamic(() => import("@/components/dashboards/ai/InferenceCostEstimator").then(resolveDashboardComponent), { ssr: false, loading });
const PipelineOrchestrator = dynamic(() => import("@/components/dashboards/ai/PipelineOrchestrator").then(resolveDashboardComponent), { ssr: false, loading });
const DriftMonitorSimulator = dynamic(() => import("@/components/dashboards/ai/DriftMonitorSimulator").then(resolveDashboardComponent), { ssr: false, loading });
const TransformerAttentionExplorer = dynamic(() => import("@/components/dashboards/ai/TransformerAttentionExplorer").then(resolveDashboardComponent), { ssr: false, loading });
const AgentWorkflowBuilder = dynamic(() => import("@/components/dashboards/ai/AgentWorkflowBuilder").then(resolveDashboardComponent), { ssr: false, loading });
const DiffusionToy = dynamic(() => import("@/components/dashboards/ai/DiffusionToy").then(resolveDashboardComponent), { ssr: false, loading });
const AIUseCasePortfolio = dynamic(() => import("@/components/dashboards/ai/AIUseCasePortfolio").then(resolveDashboardComponent), { ssr: false, loading });
const AIGovernanceBoard = dynamic(() => import("@/components/dashboards/ai/AIGovernanceBoard").then(resolveDashboardComponent), { ssr: false, loading });

const SystemLandscapeCanvas = dynamic(() => import("@/components/dashboards/architecture/SystemLandscapeCanvas").then(resolveDashboardComponent), { ssr: false, loading });
const DomainModelSandbox = dynamic(() => import("@/components/dashboards/architecture/DomainModelSandbox").then(resolveDashboardComponent), { ssr: false, loading });
const CouplingCohesionVisualizer = dynamic(() => import("@/components/dashboards/architecture/CouplingCohesionVisualizer").then(resolveDashboardComponent), { ssr: false, loading });
const MicroserviceBoundaryDesigner = dynamic(() => import("@/components/dashboards/architecture/MicroserviceBoundaryDesigner").then(resolveDashboardComponent), { ssr: false, loading });
const DataStoragePlanner = dynamic(() => import("@/components/dashboards/architecture/DataStoragePlanner").then(resolveDashboardComponent), { ssr: false, loading });
const RequestJourneyExplorer = dynamic(() => import("@/components/dashboards/architecture/RequestJourneyExplorer").then(resolveDashboardComponent), { ssr: false, loading });
const CQRSPlanner = dynamic(() => import("@/components/dashboards/architecture/CQRSPlanner").then(resolveDashboardComponent), { ssr: false, loading });
const EventFlowModeler = dynamic(() => import("@/components/dashboards/architecture/EventFlowModeler").then(resolveDashboardComponent), { ssr: false, loading });
const ResiliencePatternSandbox = dynamic(() => import("@/components/dashboards/architecture/ResiliencePatternSandbox").then(resolveDashboardComponent), { ssr: false, loading });
const CapacityScalingPlanner = dynamic(() => import("@/components/dashboards/architecture/CapacityScalingPlanner").then(resolveDashboardComponent), { ssr: false, loading });
const CachingEffectSimulator = dynamic(() => import("@/components/dashboards/architecture/CachingEffectSimulator").then(resolveDashboardComponent), { ssr: false, loading });
const DeploymentTopologyMapper = dynamic(() => import("@/components/dashboards/architecture/DeploymentTopologyMapper").then(resolveDashboardComponent), { ssr: false, loading });
const LatencyBudgetExplorer = dynamic(() => import("@/components/dashboards/architecture/LatencyBudgetExplorer").then(resolveDashboardComponent), { ssr: false, loading });
const AvailabilitySLOPlanner = dynamic(() => import("@/components/dashboards/architecture/AvailabilitySLOPlanner").then(resolveDashboardComponent), { ssr: false, loading });
const ChangeRiskSimulator = dynamic(() => import("@/components/dashboards/architecture/ChangeRiskSimulator").then(resolveDashboardComponent), { ssr: false, loading });
const SecurityZoneDesigner = dynamic(() => import("@/components/dashboards/architecture/SecurityZoneDesigner").then(resolveDashboardComponent), { ssr: false, loading });
const ObservabilityCoveragePlanner = dynamic(() => import("@/components/dashboards/architecture/ObservabilityCoveragePlanner").then(resolveDashboardComponent), { ssr: false, loading });
const MultiTenancyPlanner = dynamic(() => import("@/components/dashboards/architecture/MultiTenancyPlanner").then(resolveDashboardComponent), { ssr: false, loading });
const TechDebtRadar = dynamic(() => import("@/components/dashboards/architecture/TechDebtRadar").then(resolveDashboardComponent), { ssr: false, loading });
const ADRBoard = dynamic(() => import("@/components/dashboards/architecture/ADRBoard").then(resolveDashboardComponent), { ssr: false, loading });

const DigitalMaturityRadarDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DigitalMaturityRadarDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const DataLifecycleMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataLifecycleMapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const SystemCapabilityMatrixDashboard = dynamic(() => import("@/components/dashboards/digitalisation/SystemCapabilityMatrixDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const DataCatalogueExplorerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataCatalogueExplorerDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const DataQualityDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataQualityDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const MetadataLineageMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/MetadataLineageMapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const InteroperabilityStandardsMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/InteroperabilityStandardsMapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const ApiCatalogueDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ApiCatalogueDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const ConsentPolicySandboxDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ConsentPolicySandboxDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const DataSharingAgreementCanvasDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataSharingAgreementCanvasDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const ReferenceDataStewardshipDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ReferenceDataStewardshipDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const DigitalServiceJourneyMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DigitalServiceJourneyMapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const ProcessAutomationHeatmapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ProcessAutomationHeatmapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const LegacyTargetPlannerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/LegacyTargetPlannerDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const PlatformStrategyCanvasDashboard = dynamic(() => import("@/components/dashboards/digitalisation/PlatformStrategyCanvasDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const OutcomeKPIDashboard = dynamic(() => import("@/components/dashboards/digitalisation/OutcomeKPIDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const RiskControlRegisterDashboard = dynamic(() => import("@/components/dashboards/digitalisation/RiskControlRegisterDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const StakeholderPersonaMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/StakeholderPersonaMapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const RoadmapInitiativePlannerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/RoadmapInitiativePlannerDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const BenefitRealisationTrackerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/BenefitRealisationTrackerDashboard").then(resolveDashboardComponent), { ssr: false, loading });

const PasswordEntropyDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PasswordEntropyDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const HashingPlaygroundDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/HashingPlaygroundDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const SymmetricCryptoLabDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/SymmetricCryptoLabDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const PublicPrivateKeyLabDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PublicPrivateKeyLabDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const TLSToyHandshakeDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/TLSToyHandshakeDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const UrlSafetyChecklistDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/UrlSafetyChecklistDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const DnsResolutionExplorerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/DnsResolutionExplorerDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const PortSurfaceConceptDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PortSurfaceConceptDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const NetworkZonesMapDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/NetworkZonesMapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const ThreatModelCanvasDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/ThreatModelCanvasDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const RiskMatrixBuilderDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/RiskMatrixBuilderDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const AccessControlMatrixDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/AccessControlMatrixDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const DataClassificationDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/DataClassificationDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const LogTriageSandboxDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/LogTriageSandboxDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const PhishingEmailTrainerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PhishingEmailTrainerDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const VulnerabilityRegisterDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/VulnerabilityRegisterDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const ControlCoverageMapDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/ControlCoverageMapDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const IncidentTimelineDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/IncidentTimelineDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const RedBlueExercisePlannerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/RedBlueExercisePlannerDashboard").then(resolveDashboardComponent), { ssr: false, loading });
const PolicyExceptionRegisterDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PolicyExceptionRegisterDashboard").then(resolveDashboardComponent), { ssr: false, loading });

export type DashboardToolComponent = ComponentType;

export type DashboardToolRegistryEntry = {
  title: string;
  Component: DashboardToolComponent;
};

export const DASHBOARD_TOOL_REGISTRY: Record<DashboardCategoryId, Record<string, DashboardToolRegistryEntry>> = {
  ai: {
    "dataset-explorer": { title: "Dataset explorer", Component: AIDatasetExplorer },
    "feature-engineering": { title: "Feature engineering playground", Component: FeatureEngineeringPlayground },
    "linear-model": { title: "Linear model playground", Component: LinearModelPlayground },
    "decision-boundary": { title: "Decision boundary sandbox", Component: DecisionBoundarySandbox },
    clustering: { title: "Clustering explorer", Component: ClusteringExplorer },
    "dimensionality-reduction": { title: "Dimensionality reduction view", Component: DimensionalityReductionView },
    "evaluation-metrics": { title: "Evaluation metrics explorer", Component: EvaluationMetricsExplorer },
    "confusion-matrix": { title: "Confusion matrix inspector", Component: ConfusionMatrixInspector },
    "bias-fairness": { title: "Bias and fairness dashboard", Component: BiasFairnessDashboard },
    "embedding-visualiser": { title: "Embedding visualiser", Component: EmbeddingVisualizer },
    "prompt-playground": { title: "Prompt playground", Component: PromptPlayground },
    "retrieval-sandbox": { title: "Retrieval sandbox", Component: RetrievalSandbox },
    "inference-cost": { title: "Inference cost estimator", Component: InferenceCostEstimator },
    "pipeline-orchestrator": { title: "Pipeline orchestrator", Component: PipelineOrchestrator },
    "drift-simulator": { title: "Drift monitor simulator", Component: DriftMonitorSimulator },
    "transformer-attention": { title: "Transformer attention explorer", Component: TransformerAttentionExplorer },
    "agent-workflow": { title: "Agent workflow builder", Component: AgentWorkflowBuilder },
    "diffusion-toy": { title: "Diffusion image toy", Component: DiffusionToy },
    "ai-use-case-portfolio": { title: "AI use case portfolio", Component: AIUseCasePortfolio },
    "ai-governance": { title: "AI governance board", Component: AIGovernanceBoard },
  },
  architecture: {
    "system-landscape": { title: "System landscape canvas", Component: SystemLandscapeCanvas },
    "domain-model": { title: "Domain model sandbox", Component: DomainModelSandbox },
    "coupling-cohesion": { title: "Coupling and cohesion visualiser", Component: CouplingCohesionVisualizer },
    "microservice-boundaries": { title: "Microservice boundary designer", Component: MicroserviceBoundaryDesigner },
    "data-storage-planner": { title: "Data storage planner", Component: DataStoragePlanner },
    "request-journey": { title: "Request journey explorer", Component: RequestJourneyExplorer },
    "cqrs-planner": { title: "CQRS planner", Component: CQRSPlanner },
    "event-flow-model": { title: "Event flow modeller", Component: EventFlowModeler },
    "resilience-sandbox": { title: "Resilience pattern sandbox", Component: ResiliencePatternSandbox },
    "capacity-scaling": { title: "Capacity and scaling planner", Component: CapacityScalingPlanner },
    "cache-effect": { title: "Caching effect simulator", Component: CachingEffectSimulator },
    "deployment-topology": { title: "Deployment topology mapper", Component: DeploymentTopologyMapper },
    "latency-budget": { title: "Latency budget explorer", Component: LatencyBudgetExplorer },
    "availability-slo": { title: "Availability and SLO planner", Component: AvailabilitySLOPlanner },
    "change-risk": { title: "Change risk simulator", Component: ChangeRiskSimulator },
    "security-zones": { title: "Security zone designer", Component: SecurityZoneDesigner },
    "observability-coverage": { title: "Observability coverage planner", Component: ObservabilityCoveragePlanner },
    multitenancy: { title: "Multi tenancy planner", Component: MultiTenancyPlanner },
    "tech-debt": { title: "Tech debt radar", Component: TechDebtRadar },
    "adr-board": { title: "ADR board", Component: ADRBoard },
  },
  cybersecurity: {
    "password-entropy": { title: "Password entropy dashboard", Component: PasswordEntropyDashboard },
    "hashing-playground": { title: "Hashing playground", Component: HashingPlaygroundDashboard },
    "symmetric-crypto-lab": { title: "Symmetric encryption lab", Component: SymmetricCryptoLabDashboard },
    "public-private-key-lab": { title: "Public and private key lab", Component: PublicPrivateKeyLabDashboard },
    "tls-toy-handshake": { title: "TLS toy handshake", Component: TLSToyHandshakeDashboard },
    "url-safety-checklist": { title: "URL safety checklist", Component: UrlSafetyChecklistDashboard },
    "dns-resolution-explorer": { title: "DNS resolution explorer", Component: DnsResolutionExplorerDashboard },
    "port-surface-concept": { title: "Port and service surface concept", Component: PortSurfaceConceptDashboard },
    "network-zones-map": { title: "Network zones map", Component: NetworkZonesMapDashboard },
    "threat-model-canvas": { title: "Threat model canvas", Component: ThreatModelCanvasDashboard },
    "risk-matrix-builder": { title: "Risk matrix builder", Component: RiskMatrixBuilderDashboard },
    "access-control-matrix": { title: "Access control matrix", Component: AccessControlMatrixDashboard },
    "data-classification-board": { title: "Data classification board", Component: DataClassificationDashboard },
    "log-triage-sandbox": { title: "Log triage sandbox", Component: LogTriageSandboxDashboard },
    "phishing-email-trainer": { title: "Phishing email trainer", Component: PhishingEmailTrainerDashboard },
    "vulnerability-register": { title: "Vulnerability register", Component: VulnerabilityRegisterDashboard },
    "control-coverage-map": { title: "Control coverage map", Component: ControlCoverageMapDashboard },
    "incident-timeline-builder": { title: "Incident timeline builder", Component: IncidentTimelineDashboard },
    "red-blue-exercise-planner": { title: "Red team and blue team planner", Component: RedBlueExercisePlannerDashboard },
    "policy-exception-register": { title: "Policy and exception register", Component: PolicyExceptionRegisterDashboard },
  },
  digitalisation: {
    "digital-maturity-radar": { title: "Digital maturity radar", Component: DigitalMaturityRadarDashboard },
    "data-lifecycle-map": { title: "Data lifecycle map", Component: DataLifecycleMapDashboard },
    "system-capability-matrix": { title: "System capability matrix", Component: SystemCapabilityMatrixDashboard },
    "data-catalogue-explorer": { title: "Data catalogue explorer", Component: DataCatalogueExplorerDashboard },
    "data-quality-dashboard": { title: "Data quality cockpit", Component: DataQualityDashboard },
    "metadata-lineage-map": { title: "Metadata and lineage map", Component: MetadataLineageMapDashboard },
    "interoperability-standards-map": { title: "Interoperability and standards map", Component: InteroperabilityStandardsMapDashboard },
    "api-catalogue": { title: "API catalogue and harmonisation", Component: ApiCatalogueDashboard },
    "consent-policy-sandbox": { title: "Consent and policy sandbox", Component: ConsentPolicySandboxDashboard },
    "data-sharing-agreement": { title: "Data sharing agreement canvas", Component: DataSharingAgreementCanvasDashboard },
    "reference-data-stewardship": { title: "Reference data stewardship board", Component: ReferenceDataStewardshipDashboard },
    "digital-service-journey-map": { title: "Digital service journey map", Component: DigitalServiceJourneyMapDashboard },
    "process-automation-heatmap": { title: "Process automation heatmap", Component: ProcessAutomationHeatmapDashboard },
    "legacy-target-planner": { title: "Legacy and target state planner", Component: LegacyTargetPlannerDashboard },
    "platform-strategy-canvas": { title: "Platform strategy canvas", Component: PlatformStrategyCanvasDashboard },
    "outcome-kpi-dashboard": { title: "Outcome and KPI dashboard", Component: OutcomeKPIDashboard },
    "risk-control-register": { title: "Risk and control register", Component: RiskControlRegisterDashboard },
    "stakeholder-persona-map": { title: "Stakeholder and persona map", Component: StakeholderPersonaMapDashboard },
    "roadmap-initiative-planner": { title: "Roadmap and initiative planner", Component: RoadmapInitiativePlannerDashboard },
    "benefit-realisation-tracker": { title: "Benefit realisation tracker", Component: BenefitRealisationTrackerDashboard },
  },
};

export const DASHBOARD_CATEGORIES: Array<{ id: DashboardCategoryId; title: string; description: string; href: string }> = [
  { id: "ai", title: "AI", description: "Data, models, evaluation, and governance sandboxes.", href: "/dashboards/ai" },
  { id: "architecture", title: "Architecture", description: "System design, reliability, and trade-off exploration.", href: "/dashboards/architecture" },
  { id: "cybersecurity", title: "Cybersecurity", description: "Security fundamentals, crypto toys, and risk thinking.", href: "/dashboards/cybersecurity" },
  { id: "digitalisation", title: "Digitalisation", description: "Operating model, data lifecycle, and portfolio tools.", href: "/dashboards/digitalisation" },
];

export function getDashboardsRegistry(): DashboardCatalogItem[] {
  const out: DashboardCatalogItem[] = [];
  (Object.keys(DASHBOARD_TOOL_REGISTRY) as DashboardCategoryId[]).forEach((category) => {
    const tools = DASHBOARD_TOOL_REGISTRY[category] || {};
    Object.keys(tools).forEach((tool) => {
      const entry = tools[tool];
      out.push({
        id: `${category}:${tool}`,
        kind: "dashboard",
        title: entry.title,
        description: `${category} dashboard tool.`,
        href: `/dashboards/${category}/${tool}`,
        category,
        tool,
        tags: [category, "dashboard"],
        badges: [{ label: "Browser", tone: "emerald" }],
      });
    });
  });
  return out;
}

