import Callout from "./Callout";
import PythonPlayground from "./PythonPlayground";
import RsaPlayground from "./RsaPlayground";
import DiagramBlock from "./DiagramBlock";
import ToolCard from "@/components/notes/ToolCard";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import SectionProgressToggle from "@/components/notes/SectionProgressToggle";
import LevelProgressBar from "@/components/course/LevelProgressBar";
import CPDTracker from "@/components/CPDTracker";
import PageNav from "@/components/notes/PageNav";
import ConceptMapExplorer from "@/components/ConceptMapExplorer";
import { ConceptBlock, WhyItMatters, HowItWorks, KeyTakeaways } from "@/components/notes/TeachingBlocks";
import { Definition, Warning, Example, CommonMistake } from "@/components/notes/CalloutBlocks";
import { Figure, Diagram, Icon, Table } from "./content";
import { EmailHeaderLab } from "@/components/tools/cybersecurity/EmailHeaderLab";
import { PhishingStorySimulator } from "@/components/tools/cybersecurity/PhishingStorySimulator";
import { SafeLinkInspector } from "@/components/tools/cybersecurity/SafeLinkInspector";
import dynamic from "next/dynamic";

const CookieInspector = dynamic(() => import("@/components/tools/cyber/CookieInspector").then(m => ({ default: m.CookieInspector })), { ssr: false });
const SecurityHeaderTool = dynamic(() => import("@/components/tools/cyber/SecurityHeaderTool").then(m => ({ default: m.SecurityHeaderTool })), { ssr: false });
const UrlSafetyTool = dynamic(() => import("@/components/tools/cyber/UrlSafetyTool").then(m => ({ default: m.UrlSafetyTool })), { ssr: false });
const EmailAuthTool = dynamic(() => import("@/components/tools/cyber/EmailAuthTool").then(m => ({ default: m.EmailAuthTool })), { ssr: false });
const BrowserStorageTool = dynamic(() => import("@/components/tools/cyber/BrowserStorageTool").then(m => ({ default: m.BrowserStorageTool })), { ssr: false });
const LogAnomalyTool = dynamic(() => import("@/components/tools/cyber/LogAnomalyTool").then(m => ({ default: m.LogAnomalyTool })), { ssr: false });
const RiskRegisterTool = dynamic(() => import("@/components/tools/cyber/RiskRegisterTool").then(m => ({ default: m.RiskRegisterTool })), { ssr: false });
const DnsQuickLensTool = dynamic(() => import("@/components/tools/cyber/DnsQuickLensTool").then(m => ({ default: m.DnsQuickLensTool })), { ssr: false });
const JwtExplainerTool = dynamic(() => import("@/components/tools/cyber/JwtExplainerTool").then(m => ({ default: m.JwtExplainerTool })), { ssr: false });
const PasswordStrengthTool = dynamic(() => import("@/components/tools/cyber/PasswordStrengthTool").then(m => ({ default: m.PasswordStrengthTool })), { ssr: false });
const EverydayChecklistTool = dynamic(() => import("@/components/tools/cyber/EverydayChecklistTool").then(m => ({ default: m.EverydayChecklistTool })), { ssr: false });
import BitChangeTool from "@/components/notes/tools/cybersecurity/ch1/BitChangeTool";
import CIAClassifierTool from "@/components/notes/tools/cybersecurity/ch1/CIAClassifierTool";
import MetadataLeakTool from "@/components/notes/tools/cybersecurity/ch1/MetadataLeakTool";
import PacketJourneyTool from "@/components/notes/tools/cybersecurity/ch1/PacketJourneyTool";
import PasswordEntropyTool from "@/components/notes/tools/cybersecurity/ch1/PasswordEntropyTool";
import RiskDial from "@/components/notes/tools/cybersecurity/ch1/RiskDial";
import AttackChainTool from "@/components/notes/tools/cybersecurity/ch3/AttackChainTool";
import BackupRansomwareRecoveryTool from "@/components/notes/tools/cybersecurity/ch3/BackupRansomwareRecoveryTool";
import ControlMappingTool from "@/components/notes/tools/cybersecurity/ch3/ControlMappingTool";
import IncidentTriageTool from "@/components/notes/tools/cybersecurity/ch3/IncidentTriageTool";
import LogStoryTool from "@/components/notes/tools/cybersecurity/ch3/LogStoryTool";
import ThreatModelCanvasTool from "@/components/notes/tools/cybersecurity/ch3/ThreatModelCanvasTool";
import VulnerabilityLifecycleTool from "@/components/notes/tools/cybersecurity/ch3/VulnerabilityLifecycleTool";
import ZeroTrustPolicyTool from "@/components/notes/tools/cybersecurity/ch3/ZeroTrustPolicyTool";
import ControlSelectionTool from "@/components/notes/tools/cybersecurity/practitioner/ControlSelectionTool";
import EvidenceChecklistTool from "@/components/notes/tools/cybersecurity/practitioner/EvidenceChecklistTool";
import FrameworkMappingTool from "@/components/notes/tools/cybersecurity/advanced/FrameworkMappingTool";
import SecurityCareerPlannerTool from "@/components/notes/tools/cybersecurity/advanced/SecurityCareerPlannerTool";
import AdvancedCryptoPlayground from "@/components/dashboards/cybersecurity/advanced/AdvancedCryptoPlayground";
import DetectionRuleTuner from "@/components/dashboards/cybersecurity/advanced/DetectionRuleTuner";
import PkiChainVisualizer from "@/components/dashboards/cybersecurity/advanced/PkiChainVisualizer";
import SecureDesignTradeoffLab from "@/components/dashboards/cybersecurity/advanced/SecureDesignTradeoffLab";
import DetectionCoverageTool from "@/components/notes/tools/ai/advanced/DetectionCoverageTool";
import IncidentTimelineTool from "@/components/notes/tools/ai/advanced/IncidentTimelineTool";
import SupplyChainRiskTool from "@/components/notes/tools/ai/advanced/SupplyChainRiskTool";
import TrustGraphTool from "@/components/notes/tools/ai/advanced/TrustGraphTool";
import ZeroTrustPlannerTool from "@/components/notes/tools/ai/advanced/ZeroTrustPlannerTool";
import { PromptClarityLab } from "@/components/tools/ai/PromptClarityLab";
import { MetricsCalculatorLab } from "@/components/tools/ai/MetricsCalculatorLab";
import { DatasetSplitLab } from "@/components/tools/ai/DatasetSplitLab";
import { PromptComparatorLab } from "@/components/tools/ai/PromptComparatorLab";
import { DatasetPlanningLab } from "@/components/tools/ai/DatasetPlanningLab";
import { ModelCardBuilderLab } from "@/components/tools/ai/ModelCardBuilderLab";
const TabularModelLab = dynamic(() => import("@/components/tools/ai/TabularModelLab").then(m => ({ default: m.TabularModelLab })), { ssr: false });
const TextClassifierLab = dynamic(() => import("@/components/tools/ai/TextClassifierLab").then(m => ({ default: m.TextClassifierLab })), { ssr: false });
const VectorSearchLab = dynamic(() => import("@/components/tools/ai/VectorSearchLab").then(m => ({ default: m.VectorSearchLab })), { ssr: false });
const FairnessProbeLab = dynamic(() => import("@/components/tools/ai/FairnessProbeLab").then(m => ({ default: m.FairnessProbeLab })), { ssr: false });
const DriftMonitorLab = dynamic(() => import("@/components/tools/ai/DriftMonitorLab").then(m => ({ default: m.DriftMonitorLab })), { ssr: false });
const ThresholdEvaluationLab = dynamic(() => import("@/components/tools/ai/ThresholdEvaluationLab").then(m => ({ default: m.ThresholdEvaluationLab })), { ssr: false });
const CalibrationLab = dynamic(() => import("@/components/tools/ai/CalibrationLab").then(m => ({ default: m.CalibrationLab })), { ssr: false });
const CounterfactualLab = dynamic(() => import("@/components/tools/ai/CounterfactualLab").then(m => ({ default: m.CounterfactualLab })), { ssr: false });
import GameHub from "@/components/GameHub";
import PromptPatternPlaygroundTool from "@/components/notes/tools/ai/intermediate/PromptPatternPlaygroundTool";
import EmbeddingSearchLabTool from "@/components/notes/tools/ai/intermediate/EmbeddingSearchLabTool";
import MiniRagLabTool from "@/components/notes/tools/ai/intermediate/MiniRagLabTool";
import AgentToyLabTool from "@/components/notes/tools/ai/intermediate/AgentToyLabTool";
import AIExamplesExplorerTool from "@/components/notes/tools/ai/beginner/AIExamplesExplorerTool";
import DataProfilerTool from "@/components/notes/tools/ai/intermediate/DataProfilerTool";
import TrainingLoopVisualizerTool from "@/components/notes/tools/ai/intermediate/TrainingLoopVisualizerTool";
import MetricsLabTool from "@/components/notes/tools/ai/intermediate/MetricsLabTool";
import ServingMonitorSimulatorTool from "@/components/notes/tools/ai/intermediate/ServingMonitorSimulatorTool";
import LLMAgentPlaygroundTool from "@/components/notes/tools/ai/advanced/LLMAgentPlaygroundTool";
import PromptPatternLabTool from "@/components/notes/tools/ai/advanced/PromptPatternLabTool";
import ModelForgeAdvancedTool from "@/components/notes/tools/ai/advanced/ModelForgeAdvancedTool";
import EvalGovernanceLabTool from "@/components/notes/tools/ai/advanced/EvalGovernanceLabTool";
import TransformerAttentionExplorerTool from "@/components/notes/tools/ai/advanced/TransformerAttentionExplorerTool";
import AgentLabTool from "@/components/notes/tools/ai/advanced/AgentLabTool";
import GenerativeMultimodalLabTool from "@/components/notes/tools/ai/advanced/GenerativeMultimodalLabTool";
import SafetyEvalLabTool from "@/components/notes/tools/ai/advanced/SafetyEvalLabTool";
import TokenContextLab from "@/components/notes/tools/ai/advanced/TokenContextLab";
import MiniDiffusionLab from "@/components/notes/tools/ai/advanced/MiniDiffusionLab";
import AgentFlowBuilder from "@/components/notes/tools/ai/advanced/AgentFlowBuilder";
import GovernanceChecklistLab from "@/components/notes/tools/ai/advanced/GovernanceChecklistLab";
import PipelineOrchestrator from "@/components/dashboards/ai/PipelineOrchestrator";
import DriftMonitorSimulator from "@/components/dashboards/ai/DriftMonitorSimulator";
import AgentWorkflowBuilder from "@/components/dashboards/ai/AgentWorkflowBuilder";
import AIGovernanceBoard from "@/components/dashboards/ai/AIGovernanceBoard";
import { LatencyBudgetLab } from "@/components/tools/architecture/LatencyBudgetLab";
import { AvailabilityPlannerLab } from "@/components/tools/architecture/AvailabilityPlannerLab";
import { C4ContextLab } from "@/components/tools/architecture/C4ContextLab";
import { DataFlowMapperLab } from "@/components/tools/digitalisation/DataFlowMapperLab";
import { DataQualityScorecardLab } from "@/components/tools/digitalisation/DataQualityScorecardLab";
import { ProcessFrictionLab } from "@/components/tools/digitalisation/ProcessFrictionLab";
import ChangeImpactSimulator from "@/components/notes/tools/digitalisation/beginner/ChangeImpactSimulator";
import DataValueChain from "@/components/notes/tools/digitalisation/beginner/DataValueChain";
import DigitalMaturityGauge from "@/components/notes/tools/digitalisation/beginner/DigitalMaturityGauge";
import DigitalisationDashboard from "@/components/dashboards/DigitalisationDashboard";
import ApiContractExplorer from "@/components/notes/tools/digitalisation/intermediate/ApiContractExplorer";
import SchemaMappingSandbox from "@/components/notes/tools/digitalisation/intermediate/SchemaMappingSandbox";
import TargetStateCanvasTool from "@/components/notes/tools/digitalisation/advanced/TargetStateCanvasTool";
import EcosystemMapperTool from "@/components/notes/tools/digitalisation/advanced/EcosystemMapperTool";
import RiskRoadmapPlannerTool from "@/components/notes/tools/digitalisation/advanced/RiskRoadmapPlannerTool";
import DigiConceptMatchGame from "@/components/games/digitalisation/DigiConceptMatchGame";
import ValueChainBuilderGame from "@/components/games/digitalisation/ValueChainBuilderGame";
import OperatingModelDesignerGame from "@/components/games/digitalisation/OperatingModelDesignerGame";
import MaturityPathGame from "@/components/games/digitalisation/MaturityPathGame";
import DigiQuickFireQuizGame from "@/components/games/digitalisation/DigiQuickFireQuizGame";
import ArchitectureCanvas from "@/components/notes/tools/architecture/beginner/ArchitectureCanvas";
import ArchitectureDecisionExplorerTool from "@/components/notes/tools/architecture/beginner/ArchitectureDecisionExplorerTool";
import QualityAttributeTradeoffSandboxTool from "@/components/notes/tools/architecture/beginner/QualityAttributeTradeoffSandboxTool";
import ComponentBoundaryMapperTool from "@/components/notes/tools/architecture/beginner/ComponentBoundaryMapperTool";
import RoleMapTool from "@/components/notes/tools/architecture/beginner/RoleMapTool";
import DesignKataTool from "@/components/notes/tools/architecture/beginner/DesignKataTool";
import DeploySafetySandbox from "@/components/notes/tools/architecture/beginner/DeploySafetySandbox";
import SystemFailureWalkthroughTool from "@/components/notes/tools/architecture/beginner/SystemFailureWalkthroughTool";
import RealitySurvivalDesignTool from "@/components/notes/tools/architecture/beginner/RealitySurvivalDesignTool";
import ArchitectureStyleExplorer from "@/components/notes/tools/architecture/intermediate/ArchitectureStyleExplorer";
import IntegrationFlowLab from "@/components/notes/tools/architecture/intermediate/IntegrationFlowLab";
import QualityTradeoffExplorer from "@/components/notes/tools/architecture/intermediate/QualityTradeoffExplorer";
import ConsistencySimulator from "@/components/notes/tools/architecture/intermediate/ConsistencySimulator";
import DomainContextMapperTool from "@/components/notes/tools/architecture/advanced/DomainContextMapperTool";
import CqrsEventLab from "@/components/notes/tools/architecture/advanced/CqrsEventLab";
import ResilienceLatencySimulator from "@/components/notes/tools/architecture/advanced/ResilienceLatencySimulator";
import AdrWorkbench from "@/components/notes/tools/architecture/advanced/AdrWorkbench";
import ArchitectureBingoTool from "@/components/notes/tools/architecture/summary/ArchitectureBingoTool";
import StyleMatcherTool from "@/components/notes/tools/architecture/summary/StyleMatcherTool";
import FailureStoryExplorer from "@/components/notes/tools/architecture/summary/FailureStoryExplorer";
import SequenceDiagramPuzzleTool from "@/components/notes/tools/architecture/summary/SequenceDiagramPuzzleTool";
import TradeoffSliderTool from "@/components/notes/tools/architecture/summary/TradeoffSliderTool";
import ConceptMatchGame from "@/components/notes/tools/ai/summary/ConceptMatchGame";
import ScenarioClinicGame from "@/components/notes/tools/ai/summary/ScenarioClinicGame";
import PipelineBuilderGame from "@/components/notes/tools/ai/summary/PipelineBuilderGame";
import SafetyGuardianGame from "@/components/notes/tools/ai/summary/SafetyGuardianGame";
import OddOneOutGame from "@/components/notes/tools/ai/summary/OddOneOutGame";
import MiniProjectDesigner from "@/components/notes/tools/ai/summary/MiniProjectDesigner";
import BuildYourOwnQuiz from "@/components/notes/tools/ai/summary/BuildYourOwnQuiz";
import DataAroundYouTool from "@/components/notes/tools/data/foundations/DataAroundYouTool";
import TextToBytesVisualizer from "@/components/notes/tools/data/foundations/TextToBytesVisualizer";
import DataQualityCheckerTool from "@/components/notes/tools/data/foundations/DataQualityCheckerTool";
import LifecycleMapperTool from "@/components/notes/tools/data/foundations/LifecycleMapperTool";
import RoleMatcherTool from "@/components/notes/tools/data/foundations/RoleMatcherTool";
import EthicsScenarioTool from "@/components/notes/tools/data/foundations/EthicsScenarioTool";
import SharedDataInterpretationTool from "@/components/notes/tools/data/foundations/SharedDataInterpretationTool";
import SharedLifecycleRisksTool from "@/components/notes/tools/data/foundations/SharedLifecycleRisksTool";
import SharedDataToDecisionTool from "@/components/notes/tools/data/foundations/SharedDataToDecisionTool";
import DataFormatExplorer from "@/components/notes/tools/data/foundations/DataFormatExplorer";
import DataQualitySandbox from "@/components/notes/tools/data/foundations/DataQualitySandbox";
import DataFlowVisualizer from "@/components/notes/tools/data/foundations/DataFlowVisualizer";
import DataPipelineDesignerTool from "@/components/notes/tools/data/intermediate/DataPipelineDesignerTool";
import GovernancePolicySimulatorTool from "@/components/notes/tools/data/intermediate/GovernancePolicySimulatorTool";
import SchemaMappingLabTool from "@/components/notes/tools/data/intermediate/SchemaMappingLabTool";
import AnalysisPlaygroundTool from "@/components/notes/tools/data/intermediate/AnalysisPlaygroundTool";
import DataRiskScenariosTool from "@/components/notes/tools/data/intermediate/DataRiskScenariosTool";
import DistributionExplorerTool from "@/components/notes/tools/data/advanced/DistributionExplorerTool";
import ModelAbstractionLabTool from "@/components/notes/tools/data/advanced/ModelAbstractionLabTool";
import SamplingBiasSimulatorTool from "@/components/notes/tools/data/advanced/SamplingBiasSimulatorTool";
import ReplicationConsistencyVisualizerTool from "@/components/notes/tools/data/advanced/ReplicationConsistencyVisualizerTool";
import GovernanceDecisionSimulatorTool from "@/components/notes/tools/data/advanced/GovernanceDecisionSimulatorTool";
import DataStrategySandboxTool from "@/components/notes/tools/data/advanced/DataStrategySandboxTool";

const mdxComponents = {
  Callout,
  ConceptBlock,
  WhyItMatters,
  HowItWorks,
  KeyTakeaways,
  Definition,
  Warning,
  Example,
  CommonMistake,
  PythonPlayground,
  RsaPlayground,
  DiagramBlock,
  ToolCard,
  GlossaryTip,
  QuizBlock,
  SectionProgressToggle,
  LevelProgressBar,
  CPDTracker,
  PageNav,
  ConceptMapExplorer,
  Figure,
  Diagram,
  Icon,
  Table,
  EmailHeaderLab,
  PhishingStorySimulator,
  SafeLinkInspector,
  CookieInspector,
  SecurityHeaderTool,
  UrlSafetyTool,
  EmailAuthTool,
  BrowserStorageTool,
  LogAnomalyTool,
  RiskRegisterTool,
  DnsQuickLensTool,
  JwtExplainerTool,
  PasswordStrengthTool,
  EverydayChecklistTool,
  BitChangeTool,
  CIAClassifierTool,
  MetadataLeakTool,
  PacketJourneyTool,
  PasswordEntropyTool,
  RiskDial,
  AttackChainTool,
  BackupRansomwareRecoveryTool,
  ControlMappingTool,
  IncidentTriageTool,
  LogStoryTool,
  ThreatModelCanvasTool,
  VulnerabilityLifecycleTool,
  ZeroTrustPolicyTool,
  ControlSelectionTool,
  EvidenceChecklistTool,
  FrameworkMappingTool,
  SecurityCareerPlannerTool,
  AdvancedCryptoPlayground,
  DetectionRuleTuner,
  PkiChainVisualizer,
  SecureDesignTradeoffLab,
  DetectionCoverageTool,
  IncidentTimelineTool,
  SupplyChainRiskTool,
  TrustGraphTool,
  ZeroTrustPlannerTool,
  PromptClarityLab,
  MetricsCalculatorLab,
  DatasetSplitLab,
  PromptComparatorLab,
  DatasetPlanningLab,
  ModelCardBuilderLab,
  TabularModelLab,
  TextClassifierLab,
  VectorSearchLab,
  FairnessProbeLab,
  DriftMonitorLab,
  ThresholdEvaluationLab,
  CalibrationLab,
  CounterfactualLab,
  GameHub,
  PromptPatternPlaygroundTool,
  EmbeddingSearchLabTool,
  MiniRagLabTool,
  AgentToyLabTool,
  AIExamplesExplorerTool,
  DataProfilerTool,
  TrainingLoopVisualizerTool,
  MetricsLabTool,
  ServingMonitorSimulatorTool,
  LLMAgentPlaygroundTool,
  PromptPatternLabTool,
  ModelForgeAdvancedTool,
  EvalGovernanceLabTool,
  TransformerAttentionExplorerTool,
  AgentLabTool,
  GenerativeMultimodalLabTool,
  SafetyEvalLabTool,
  TokenContextLab,
  MiniDiffusionLab,
  AgentFlowBuilder,
  GovernanceChecklistLab,
  PipelineOrchestrator,
  DriftMonitorSimulator,
  AgentWorkflowBuilder,
  AIGovernanceBoard,
  LatencyBudgetLab,
  AvailabilityPlannerLab,
  C4ContextLab,
  DataFlowMapperLab,
  DataQualityScorecardLab,
  ProcessFrictionLab,
  ChangeImpactSimulator,
  DataValueChain,
  DigitalisationDashboard,
  ApiContractExplorer,
  SchemaMappingSandbox,
  DigitalMaturityGauge,
  TargetStateCanvasTool,
  EcosystemMapperTool,
  RiskRoadmapPlannerTool,
  DigiConceptMatchGame,
  ValueChainBuilderGame,
  OperatingModelDesignerGame,
  MaturityPathGame,
  DigiQuickFireQuizGame,
  ArchitectureCanvas,
  ArchitectureDecisionExplorerTool,
  QualityAttributeTradeoffSandboxTool,
  ComponentBoundaryMapperTool,
  RoleMapTool,
  DesignKataTool,
  DeploySafetySandbox,
  SystemFailureWalkthroughTool,
  RealitySurvivalDesignTool,
  ArchitectureStyleExplorer,
  IntegrationFlowLab,
  QualityTradeoffExplorer,
  ConsistencySimulator,
  DomainContextMapperTool,
  CqrsEventLab,
  ResilienceLatencySimulator,
  AdrWorkbench,
  ArchitectureBingoTool,
  StyleMatcherTool,
  FailureStoryExplorer,
  SequenceDiagramPuzzleTool,
  TradeoffSliderTool,
  ConceptMatchGame,
  ScenarioClinicGame,
  PipelineBuilderGame,
  SafetyGuardianGame,
  OddOneOutGame,
  MiniProjectDesigner,
  BuildYourOwnQuiz,
  DataAroundYouTool,
  TextToBytesVisualizer,
  DataQualityCheckerTool,
  LifecycleMapperTool,
  RoleMatcherTool,
  EthicsScenarioTool,
  SharedDataInterpretationTool,
  SharedLifecycleRisksTool,
  SharedDataToDecisionTool,
  DataFormatExplorer,
  DataQualitySandbox,
  DataFlowVisualizer,
  DataPipelineDesignerTool,
  GovernancePolicySimulatorTool,
  SchemaMappingLabTool,
  AnalysisPlaygroundTool,
  DataRiskScenariosTool,
  DistributionExplorerTool,
  ModelAbstractionLabTool,
  SamplingBiasSimulatorTool,
  ReplicationConsistencyVisualizerTool,
  GovernanceDecisionSimulatorTool,
  DataStrategySandboxTool,
};

export default mdxComponents;
