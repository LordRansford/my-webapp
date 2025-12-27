"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";
import LoadingState from "@/components/LoadingState";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { motionPresets, reducedMotionProps } from "@/lib/motion";

const loading = () => <LoadingState label="Preparing tool" compact />;

// Dashboards are loaded per-route to keep the /dashboards tool shell small and predictable.
// These are all client-side educational tools; SSR is disabled for each tool component.
const AIDatasetExplorer = dynamic(() => import("@/components/dashboards/ai/AIDatasetExplorer"), { ssr: false, loading });
const FeatureEngineeringPlayground = dynamic(() => import("@/components/dashboards/ai/FeatureEngineeringPlayground"), { ssr: false, loading });
const LinearModelPlayground = dynamic(() => import("@/components/dashboards/ai/LinearModelPlayground"), { ssr: false, loading });
const DecisionBoundarySandbox = dynamic(() => import("@/components/dashboards/ai/DecisionBoundarySandbox"), { ssr: false, loading });
const ClusteringExplorer = dynamic(() => import("@/components/dashboards/ai/ClusteringExplorer"), { ssr: false, loading });
const DimensionalityReductionView = dynamic(() => import("@/components/dashboards/ai/DimensionalityReductionView"), { ssr: false, loading });
const EvaluationMetricsExplorer = dynamic(() => import("@/components/dashboards/ai/EvaluationMetricsExplorer"), { ssr: false, loading });
const ConfusionMatrixInspector = dynamic(() => import("@/components/dashboards/ai/ConfusionMatrixInspector"), { ssr: false, loading });
const BiasFairnessDashboard = dynamic(() => import("@/components/dashboards/ai/BiasFairnessDashboard"), { ssr: false, loading });
const EmbeddingVisualizer = dynamic(() => import("@/components/dashboards/ai/EmbeddingVisualizer"), { ssr: false, loading });
const PromptPlayground = dynamic(() => import("@/components/dashboards/ai/PromptPlayground"), { ssr: false, loading });
const RetrievalSandbox = dynamic(() => import("@/components/dashboards/ai/RetrievalSandbox"), { ssr: false, loading });
const InferenceCostEstimator = dynamic(() => import("@/components/dashboards/ai/InferenceCostEstimator"), { ssr: false, loading });
const PipelineOrchestrator = dynamic(() => import("@/components/dashboards/ai/PipelineOrchestrator"), { ssr: false, loading });
const DriftMonitorSimulator = dynamic(() => import("@/components/dashboards/ai/DriftMonitorSimulator"), { ssr: false, loading });
const TransformerAttentionExplorer = dynamic(() => import("@/components/dashboards/ai/TransformerAttentionExplorer"), { ssr: false, loading });
const AgentWorkflowBuilder = dynamic(() => import("@/components/dashboards/ai/AgentWorkflowBuilder"), { ssr: false, loading });
const DiffusionToy = dynamic(() => import("@/components/dashboards/ai/DiffusionToy"), { ssr: false, loading });
const AIUseCasePortfolio = dynamic(() => import("@/components/dashboards/ai/AIUseCasePortfolio"), { ssr: false, loading });
const AIGovernanceBoard = dynamic(() => import("@/components/dashboards/ai/AIGovernanceBoard"), { ssr: false, loading });

const SystemLandscapeCanvas = dynamic(() => import("@/components/dashboards/architecture/SystemLandscapeCanvas"), { ssr: false, loading });
const DomainModelSandbox = dynamic(() => import("@/components/dashboards/architecture/DomainModelSandbox"), { ssr: false, loading });
const CouplingCohesionVisualizer = dynamic(() => import("@/components/dashboards/architecture/CouplingCohesionVisualizer"), { ssr: false, loading });
const MicroserviceBoundaryDesigner = dynamic(() => import("@/components/dashboards/architecture/MicroserviceBoundaryDesigner"), { ssr: false, loading });
const DataStoragePlanner = dynamic(() => import("@/components/dashboards/architecture/DataStoragePlanner"), { ssr: false, loading });
const RequestJourneyExplorer = dynamic(() => import("@/components/dashboards/architecture/RequestJourneyExplorer"), { ssr: false, loading });
const CQRSPlanner = dynamic(() => import("@/components/dashboards/architecture/CQRSPlanner"), { ssr: false, loading });
const EventFlowModeler = dynamic(() => import("@/components/dashboards/architecture/EventFlowModeler"), { ssr: false, loading });
const ResiliencePatternSandbox = dynamic(() => import("@/components/dashboards/architecture/ResiliencePatternSandbox"), { ssr: false, loading });
const CapacityScalingPlanner = dynamic(() => import("@/components/dashboards/architecture/CapacityScalingPlanner"), { ssr: false, loading });
const CachingEffectSimulator = dynamic(() => import("@/components/dashboards/architecture/CachingEffectSimulator"), { ssr: false, loading });
const DeploymentTopologyMapper = dynamic(() => import("@/components/dashboards/architecture/DeploymentTopologyMapper"), { ssr: false, loading });
const LatencyBudgetExplorer = dynamic(() => import("@/components/dashboards/architecture/LatencyBudgetExplorer"), { ssr: false, loading });
const AvailabilitySLOPlanner = dynamic(() => import("@/components/dashboards/architecture/AvailabilitySLOPlanner"), { ssr: false, loading });
const ChangeRiskSimulator = dynamic(() => import("@/components/dashboards/architecture/ChangeRiskSimulator"), { ssr: false, loading });
const SecurityZoneDesigner = dynamic(() => import("@/components/dashboards/architecture/SecurityZoneDesigner"), { ssr: false, loading });
const ObservabilityCoveragePlanner = dynamic(() => import("@/components/dashboards/architecture/ObservabilityCoveragePlanner"), { ssr: false, loading });
const MultiTenancyPlanner = dynamic(() => import("@/components/dashboards/architecture/MultiTenancyPlanner"), { ssr: false, loading });
const TechDebtRadar = dynamic(() => import("@/components/dashboards/architecture/TechDebtRadar"), { ssr: false, loading });
const ADRBoard = dynamic(() => import("@/components/dashboards/architecture/ADRBoard"), { ssr: false, loading });

const DigitalMaturityRadarDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DigitalMaturityRadarDashboard"), { ssr: false, loading });
const DataLifecycleMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataLifecycleMapDashboard"), { ssr: false, loading });
const SystemCapabilityMatrixDashboard = dynamic(() => import("@/components/dashboards/digitalisation/SystemCapabilityMatrixDashboard"), { ssr: false, loading });
const DataCatalogueExplorerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataCatalogueExplorerDashboard"), { ssr: false, loading });
const DataQualityDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataQualityDashboard"), { ssr: false, loading });
const MetadataLineageMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/MetadataLineageMapDashboard"), { ssr: false, loading });
const InteroperabilityStandardsMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/InteroperabilityStandardsMapDashboard"), { ssr: false, loading });
const ApiCatalogueDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ApiCatalogueDashboard"), { ssr: false, loading });
const ConsentPolicySandboxDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ConsentPolicySandboxDashboard"), { ssr: false, loading });
const DataSharingAgreementCanvasDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DataSharingAgreementCanvasDashboard"), { ssr: false, loading });
const ReferenceDataStewardshipDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ReferenceDataStewardshipDashboard"), { ssr: false, loading });
const DigitalServiceJourneyMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/DigitalServiceJourneyMapDashboard"), { ssr: false, loading });
const ProcessAutomationHeatmapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/ProcessAutomationHeatmapDashboard"), { ssr: false, loading });
const LegacyTargetPlannerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/LegacyTargetPlannerDashboard"), { ssr: false, loading });
const PlatformStrategyCanvasDashboard = dynamic(() => import("@/components/dashboards/digitalisation/PlatformStrategyCanvasDashboard"), { ssr: false, loading });
const OutcomeKPIDashboard = dynamic(() => import("@/components/dashboards/digitalisation/OutcomeKPIDashboard"), { ssr: false, loading });
const RiskControlRegisterDashboard = dynamic(() => import("@/components/dashboards/digitalisation/RiskControlRegisterDashboard"), { ssr: false, loading });
const StakeholderPersonaMapDashboard = dynamic(() => import("@/components/dashboards/digitalisation/StakeholderPersonaMapDashboard"), { ssr: false, loading });
const RoadmapInitiativePlannerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/RoadmapInitiativePlannerDashboard"), { ssr: false, loading });
const BenefitRealisationTrackerDashboard = dynamic(() => import("@/components/dashboards/digitalisation/BenefitRealisationTrackerDashboard"), { ssr: false, loading });

const PasswordEntropyDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PasswordEntropyDashboard"), {
  ssr: false,
  loading,
});
const HashingPlaygroundDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/HashingPlaygroundDashboard"), {
  ssr: false,
  loading,
});
const SymmetricCryptoLabDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/SymmetricCryptoLabDashboard"), {
  ssr: false,
  loading,
});
const PublicPrivateKeyLabDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PublicPrivateKeyLabDashboard"), {
  ssr: false,
  loading,
});
const TLSToyHandshakeDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/TLSToyHandshakeDashboard"), {
  ssr: false,
  loading,
});
const UrlSafetyChecklistDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/UrlSafetyChecklistDashboard"), {
  ssr: false,
  loading,
});
const DnsResolutionExplorerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/DnsResolutionExplorerDashboard"), {
  ssr: false,
  loading,
});
const PortSurfaceConceptDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PortSurfaceConceptDashboard"), {
  ssr: false,
  loading,
});
const NetworkZonesMapDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/NetworkZonesMapDashboard"), {
  ssr: false,
  loading,
});
const ThreatModelCanvasDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/ThreatModelCanvasDashboard"), {
  ssr: false,
  loading,
});
const RiskMatrixBuilderDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/RiskMatrixBuilderDashboard"), {
  ssr: false,
  loading,
});
const AccessControlMatrixDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/AccessControlMatrixDashboard"), {
  ssr: false,
  loading,
});
const DataClassificationDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/DataClassificationDashboard"), {
  ssr: false,
  loading,
});
const LogTriageSandboxDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/LogTriageSandboxDashboard"), {
  ssr: false,
  loading,
});
const PhishingEmailTrainerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PhishingEmailTrainerDashboard"), {
  ssr: false,
  loading,
});
const VulnerabilityRegisterDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/VulnerabilityRegisterDashboard"), {
  ssr: false,
  loading,
});
const ControlCoverageMapDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/ControlCoverageMapDashboard"), {
  ssr: false,
  loading,
});
const IncidentTimelineDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/IncidentTimelineDashboard"), {
  ssr: false,
  loading,
});
const RedBlueExercisePlannerDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/RedBlueExercisePlannerDashboard"), {
  ssr: false,
  loading,
});
const PolicyExceptionRegisterDashboard = dynamic(() => import("@/components/dashboards/cybersecurity/PolicyExceptionRegisterDashboard"), {
  ssr: false,
  loading,
});

const TOOL_REGISTRY = {
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

const CATEGORY_LABELS = {
  ai: "AI",
  architecture: "Architecture",
  cybersecurity: "Cybersecurity",
  digitalisation: "Digitalisation",
};

const COURSE_LINKS = {
  ai: "/ai",
  architecture: "/software-architecture",
  cybersecurity: "/cybersecurity",
  digitalisation: "/digitalisation",
};

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="rn-callout" role="alert">
      <div className="rn-callout-title">Dashboard unavailable</div>
      <div className="rn-callout-body">
        <p>This dashboard could not be loaded. This might be a temporary issue.</p>
        {process.env.NODE_ENV !== "production" && error && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Technical details</summary>
            <pre className="mt-2 overflow-auto text-xs">{error?.message || String(error)}</pre>
          </details>
        )}
        <button onClick={resetErrorBoundary} className="rn-btn rn-btn-primary rn-mt" type="button">
          Try again
        </button>
      </div>
    </div>
  );
}

export default function ClientPage({ params }) {
  const category = params?.category;
  const tool = params?.tool;
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  const entry = useMemo(() => {
    if (!category || !tool) return null;
    return TOOL_REGISTRY?.[category]?.[tool] || null;
  }, [category, tool]);

  const title = entry?.title || "Dashboard tool";
  const categoryLabel = CATEGORY_LABELS[category] || "Further practice";
  const backHref = category ? `/dashboards/${category}` : "/dashboards";
  const courseHref = COURSE_LINKS[category] || "/";

  useEffect(() => {
    if (reduce) {
      setReady(true);
      return;
    }
    setReady(false);
    const t = setTimeout(() => setReady(true), 140);
    return () => clearTimeout(t);
  }, [category, tool, reduce]);

  if (!entry || !entry.Component) {
    return (
      <NotesLayout
        meta={{
          title: "Dashboard not found",
          description: "The requested dashboard could not be found.",
          section: category,
          slug: `/dashboards/${category}/${tool}`,
          level: "Further practice",
        }}
        headings={[]}
      >
        <div className="mb-4">
          <Link href={backHref} className="rn-mini rn-card-link">
            ← Back to {categoryLabel} dashboards
          </Link>
        </div>
        <div className="rn-callout">
          <div className="rn-callout-title">Dashboard not found</div>
          <div className="rn-callout-body">
            <p>The dashboard {tool} in category {categoryLabel} could not be found.</p>
            <Link href={backHref} className="rn-btn rn-btn-primary rn-mt">
              Go back
            </Link>
          </div>
        </div>
      </NotesLayout>
    );
  }

  const Component = entry.Component;

  return (
    <NotesLayout
      meta={{
        title: title,
        description: `${categoryLabel} dashboard: ${title}`,
        section: category,
        slug: `/dashboards/${category}/${tool}`,
        level: "Further practice",
      }}
      headings={[]}
    >
      <div className="mb-4">
        <Link href={backHref} className="rn-mini rn-card-link">
          ← Back to {categoryLabel} dashboards
        </Link>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <LazyMotion features={domAnimation}>
          <m.div {...reducedMotionProps(reduce, motionPresets.fadeIn)}>
            <Component />
          </m.div>
        </LazyMotion>
      </ErrorBoundary>
    </NotesLayout>
  );
}
