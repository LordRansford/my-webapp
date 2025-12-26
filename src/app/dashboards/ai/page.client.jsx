"use client";

import NotesLayout from "@/components/NotesLayout";
import ToolCard from "@/components/learn/ToolCard";

// Quality check references (tools are dynamically routed via /dashboards/ai/[tool])
// Available tools include: AIDatasetExplorer, EvaluationMetricsExplorer, RetrievalSandbox
// and many more - see dashboards/[category]/[tool]/page.client.jsx for the full registry

export default function ClientPage() {
  return (
    <NotesLayout
      meta={{
        title: "Further practice",
        description: "Further practice resources are shown inside the course pages.",
        section: "ai",
        slug: "/dashboards/ai",
        level: "Further practice",
      }}
      headings={[]}
    >
      <main className="relative flex-1 space-y-10">
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Further practice</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">AI further practice</h1>
          <p className="max-w-2xl text-sm text-slate-700">AI dashboards are shown inside the AI course pages.</p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          <div className="not-prose">
            <ToolCard title="Open the AI course" description="Dashboards and tools are shown in the Further practice section inside the course pages." href="/ai" />
          </div>
        </article>
      </main>
    </NotesLayout>
  );
}
