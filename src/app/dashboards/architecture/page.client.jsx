"use client";

import NotesLayout from "@/components/NotesLayout";
import ProgressBar from "@/components/notes/ProgressBar";
import ToolCard from "@/components/learn/ToolCard";
import {
  SystemLandscapeCanvas,
  DomainModelSandbox,
  CouplingCohesionVisualizer,
  MicroserviceBoundaryDesigner,
  DataStoragePlanner,
  RequestJourneyExplorer,
  CQRSPlanner,
  EventFlowModeler,
  ResiliencePatternSandbox,
  CapacityScalingPlanner,
  CachingEffectSimulator,
  DeploymentTopologyMapper,
  LatencyBudgetExplorer,
  AvailabilitySLOPlanner,
  ChangeRiskSimulator,
  SecurityZoneDesigner,
  ObservabilityCoveragePlanner,
  MultiTenancyPlanner,
  TechDebtRadar,
  ADRBoard,
} from "@/components/dashboards/architecture";

const tools = [
  { title: "System landscape canvas", anchor: "system-landscape", Component: SystemLandscapeCanvas },
  { title: "Domain model sandbox", anchor: "domain-model", Component: DomainModelSandbox },
  { title: "Coupling and cohesion visualiser", anchor: "coupling-cohesion", Component: CouplingCohesionVisualizer },
  { title: "Microservice boundary designer", anchor: "microservice-boundaries", Component: MicroserviceBoundaryDesigner },
  { title: "Data storage planner", anchor: "data-storage-planner", Component: DataStoragePlanner },
  { title: "Request journey explorer", anchor: "request-journey", Component: RequestJourneyExplorer },
  { title: "CQRS planner", anchor: "cqrs-planner", Component: CQRSPlanner },
  { title: "Event flow modeller", anchor: "event-flow-model", Component: EventFlowModeler },
  { title: "Resilience pattern sandbox", anchor: "resilience-sandbox", Component: ResiliencePatternSandbox },
  { title: "Capacity and scaling planner", anchor: "capacity-scaling", Component: CapacityScalingPlanner },
  { title: "Caching effect simulator", anchor: "cache-effect", Component: CachingEffectSimulator },
  { title: "Deployment topology mapper", anchor: "deployment-topology", Component: DeploymentTopologyMapper },
  { title: "Latency budget explorer", anchor: "latency-budget", Component: LatencyBudgetExplorer },
  { title: "Availability and SLO planner", anchor: "availability-slo", Component: AvailabilitySLOPlanner },
  { title: "Change risk simulator", anchor: "change-risk", Component: ChangeRiskSimulator },
  { title: "Security zone designer", anchor: "security-zones", Component: SecurityZoneDesigner },
  { title: "Observability coverage planner", anchor: "observability-coverage", Component: ObservabilityCoveragePlanner },
  { title: "Multi tenancy planner", anchor: "multitenancy", Component: MultiTenancyPlanner },
  { title: "Tech debt radar", anchor: "tech-debt", Component: TechDebtRadar },
  { title: "ADR board", anchor: "adr-board", Component: ADRBoard },
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
      headings={tools.map((tool) => ({ id: tool.anchor, title: tool.title, depth: 2 }))}
    >
      <main className="relative flex-1 space-y-10">
        <ProgressBar />
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · Architecture</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">Software architecture dashboards</h1>
          <p className="max-w-2xl text-sm text-slate-700">
            These dashboards are small practice environments for software architecture. They are not production tools. They help
            you explore how structure, data, and behaviour fit together so you can spot risks earlier.
          </p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          <section className="rn-section" style={{ marginTop: 0 }}>
            <p className="rn-body">
              Everything runs in the browser - no calls to a server. Adjust inputs, see how the picture responds, and use that to
              refine your own architecture decisions.
            </p>
          </section>

          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {tools.map(({ title, anchor, Component }) => (
              <section key={anchor} id={anchor} className="rn-section w-full">
                <ToolCard title={title} description="">
                  <Component />
                </ToolCard>
              </section>
            ))}
          </div>
        </article>
      </main>
    </NotesLayout>
  );
}
