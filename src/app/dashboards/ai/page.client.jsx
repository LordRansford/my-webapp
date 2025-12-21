"use client";

import NotesLayout from "@/components/NotesLayout";
import ToolCard from "@/components/learn/ToolCard";

const tools = [
  { title: "Dataset explorer", slug: "dataset-explorer", description: "Inspect sample data distributions and missing values." },
  { title: "Feature engineering playground", slug: "feature-engineering", description: "Apply simple transforms and compare before/after summaries." },
  { title: "Linear model playground", slug: "linear-model", description: "Adjust m and b and see error respond." },
  { title: "Decision boundary sandbox", slug: "decision-boundary", description: "Toggle boundary types and see class separation." },
  { title: "Clustering explorer", slug: "clustering", description: "Change cluster count and view assignments." },
  { title: "Dimensionality reduction view", slug: "dimensionality-reduction", description: "Compare simple projections of sample data." },
  { title: "Evaluation metrics explorer", slug: "evaluation-metrics", description: "Manipulate confusion counts and view metrics." },
  { title: "Confusion matrix inspector", slug: "confusion-matrix", description: "Spot dominant error patterns in a tiny matrix." },
  { title: "Bias and fairness dashboard", slug: "bias-fairness", description: "Adjust group rates and view fairness summaries." },
  { title: "Embedding visualiser", slug: "embedding-visualiser", description: "Browse a mini semantic space." },
  { title: "Prompt playground", slug: "prompt-playground", description: "Practise prompt clarity with a safe local ruleset." },
  { title: "Retrieval sandbox", slug: "retrieval-sandbox", description: "See how retrieved context shapes answers." },
  { title: "Inference cost estimator", slug: "inference-cost", description: "Explore volume, size, cost, and latency trade-offs." },
  { title: "Pipeline orchestrator", slug: "pipeline-orchestrator", description: "Sketch lifecycle stages and dependencies." },
  { title: "Drift monitor simulator", slug: "drift-simulator", description: "Adjust drift and monitoring to see detection timing." },
  { title: "Attention explorer", slug: "transformer-attention", description: "Visualise toy attention weights over tokens." },
  { title: "Agent workflow builder", slug: "agent-workflow", description: "Design an agent flow and spot missing approvals." },
  { title: "Diffusion image toy", slug: "diffusion-toy", description: "See a minimal diffusion-style denoising on a grid." },
  { title: "AI use case portfolio", slug: "ai-use-case-portfolio", description: "Position use cases by value and feasibility." },
  { title: "AI governance board", slug: "ai-governance", description: "Track AI proposals, risks, and mitigations." },
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
      headings={[]}
    >
      <main className="relative flex-1 space-y-10">
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · AI</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">AI dashboards</h1>
          <p className="max-w-2xl text-sm text-slate-700">
            These dashboards are small interactive sandboxes. They are not production tools. They let you explore how data,
            models, metrics, and governance ideas behave when you move real controls.
          </p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          <p>
            Pick a dashboard tool below. Each opens as its own page so tools stay predictable, mobile-safe, and easy to link to.
          </p>
          <div className="not-prose">
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.title}
                description={tool.description}
                href={`/dashboards/ai/${tool.slug}`}
              />
            ))}
          </div>
        </article>
      </main>
    </NotesLayout>
  );
}
