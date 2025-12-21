"use client";

import NotesLayout from "@/components/NotesLayout";
import ToolCard from "@/components/learn/ToolCard";

const tools = [
  { title: "System landscape canvas", slug: "system-landscape", description: "Sketch systems and boundaries in a simple landscape view." },
  { title: "Domain model sandbox", slug: "domain-model", description: "Explore bounded context concepts with a lightweight model canvas." },
  { title: "Coupling and cohesion visualiser", slug: "coupling-cohesion", description: "See how component choices affect coupling and cohesion signals." },
  { title: "Microservice boundary designer", slug: "microservice-boundaries", description: "Practise slicing boundaries and spot cross-cutting concerns early." },
  { title: "Data storage planner", slug: "data-storage-planner", description: "Compare storage options by access patterns, consistency, and scale." },
  { title: "Request journey explorer", slug: "request-journey", description: "Trace a request path and highlight latency and dependency risks." },
  { title: "CQRS planner", slug: "cqrs-planner", description: "Separate reads/writes and understand where CQRS helps or hurts." },
  { title: "Event flow modeller", slug: "event-flow-model", description: "Model event sequences and identify critical ordering points." },
  { title: "Resilience pattern sandbox", slug: "resilience-sandbox", description: "Try patterns like retries, circuit breakers, and bulkheads safely." },
  { title: "Capacity and scaling planner", slug: "capacity-scaling", description: "Estimate load, bottlenecks, and scaling levers for a service." },
  { title: "Caching effect simulator", slug: "cache-effect", description: "Explore hit rates and how caching changes latency and load." },
  { title: "Deployment topology mapper", slug: "deployment-topology", description: "Map services to environments and understand blast radius." },
  { title: "Latency budget explorer", slug: "latency-budget", description: "Allocate latency budgets across dependencies and see where it breaks." },
  { title: "Availability and SLO planner", slug: "availability-slo", description: "Set SLOs and reason about error budgets and user impact." },
  { title: "Change risk simulator", slug: "change-risk", description: "Assess change risk by surface area, dependencies, and rollout safety." },
  { title: "Security zone designer", slug: "security-zones", description: "Design network zones and allowed flows in a simple map." },
  { title: "Observability coverage planner", slug: "observability-coverage", description: "Check logs, metrics, traces coverage and identify gaps." },
  { title: "Multi tenancy planner", slug: "multitenancy", description: "Reason about tenant isolation patterns and operational complexity." },
  { title: "Tech debt radar", slug: "tech-debt", description: "Capture and visualise debt signals so trade-offs stay visible." },
  { title: "ADR board", slug: "adr-board", description: "Track architecture decisions and see where context is missing." },
];

export default function ClientPage() {
  return (
    <NotesLayout
      meta={{
        title: "Architecture dashboards",
        description: "Interactive sandboxes for structure, flows, boundaries, and reliability.",
        section: "architecture",
        slug: "/dashboards/architecture",
        level: "Dashboards",
      }}
      headings={[]}
    >
      <main className="relative flex-1 space-y-10">
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · Architecture</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">Software architecture dashboards</h1>
          <p className="max-w-2xl text-sm text-slate-700">
            These dashboards are small practice environments for software architecture. They are not production tools. They help
            you explore how structure, data, and behaviour fit together so you can spot risks earlier.
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
                href={`/dashboards/architecture/${tool.slug}`}
              />
            ))}
          </div>
        </article>
      </main>
    </NotesLayout>
  );
}
