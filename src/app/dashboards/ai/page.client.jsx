"use client";

import NotesLayout from "@/components/NotesLayout";
import ProgressBar from "@/components/notes/ProgressBar";
import ToolCard from "@/components/learn/ToolCard";

import AIDatasetExplorer from "@/components/dashboards/ai/AIDatasetExplorer";
import FeatureEngineeringPlayground from "@/components/dashboards/ai/FeatureEngineeringPlayground";
import LinearModelPlayground from "@/components/dashboards/ai/LinearModelPlayground";
import DecisionBoundarySandbox from "@/components/dashboards/ai/DecisionBoundarySandbox";
import ClusteringExplorer from "@/components/dashboards/ai/ClusteringExplorer";
import DimensionalityReductionView from "@/components/dashboards/ai/DimensionalityReductionView";
import EvaluationMetricsExplorer from "@/components/dashboards/ai/EvaluationMetricsExplorer";
import ConfusionMatrixInspector from "@/components/dashboards/ai/ConfusionMatrixInspector";
import BiasFairnessDashboard from "@/components/dashboards/ai/BiasFairnessDashboard";
import EmbeddingVisualizer from "@/components/dashboards/ai/EmbeddingVisualizer";
import PromptPlayground from "@/components/dashboards/ai/PromptPlayground";
import RetrievalSandbox from "@/components/dashboards/ai/RetrievalSandbox";
import InferenceCostEstimator from "@/components/dashboards/ai/InferenceCostEstimator";
import PipelineOrchestrator from "@/components/dashboards/ai/PipelineOrchestrator";
import DriftMonitorSimulator from "@/components/dashboards/ai/DriftMonitorSimulator";
import TransformerAttentionExplorer from "@/components/dashboards/ai/TransformerAttentionExplorer";
import AgentWorkflowBuilder from "@/components/dashboards/ai/AgentWorkflowBuilder";
import DiffusionToy from "@/components/dashboards/ai/DiffusionToy";
import AIUseCasePortfolio from "@/components/dashboards/ai/AIUseCasePortfolio";
import AIGovernanceBoard from "@/components/dashboards/ai/AIGovernanceBoard";

const sections = [
  { title: "Dataset explorer", anchor: "dataset-explorer" },
  { title: "Feature engineering playground", anchor: "feature-engineering" },
  { title: "Linear model playground", anchor: "linear-model" },
  { title: "Decision boundary sandbox", anchor: "decision-boundary" },
  { title: "Clustering and unsupervised explorer", anchor: "clustering" },
  { title: "Dimensionality reduction view", anchor: "dimensionality-reduction" },
  { title: "Evaluation metrics explorer", anchor: "evaluation-metrics" },
  { title: "Confusion matrix inspector", anchor: "confusion-matrix" },
  { title: "Bias and fairness dashboard", anchor: "bias-fairness" },
  { title: "Embedding visualiser", anchor: "embedding-visualiser" },
  { title: "Prompt and instruction playground", anchor: "prompt-playground" },
  { title: "Retrieval and context sandbox", anchor: "retrieval-sandbox" },
  { title: "Inference cost and latency estimator", anchor: "inference-cost" },
  { title: "Pipeline and lifecycle orchestrator", anchor: "pipeline-orchestrator" },
  { title: "Data and model drift simulator", anchor: "drift-simulator" },
  { title: "Transformer attention explorer", anchor: "transformer-attention" },
  { title: "Agent workflow builder", anchor: "agent-workflow" },
  { title: "Diffusion image toy", anchor: "diffusion-toy" },
  { title: "AI use case portfolio", anchor: "ai-use-case-portfolio" },
  { title: "AI governance and risk board", anchor: "ai-governance" },
];

export default function ClientPage() {
  return (
    <NotesLayout
      meta={{
        title: "AI dashboards",
        description: "Hands on AI sandboxes from data and models to evaluation and governance.",
        section: "ai",
        slug: "/dashboards/ai",
        level: "Dashboards",
      }}
      headings={sections.map((s) => ({ id: s.anchor, title: s.title, depth: 2 }))}
    >
      <main className="relative flex-1 space-y-10">
        <ProgressBar />
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · AI</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">AI dashboards</h1>
          <p className="max-w-2xl text-sm text-slate-700">
            These dashboards are small interactive sandboxes. They are not production tools. They let you explore how data,
            models, metrics, and governance ideas behave when you move real controls.
          </p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          {sections.map((section) => (
            <Section key={section.anchor} id={section.anchor} title={section.title} />
          ))}
        </article>
      </main>
    </NotesLayout>
  );
}

function Section({ id, title }) {
  const map = {
    "dataset-explorer": (
      <>
        <p>
          Almost every AI system starts with data. Before models and metrics it is important to understand what the data looks
          like, how it is distributed and where it might be missing or noisy.
        </p>
        <p>
          Choose feature and label columns to see distributions, summary statistics, and missing values. This builds the habit of
          inspecting data first.
        </p>
        <ToolCard title="Dataset explorer" description="Inspect sample data distributions and missing values.">
          <AIDatasetExplorer />
        </ToolCard>
      </>
    ),
    "feature-engineering": (
      <>
        <p>
          Raw values often need scaling or simple transforms before a model can learn useful patterns. See how transforms change
          the shape of data.
        </p>
        <ToolCard
          title="Feature engineering playground"
          description="Apply simple transforms and compare before/after summaries."
        >
          <FeatureEngineeringPlayground />
        </ToolCard>
      </>
    ),
    "linear-model": (
      <>
        <p>Move sliders for a two-parameter line and watch predictions and error change for a tiny dataset.</p>
        <ToolCard title="Linear model playground" description="Adjust m and b and see error respond.">
          <LinearModelPlayground />
        </ToolCard>
      </>
    ),
    "decision-boundary": (
      <>
        <p>Switch between linear and simple non-linear boundaries on a tiny 2D dataset to see model capacity visually.</p>
        <ToolCard title="Decision boundary sandbox" description="Toggle boundary types and see class separation.">
          <DecisionBoundarySandbox />
        </ToolCard>
      </>
    ),
    clustering: (
      <>
        <p>Run a small clustering example and see assignments change as you vary cluster count.</p>
        <ToolCard title="Clustering explorer" description="Change cluster count and view assignments.">
          <ClusteringExplorer />
        </ToolCard>
      </>
    ),
    "dimensionality-reduction": (
      <>
        <p>Project a tiny high-dimensional sample into 2D using simple preset projections to see how structure shifts.</p>
        <ToolCard title="Dimensionality reduction view" description="Compare simple projections of sample data.">
          <DimensionalityReductionView />
        </ToolCard>
      </>
    ),
    "evaluation-metrics": (
      <>
        <p>Adjust TP/FP/TN/FN counts and see accuracy, precision, recall, and more update with plain-language notes.</p>
        <ToolCard title="Evaluation metrics explorer" description="Manipulate confusion counts and view metrics.">
          <EvaluationMetricsExplorer />
        </ToolCard>
      </>
    ),
    "confusion-matrix": (
      <>
        <p>Inspect a small three-class confusion matrix and highlight where errors concentrate.</p>
        <ToolCard title="Confusion matrix inspector" description="Spot dominant error patterns in a tiny matrix.">
          <ConfusionMatrixInspector />
        </ToolCard>
      </>
    ),
    "bias-fairness": (
      <>
        <p>Change base and error rates for two groups to see fairness summaries like demographic parity and equal opportunity.</p>
        <ToolCard title="Bias and fairness dashboard" description="Adjust group rates and view fairness summaries.">
          <BiasFairnessDashboard />
        </ToolCard>
      </>
    ),
    "embedding-visualiser": (
      <>
        <p>Select example snippets and explore nearest neighbours in a tiny synthetic embedding space.</p>
        <ToolCard title="Embedding visualiser" description="Browse a mini semantic space.">
          <EmbeddingVisualizer />
        </ToolCard>
      </>
    ),
    "prompt-playground": (
      <>
        <p>Type prompts, tag intent, and see how a small ruleset classifies clarity and ambiguity locally (no external calls).</p>
        <ToolCard title="Prompt playground" description="Practise prompt clarity with a safe local ruleset.">
          <PromptPlayground />
        </ToolCard>
      </>
    ),
    "retrieval-sandbox": (
      <>
        <p>Enter a query and view which local documents would be retrieved plus a synthetic answer based on them.</p>
        <ToolCard title="Retrieval sandbox" description="See how retrieved context shapes answers.">
          <RetrievalSandbox />
        </ToolCard>
      </>
    ),
    "inference-cost": (
      <>
        <p>Adjust model size, prompt length, and request rate to see rough cost and latency estimates.</p>
        <ToolCard title="Inference cost estimator" description="Explore volume, size, cost, and latency trade-offs.">
          <InferenceCostEstimator />
        </ToolCard>
      </>
    ),
    "pipeline-orchestrator": (
      <>
        <p>Lay out stages of an AI lifecycle, connect them, and see hints for missing checks like monitoring.</p>
        <ToolCard title="Pipeline orchestrator" description="Sketch lifecycle stages and dependencies.">
          <PipelineOrchestrator />
        </ToolCard>
      </>
    ),
    "drift-simulator": (
      <>
        <p>Simulate drift speed and monitoring strength to see when issues would surface in a simple accuracy trace.</p>
        <ToolCard title="Drift monitor simulator" description="Adjust drift and monitoring to see detection timing.">
          <DriftMonitorSimulator />
        </ToolCard>
      </>
    ),
    "transformer-attention": (
      <>
        <p>Pick sample sentences and heads to view a tiny attention matrix showing token-to-token focus.</p>
        <ToolCard title="Attention explorer" description="Visualise toy attention weights over tokens.">
          <TransformerAttentionExplorer />
        </ToolCard>
      </>
    ),
    "agent-workflow": (
      <>
        <p>Add steps like LLM call, retrieval, DB query, and approval to form a simple agent graph with risk hints.</p>
        <ToolCard title="Agent workflow builder" description="Design an agent flow and spot missing approvals.">
          <AgentWorkflowBuilder />
        </ToolCard>
      </>
    ),
    "diffusion-toy": (
      <>
        <p>Play with a tiny numeric grid, noise schedule, and steps to watch a simplified denoising process.</p>
        <ToolCard title="Diffusion image toy" description="See a minimal diffusion-style denoising on a grid.">
          <DiffusionToy />
        </ToolCard>
      </>
    ),
    "ai-use-case-portfolio": (
      <>
        <p>Add AI ideas with value, complexity, risk, and data readiness scores to see quick wins vs. bets.</p>
        <ToolCard title="AI use case portfolio" description="Position use cases by value and feasibility.">
          <AIUseCasePortfolio />
        </ToolCard>
      </>
    ),
    "ai-governance": (
      <>
        <p>Capture AI systems with purpose, data, harms, and mitigations; group by risk to see where controls lag.</p>
        <ToolCard title="AI governance board" description="Track AI proposals, risks, and mitigations.">
          <AIGovernanceBoard />
        </ToolCard>
      </>
    ),
  };

  return (
    <section id={id}>
      <h2>{title}</h2>
      {map[id]}
    </section>
  );
}
