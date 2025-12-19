"use client";

import { useMemo } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const attribution =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution.";

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

function List({ items }) {
  if (!items || !items.length) return <p className="text-sm text-slate-700">Add details to see output.</p>;
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
      {items.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  );
}

export function C4DiagramBuilder() {
  const storageKey = "template-arch-c4-diagram-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    context: "Customers, Web app, Payment gateway",
    containers: "Web app, API, Database",
    components: "Auth service, Billing service, Notifications",
  });

  const summary = useMemo(() => {
    const ctx = state.context.split(",").map((x) => x.trim()).filter(Boolean);
    const cont = state.containers.split(",").map((x) => x.trim()).filter(Boolean);
    const comp = state.components.split(",").map((x) => x.trim()).filter(Boolean);
    return [
      `Context: ${ctx.join(" → ") || "n/a"}`,
      `Containers: ${cont.join(" | ") || "n/a"}`,
      `Components: ${comp.join(" | ") || "n/a"}`,
    ];
  }, [state]);

  const buildSections = () => [
    { heading: "Context", body: state.context },
    { heading: "Containers", body: state.containers },
    { heading: "Components", body: state.components },
  ];

  return (
    <TemplateLayout
      title="C4 Diagram Builder"
      description="Capture context, containers, and components with a simple shareable view."
      audience="Architects and tech leads."
      useCases={["Draft a quick C4 outline.", "Align on scope before formal drawings.", "Export for review."]}
      instructions={[
        "List actors and systems for context.",
        "List deployable containers.",
        "List key components per container.",
        "Export to share or refine in diagram tooling.",
      ]}
      outputTitle="C4 snapshot"
      outputSummary={summary.join(" ")}
      outputInterpretation="Use this as a lightweight sketch. Follow with a diagramming tool for production-grade visuals."
      outputNextSteps={["Add interfaces and protocols.", "Note trust boundaries.", "Validate with security and ops."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-c4-diagram-builder"
        title="C4 Diagram Builder"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Context actors and systems
          <textarea
            value={state.context}
            onChange={(e) => updateState((prev) => ({ ...prev, context: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Customers, Web app, Payment gateway"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Containers
          <textarea
            value={state.containers}
            onChange={(e) => updateState((prev) => ({ ...prev, containers: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Web app, API, Database"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Components
          <textarea
            value={state.components}
            onChange={(e) => updateState((prev) => ({ ...prev, components: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Auth service, Billing service, Notifications"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Snapshot</p>
        <List items={summary} />
      </div>
    </TemplateLayout>
  );
}

export function AdrGenerator() {
  const storageKey = "template-arch-adr-generator";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    title: "Adopt managed Postgres for transactional workloads",
    context: "Need reliable relational store with low ops overhead.",
    decision: "Use managed Postgres with HA in primary region.",
    consequences: "Higher recurring cost; reduced toil; vendor dependence.",
    status: "Proposed",
  });

  const buildSections = () => [
    { heading: "Title", body: state.title },
    { heading: "Context", body: state.context },
    { heading: "Decision", body: state.decision },
    { heading: "Consequences", body: state.consequences },
    { heading: "Status", body: state.status },
  ];

  return (
    <TemplateLayout
      title="ADR Generator"
      description="Capture architecture decisions with context, decision, consequences, and status."
      audience="Architects, tech leads, and squads."
      useCases={["Record key decisions quickly.", "Share with stakeholders.", "Export to docs or tickets."]}
      instructions={["Fill context, decision, consequences, and status.", "Keep concise.", "Export and store in repo."]}
      outputTitle="ADR summary"
      outputSummary={`${state.title} - ${state.status}`}
      outputInterpretation="Keep ADRs short. Update status as decisions move from proposed to accepted."
      outputNextSteps={["Link to related risks and tests.", "Add date and owners.", "Review quarterly."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-adr-generator"
        title="ADR Generator"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Title
          <input
            type="text"
            value={state.title}
            onChange={(e) => updateState((prev) => ({ ...prev, title: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Status
          <select
            value={state.status}
            onChange={(e) => updateState((prev) => ({ ...prev, status: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option>Proposed</option>
            <option>Accepted</option>
            <option>Superseded</option>
            <option>Rejected</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Context
          <textarea
            value={state.context}
            onChange={(e) => updateState((prev) => ({ ...prev, context: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Decision
          <textarea
            value={state.decision}
            onChange={(e) => updateState((prev) => ({ ...prev, decision: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Consequences
          <textarea
            value={state.consequences}
            onChange={(e) => updateState((prev) => ({ ...prev, consequences: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function ApiStyleChooser() {
  const storageKey = "template-arch-api-style-chooser";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    useCase: "Mobile app needs predictable payloads; server rendering mixed.",
    schemaStability: "stable",
    realtime: "low",
    couplingTolerance: "low",
  });

  const recommendation = useMemo(() => {
    if (state.realtime === "high") return "gRPC or WebSockets for streaming events; keep REST for config.";
    if (state.schemaStability === "volatile") return "GraphQL for evolving client needs with schema governance.";
    if (state.couplingTolerance === "low") return "REST with clear versioning; avoid tight coupling.";
    return "REST with versioning is a safe default; add GraphQL if clients vary.";
  }, [state]);

  const buildSections = () => [
    { heading: "Use case", body: state.useCase },
    { heading: "Schema stability", body: state.schemaStability },
    { heading: "Realtime need", body: state.realtime },
    { heading: "Coupling tolerance", body: state.couplingTolerance },
    { heading: "Recommendation", body: recommendation },
  ];

  return (
    <TemplateLayout
      title="API Style Chooser"
      description="Pick between REST, GraphQL, and gRPC with quick criteria."
      audience="Engineers and architects choosing interface style."
      useCases={["Decide interface style per product.", "Explain tradeoffs to stakeholders.", "Document rationale."]}
      instructions={["Capture use case and constraints.", "Set stability and realtime needs.", "Review recommendation.", "Export."]}
      outputTitle="Style recommendation"
      outputSummary={recommendation}
      outputInterpretation="Validate against team skills, tooling, and latency/SLA needs."
      outputNextSteps={["Define versioning plan.", "Set schema governance.", "Plan monitoring and error handling."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-api-style-chooser"
        title="API Style Chooser"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Use case
          <textarea
            value={state.useCase}
            onChange={(e) => updateState((prev) => ({ ...prev, useCase: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <label className="text-sm font-semibold text-slate-900">
            Schema stability
            <select
              value={state.schemaStability}
              onChange={(e) => updateState((prev) => ({ ...prev, schemaStability: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="stable">Stable</option>
              <option value="volatile">Volatile</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900">
            Realtime need
            <select
              value={state.realtime}
              onChange={(e) => updateState((prev) => ({ ...prev, realtime: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900">
            Coupling tolerance
            <select
              value={state.couplingTolerance}
              onChange={(e) => updateState((prev) => ({ ...prev, couplingTolerance: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Recommendation</p>
        <p className="mt-2 text-sm text-slate-700">{recommendation}</p>
      </div>
    </TemplateLayout>
  );
}

export function SloSlaBuilder() {
  const storageKey = "template-arch-slo-sla-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    service: "Checkout API",
    slo: "99.9% availability monthly",
    sla: "99.5% monthly availability with credits",
    alerting: "Page at 2% error budget burn per hour",
  });

  const buildSections = () => [
    { heading: "Service", body: state.service },
    { heading: "SLO", body: state.slo },
    { heading: "SLA", body: state.sla },
    { heading: "Alerting", body: state.alerting },
  ];

  return (
    <TemplateLayout
      title="SLO and SLA Builder"
      description="Draft SLOs, SLAs, and alerting rules with quick defaults."
      audience="Platform, SRE, and product teams."
      useCases={["Set targets with stakeholders.", "Capture SLAs for customers.", "Align alerts to error budgets."]}
      instructions={["Describe service.", "Set SLO target.", "Define SLA if applicable.", "Capture alert policy.", "Export."]}
      outputTitle="Reliability plan"
      outputSummary={`${state.service}: ${state.slo}. SLA ${state.sla}`}
      outputInterpretation="Treat SLOs as internal guardrails; SLAs as commitments. Keep alerting tied to burn rates."
      outputNextSteps={["Model error budgets.", "Instrument SLIs.", "Review quarterly with stakeholders."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-slo-sla-builder"
        title="SLO and SLA Builder"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Service
          <input
            type="text"
            value={state.service}
            onChange={(e) => updateState((prev) => ({ ...prev, service: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Alerting policy
          <input
            type="text"
            value={state.alerting}
            onChange={(e) => updateState((prev) => ({ ...prev, alerting: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          SLO
          <textarea
            value={state.slo}
            onChange={(e) => updateState((prev) => ({ ...prev, slo: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          SLA (if applicable)
          <textarea
            value={state.sla}
            onChange={(e) => updateState((prev) => ({ ...prev, sla: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export function LatencyBudgetCalculator() {
  const storageKey = "template-arch-latency-budget";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    totalBudgetMs: 500,
    hops: "Edge:50\nGateway:70\nService:120\nDB:140",
  });

  const parsedHops = useMemo(() => {
    return state.hops
      .split(/\r?\n/)
      .map((line) => line.split(":"))
      .filter((parts) => parts.length === 2)
      .map(([name, val]) => ({ name: name.trim(), ms: Number(val.trim()) || 0 }));
  }, [state.hops]);

  const used = parsedHops.reduce((sum, h) => sum + h.ms, 0);
  const remaining = Number(state.totalBudgetMs) - used;

  const buildSections = () => [
    { heading: "Total budget", body: `${state.totalBudgetMs} ms` },
    { heading: "Hops", body: parsedHops.map((h) => `${h.name}: ${h.ms} ms`).join("; ") },
    { heading: "Remaining", body: `${remaining} ms` },
  ];

  return (
    <TemplateLayout
      title="Latency Budget Calculator"
      description="Allocate latency budgets across hops and see remaining headroom."
      audience="Backend and architecture teams."
      useCases={["Set budgets across services.", "Spot bottlenecks early.", "Export for perf reviews."]}
      instructions={["Set total budget.", "List hops with ms values.", "Review remaining headroom.", "Export to share."]}
      outputTitle="Latency plan"
      outputSummary={`Used ${used} ms of ${state.totalBudgetMs} ms; remaining ${remaining} ms`}
      outputInterpretation="Keep buffer for jitter and retries. Revisit when adding hops."
      outputNextSteps={["Profile slow hops.", "Add caching where safe.", "Test under load."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-latency-budget"
        title="Latency Budget Calculator"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Total budget (ms)
          <input
            type="number"
            value={state.totalBudgetMs}
            onChange={(e) => updateState((prev) => ({ ...prev, totalBudgetMs: Number(e.target.value) }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            min={0}
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Hops and budgets (Name:ms per line)
          <textarea
            value={state.hops}
            onChange={(e) => updateState((prev) => ({ ...prev, hops: e.target.value }))}
            rows={6}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Edge:50\nGateway:70\nService:120\nDB:140"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Budget breakdown</p>
        <List items={parsedHops.map((h) => `${h.name}: ${h.ms} ms`)} />
        <p className="mt-2 text-sm font-semibold text-slate-900">
          Remaining: <span className="font-normal text-slate-800">{remaining} ms</span>
        </p>
      </div>
    </TemplateLayout>
  );
}

export function ServiceBoundaryMapper() {
  const storageKey = "template-arch-service-boundary-mapper";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    capabilities: "Billing, Payments, Orders, Notifications",
    couplingNotes: "Payments depends on Orders; Notifications listens to Orders events.",
  });

  const capabilityList = useMemo(
    () => state.capabilities.split(",").map((c) => c.trim()).filter(Boolean),
    [state.capabilities]
  );

  const suggestions = useMemo(() => {
    if (!capabilityList.length) return ["Add capabilities to see grouping ideas."];
    const clusters = [];
    for (let i = 0; i < capabilityList.length; i += 2) {
      const pair = capabilityList.slice(i, i + 2);
      if (pair.length) clusters.push(`Service ${Math.floor(i / 2) + 1}: ${pair.join(" + ")}`);
    }
    return clusters;
  }, [capabilityList]);

  const buildSections = () => [
    { heading: "Capabilities", body: state.capabilities },
    { heading: "Coupling notes", body: state.couplingNotes },
    { heading: "Suggested groupings", body: suggestions.join("; ") },
  ];

  return (
    <TemplateLayout
      title="Service Boundary Mapper"
      description="Draft service boundaries from capabilities and coupling notes."
      audience="Architects and domain designers."
      useCases={["Group capabilities into services.", "Spot coupling hotspots.", "Export for event storming or ADRs."]}
      instructions={["List capabilities.", "Add coupling notes.", "Review suggested groupings.", "Export snapshot."]}
      outputTitle="Boundary suggestions"
      outputSummary={suggestions.join(" ")}
      outputInterpretation="Validate groupings with domain language, ownership, and data boundaries."
      outputNextSteps={["Run event storming.", "Document contracts.", "Align owners and SLAs."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-service-boundary-mapper"
        title="Service Boundary Mapper"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Capabilities (comma separated)
          <textarea
            value={state.capabilities}
            onChange={(e) => updateState((prev) => ({ ...prev, capabilities: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Billing, Payments, Orders"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Coupling notes
          <textarea
            value={state.couplingNotes}
            onChange={(e) => updateState((prev) => ({ ...prev, couplingNotes: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Payments depends on Orders; Notifications listens to Orders events."
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Suggested groupings</p>
        <List items={suggestions} />
      </div>
    </TemplateLayout>
  );
}

export function ThreatModel() {
  const storageKey = "template-arch-threat-model";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    components: "Web app, API, Database",
    dataFlows: "Web app -> API; API -> DB",
    mitigations: "TLS everywhere; WAF; least privilege DB",
  });

  const stride = useMemo(() => {
    const items = ["Spoofing", "Tampering", "Repudiation", "Information disclosure", "Denial of service", "Elevation of privilege"];
    return items.map((item) => `${item}: note risks and controls`);
  }, []);

  const buildSections = () => [
    { heading: "Components", body: state.components },
    { heading: "Data flows", body: state.dataFlows },
    { heading: "Mitigations", body: state.mitigations },
    { heading: "STRIDE reminders", body: stride.join("; ") },
  ];

  return (
    <TemplateLayout
      title="Threat Model for Architecture"
      description="Lightweight STRIDE-style prompts for components and data flows."
      audience="Architects and security partners."
      useCases={["Kick off threat modelling.", "Document mitigations.", "Export for reviews."]}
      instructions={[
        "List components and data flows.",
        "Capture mitigations in place.",
        "Walk through STRIDE categories.",
        "Export and track actions.",
      ]}
      outputTitle="Threat model snapshot"
      outputSummary={`${state.components} | ${state.dataFlows}`}
      outputInterpretation="Use this to start the conversation. Follow with deeper analysis for critical systems."
      outputNextSteps={["Add assets and trust boundaries.", "Add abuse cases.", "Track fixes in backlog."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-threat-model"
        title="Threat Model for Architecture"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-900">
          Components
          <textarea
            value={state.components}
            onChange={(e) => updateState((prev) => ({ ...prev, components: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Data flows
          <textarea
            value={state.dataFlows}
            onChange={(e) => updateState((prev) => ({ ...prev, dataFlows: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Mitigations
          <textarea
            value={state.mitigations}
            onChange={(e) => updateState((prev) => ({ ...prev, mitigations: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">STRIDE prompts</p>
        <List items={stride} />
      </div>
    </TemplateLayout>
  );
}

export function TestStrategyBuilder() {
  const storageKey = "template-arch-test-strategy-builder";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    scope: "Checkout service and payments adapter",
    risks: "Payment provider flakiness; idempotency gaps",
    coverage: "Unit on domain; contract on provider; E2E on happy path",
    environments: "Dev, Staging with masked data, Prod",
  });

  const buildSections = () => [
    { heading: "Scope", body: state.scope },
    { heading: "Risks", body: state.risks },
    { heading: "Coverage", body: state.coverage },
    { heading: "Environments", body: state.environments },
  ];

  return (
    <TemplateLayout
      title="Test Strategy Builder"
      description="Plan unit, integration, contract, and end to end coverage with owners."
      audience="Engineers, QA, and leads."
      useCases={["Define coverage expectations.", "Share with teams and partners.", "Export for audits."]}
      instructions={["Define scope and risks.", "Set coverage by level.", "List environments and data rules.", "Export plan."]}
      outputTitle="Test strategy"
      outputSummary={`${state.scope} | ${state.coverage}`}
      outputInterpretation="Keep strategy lightweight; evolve with services and risks."
      outputNextSteps={["Add owners and timelines.", "Automate checks in CI.", "Review after incidents."]}
      attributionText={attribution}
    >
      <TemplateExportPanel
        templateId="arch-test-strategy-builder"
        title="Test Strategy Builder"
        category="Software Architecture"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Scope
          <textarea
            value={state.scope}
            onChange={(e) => updateState((prev) => ({ ...prev, scope: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Risks
          <textarea
            value={state.risks}
            onChange={(e) => updateState((prev) => ({ ...prev, risks: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Coverage by level
          <textarea
            value={state.coverage}
            onChange={(e) => updateState((prev) => ({ ...prev, coverage: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Unit on domain; contract on provider; E2E on happy path"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Environments and data rules
          <textarea
            value={state.environments}
            onChange={(e) => updateState((prev) => ({ ...prev, environments: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Dev, Staging (masked), Prod"
          />
        </label>
      </div>
    </TemplateLayout>
  );
}

export const archToolComponents = {
  "arch-c4-diagram-builder": C4DiagramBuilder,
  "arch-adr-generator": AdrGenerator,
  "arch-api-style-chooser": ApiStyleChooser,
  "arch-slo-sla-builder": SloSlaBuilder,
  "arch-latency-budget": LatencyBudgetCalculator,
  "arch-service-boundary-mapper": ServiceBoundaryMapper,
  "arch-threat-model": ThreatModel,
  "arch-test-strategy-builder": TestStrategyBuilder,
};
