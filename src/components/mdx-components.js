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
import { CookieInspector } from "@/components/tools/cyber/CookieInspector";
import { SecurityHeaderTool } from "@/components/tools/cyber/SecurityHeaderTool";
import { UrlSafetyTool } from "@/components/tools/cyber/UrlSafetyTool";
import { EmailAuthTool } from "@/components/tools/cyber/EmailAuthTool";
import { BrowserStorageTool } from "@/components/tools/cyber/BrowserStorageTool";
import { LogAnomalyTool } from "@/components/tools/cyber/LogAnomalyTool";
import { RiskRegisterTool } from "@/components/tools/cyber/RiskRegisterTool";
import { DnsQuickLensTool } from "@/components/tools/cyber/DnsQuickLensTool";
import { JwtExplainerTool } from "@/components/tools/cyber/JwtExplainerTool";
import { PasswordStrengthTool } from "@/components/tools/cyber/PasswordStrengthTool";
import { EverydayChecklistTool } from "@/components/tools/cyber/EverydayChecklistTool";
import { PromptClarityLab } from "@/components/tools/ai/PromptClarityLab";
import { MetricsCalculatorLab } from "@/components/tools/ai/MetricsCalculatorLab";
import { DatasetSplitLab } from "@/components/tools/ai/DatasetSplitLab";
import { PromptComparatorLab } from "@/components/tools/ai/PromptComparatorLab";
import { DatasetPlanningLab } from "@/components/tools/ai/DatasetPlanningLab";
import { ModelCardBuilderLab } from "@/components/tools/ai/ModelCardBuilderLab";
import { TabularModelLab } from "@/components/tools/ai/TabularModelLab";
import { TextClassifierLab } from "@/components/tools/ai/TextClassifierLab";
import { VectorSearchLab } from "@/components/tools/ai/VectorSearchLab";
import { FairnessProbeLab } from "@/components/tools/ai/FairnessProbeLab";
import { DriftMonitorLab } from "@/components/tools/ai/DriftMonitorLab";
import { ThresholdEvaluationLab } from "@/components/tools/ai/ThresholdEvaluationLab";
import { CalibrationLab } from "@/components/tools/ai/CalibrationLab";
import { CounterfactualLab } from "@/components/tools/ai/CounterfactualLab";
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
import RoleMapTool from "@/components/notes/tools/architecture/beginner/RoleMapTool";
import DesignKataTool from "@/components/notes/tools/architecture/beginner/DesignKataTool";
import DeploySafetySandbox from "@/components/notes/tools/architecture/beginner/DeploySafetySandbox";
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
  RoleMapTool,
  DesignKataTool,
  DeploySafetySandbox,
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
