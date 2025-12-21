"use client";

import NotesLayout from "@/components/NotesLayout";
import ToolCard from "@/components/learn/ToolCard";

const tools = [
  { title: "Digital maturity radar", slug: "digital-maturity-radar", description: "Adjust maturity scores and see a radar view and narrative summary." },
  { title: "Data lifecycle map", slug: "data-lifecycle-map", description: "Describe how data is created and used and see a simple lifecycle view." },
  { title: "System capability matrix", slug: "system-capability-matrix", description: "Map systems to business capabilities and spot overlaps and gaps." },
  { title: "Data catalogue explorer", slug: "data-catalogue-explorer", description: "Explore a small mock catalogue and see what good entries look like." },
  { title: "Data quality cockpit", slug: "data-quality-dashboard", description: "Adjust simple quality scores and see how the overall picture changes." },
  { title: "Metadata and lineage map", slug: "metadata-lineage-map", description: "Connect fields across systems and see a simple lineage story." },
  { title: "Interoperability and standards map", slug: "interoperability-standards-map", description: "Record interfaces and formats and see where standards are missing." },
  { title: "API catalogue and harmonisation", slug: "api-catalogue", description: "Explore a small API catalogue and spot consistency and ownership problems." },
  { title: "Consent and policy sandbox", slug: "consent-policy-sandbox", description: "Describe a proposed data use and walk through simple policy checks." },
  { title: "Data sharing agreement canvas", slug: "data-sharing-agreement", description: "Capture key elements of a data sharing arrangement on one page." },
  { title: "Reference data stewardship board", slug: "reference-data-stewardship", description: "Track key reference data sets, owners and health indicators." },
  { title: "Digital service journey map", slug: "digital-service-journey-map", description: "Sketch a service journey and see where experience is fragile." },
  { title: "Process automation heatmap", slug: "process-automation-heatmap", description: "Place processes on a simple grid to see automation candidates." },
  { title: "Legacy and target state planner", slug: "legacy-target-planner", description: "Classify current systems and sketch target platforms." },
  { title: "Platform strategy canvas", slug: "platform-strategy-canvas", description: "Capture a platform idea and stress test its focus." },
  { title: "Outcome and KPI dashboard", slug: "outcome-kpi-dashboard", description: "Link outcomes and indicators and see how far there is to go." },
  { title: "Risk and control register", slug: "risk-control-register", description: "Record digital risks and controls in a simple, structured view." },
  { title: "Stakeholder and persona map", slug: "stakeholder-persona-map", description: "Capture personas and stakeholders and see goals and concerns side by side." },
  { title: "Roadmap and initiative planner", slug: "roadmap-initiative-planner", description: "Place initiatives on a timeline and connect them to outcomes." },
  { title: "Benefit realisation tracker", slug: "benefit-realisation-tracker", description: "Track expected digitalisation benefits and whether they are actually realised." },
];

export default function ClientPage() {
  return (
    <NotesLayout
      meta={{
        title: "Digitalisation dashboards",
        description: "Practical sandboxes to plan and stress test digitalisation journeys.",
        section: "digitalisation",
        slug: "/dashboards/digitalisation",
        level: "Dashboards",
      }}
      headings={[]}
    >
      <main className="relative flex-1 space-y-10">
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · Digitalisation</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">Digitalisation dashboards</h1>
          <p className="max-w-2xl text-sm text-slate-700">
            These dashboards are small practice environments for digitalisation. They help you think about data, platforms,
            journeys, risk and benefits in a concrete and visual way. They are not production tools. They are thinking tools.
          </p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          <p>Pick a dashboard tool below. Each opens on its own page to keep tool pages focused and mobile-safe.</p>
          <div className="not-prose">
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.title}
                description={tool.description}
                href={`/dashboards/digitalisation/${tool.slug}`}
              />
            ))}
          </div>
        </article>
      </main>
    </NotesLayout>
  );
}
