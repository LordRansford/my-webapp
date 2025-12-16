"use client";

import NotesLayout from "@/components/NotesLayout";
import ProgressBar from "@/components/notes/ProgressBar";
import ToolCard from "@/components/learn/ToolCard";

import DigitalMaturityRadarDashboard from "@/components/dashboards/digitalisation/DigitalMaturityRadarDashboard";
import DataLifecycleMapDashboard from "@/components/dashboards/digitalisation/DataLifecycleMapDashboard";
import SystemCapabilityMatrixDashboard from "@/components/dashboards/digitalisation/SystemCapabilityMatrixDashboard";
import DataCatalogueExplorerDashboard from "@/components/dashboards/digitalisation/DataCatalogueExplorerDashboard";
import DataQualityDashboard from "@/components/dashboards/digitalisation/DataQualityDashboard";
import MetadataLineageMapDashboard from "@/components/dashboards/digitalisation/MetadataLineageMapDashboard";
import InteroperabilityStandardsMapDashboard from "@/components/dashboards/digitalisation/InteroperabilityStandardsMapDashboard";
import ApiCatalogueDashboard from "@/components/dashboards/digitalisation/ApiCatalogueDashboard";
import ConsentPolicySandboxDashboard from "@/components/dashboards/digitalisation/ConsentPolicySandboxDashboard";
import DataSharingAgreementCanvasDashboard from "@/components/dashboards/digitalisation/DataSharingAgreementCanvasDashboard";
import ReferenceDataStewardshipDashboard from "@/components/dashboards/digitalisation/ReferenceDataStewardshipDashboard";
import DigitalServiceJourneyMapDashboard from "@/components/dashboards/digitalisation/DigitalServiceJourneyMapDashboard";
import ProcessAutomationHeatmapDashboard from "@/components/dashboards/digitalisation/ProcessAutomationHeatmapDashboard";
import LegacyTargetPlannerDashboard from "@/components/dashboards/digitalisation/LegacyTargetPlannerDashboard";
import PlatformStrategyCanvasDashboard from "@/components/dashboards/digitalisation/PlatformStrategyCanvasDashboard";
import OutcomeKPIDashboard from "@/components/dashboards/digitalisation/OutcomeKPIDashboard";
import RiskControlRegisterDashboard from "@/components/dashboards/digitalisation/RiskControlRegisterDashboard";
import StakeholderPersonaMapDashboard from "@/components/dashboards/digitalisation/StakeholderPersonaMapDashboard";
import RoadmapInitiativePlannerDashboard from "@/components/dashboards/digitalisation/RoadmapInitiativePlannerDashboard";
import BenefitRealisationTrackerDashboard from "@/components/dashboards/digitalisation/BenefitRealisationTrackerDashboard";

const sections = [
  { title: "Digital maturity radar", anchor: "digital-maturity-radar" },
  { title: "Data lifecycle map", anchor: "data-lifecycle-map" },
  { title: "System capability matrix", anchor: "system-capability-matrix" },
  { title: "Data catalogue explorer", anchor: "data-catalogue-explorer" },
  { title: "Data quality cockpit", anchor: "data-quality-dashboard" },
  { title: "Metadata and lineage map", anchor: "metadata-lineage-map" },
  { title: "Interoperability and standards map", anchor: "interoperability-standards-map" },
  { title: "API catalogue and harmonisation", anchor: "api-catalogue" },
  { title: "Consent and policy sandbox", anchor: "consent-policy-sandbox" },
  { title: "Data sharing agreement canvas", anchor: "data-sharing-agreement" },
  { title: "Reference data stewardship board", anchor: "reference-data-stewardship" },
  { title: "Digital service journey map", anchor: "digital-service-journey-map" },
  { title: "Process automation heatmap", anchor: "process-automation-heatmap" },
  { title: "Legacy and target state planner", anchor: "legacy-target-planner" },
  { title: "Platform strategy canvas", anchor: "platform-strategy-canvas" },
  { title: "Outcome and KPI dashboard", anchor: "outcome-kpi-dashboard" },
  { title: "Risk and control register", anchor: "risk-control-register" },
  { title: "Stakeholder and persona map", anchor: "stakeholder-persona-map" },
  { title: "Roadmap and initiative planner", anchor: "roadmap-initiative-planner" },
  { title: "Benefit realisation tracker", anchor: "benefit-realisation-tracker" },
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
      headings={sections.map((s) => ({ id: s.anchor, title: s.title, depth: 2 }))}
    >
      <main className="relative flex-1 space-y-10">
        <ProgressBar />
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="eyebrow m-0 text-gray-600">Dashboards · Digitalisation</p>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">Digitalisation dashboards</h1>
          <p className="max-w-2xl text-sm text-slate-700">
            These dashboards are small practice environments for digitalisation. They help you think about data, platforms,
            journeys, risk and benefits in a concrete and visual way. They are not production tools. They are thinking tools.
          </p>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          {/* Sections remain identical to prior version */}
          {sections.map((section) => (
            <Section key={section.anchor} id={section.anchor} title={section.title} />
          ))}
        </article>
      </main>
    </NotesLayout>
  );
}

function Section({ id, title }) {
  const content = {
    "digital-maturity-radar": {
      body: (
        <>
          <p>
            Digitalisation is more than technology. It combines people, process, data, platforms and ways of working. A digital
            maturity radar gives a balanced view of where an organisation is strong and where it has gaps. It is a picture of
            capability rather than a scorecard.
          </p>
          <p>
            This dashboard lets you rate a small set of dimensions such as data, platforms, skills, governance and customer
            experience. It shows a radar view and a short narrative summary so you can see where to focus next.
          </p>
          <ToolCard title="Digital maturity radar" description="Adjust maturity scores and see a radar view and narrative summary.">
            <DigitalMaturityRadarDashboard />
          </ToolCard>
        </>
      ),
    },
    "data-lifecycle-map": {
      body: (
        <>
          <p>
            Digitalisation relies on clear data lifecycles. Data is created, ingested, stored, transformed, used and archived.
            When this lifecycle is unclear, people lose trust and projects slow down. A simple lifecycle map gives a shared
            picture of where data comes from and how it flows.
          </p>
          <p>
            This dashboard lets you map one or two important data sets. You describe how they are created, where they are stored,
            how they are transformed and where they are used. The tool lays this out as a clear chain with short prompts for
            where controls or improvements might be needed.
          </p>
          <ToolCard title="Data lifecycle map" description="Describe how data is created and used and see a simple lifecycle view.">
            <DataLifecycleMapDashboard />
          </ToolCard>
        </>
      ),
    },
    "system-capability-matrix": {
      body: (
        <>
          <p>
            Many digital estates grow organically. Systems overlap, duplicate or leave gaps. A capability matrix joins business
            capabilities with systems. It shows where capabilities are well supported, weakly supported or not supported at all.
          </p>
          <p>
            This dashboard lets you define a small list of capabilities and systems. You then rate how well each system supports
            each capability. The view uses a simple colour map to show strengths and gaps.
          </p>
          <ToolCard title="System capability matrix" description="Map systems to business capabilities and spot overlaps and gaps.">
            <SystemCapabilityMatrixDashboard />
          </ToolCard>
        </>
      ),
    },
    "data-catalogue-explorer": {
      body: (
        <>
          <p>
            Catalogues help people discover data sets, trust them and use them safely. A catalogue entry usually has a
            description, owner, quality signals and usage notes. This dashboard is a tiny catalogue so you can practise how good
            entries should look.
          </p>
          <p>
            You can browse sample catalogue entries, filter by domain and see which entries have clear owners and quality
            information. It nudges you towards richer and more useful descriptions.
          </p>
          <ToolCard title="Data catalogue explorer" description="Explore a small mock catalogue and see what good entries look like.">
            <DataCatalogueExplorerDashboard />
          </ToolCard>
        </>
      ),
    },
    "data-quality-dashboard": {
      body: (
        <>
          <p>
            Data quality is not one thing. It involves completeness, timeliness, accuracy, consistency and fitness for purpose. A
            cockpit view helps you see where issues cluster and where to focus improvement.
          </p>
          <p>
            This dashboard shows a small set of sample quality metrics for one or two data sets. You can adjust issue rates and
            see how an overall quality picture changes. The view explains in plain language what that would feel like for people
            who rely on the data.
          </p>
          <ToolCard title="Data quality cockpit" description="Adjust simple quality scores and see how the overall picture changes.">
            <DataQualityDashboard />
          </ToolCard>
        </>
      ),
    },
    "metadata-lineage-map": {
      body: (
        <>
          <p>
            Lineage describes how data moves and changes across systems. Metadata describes what the data means. Together they
            let people answer questions such as where did this value come from and what does this field actually mean.
          </p>
          <p>
            This dashboard asks you to connect a small number of fields across systems. It then draws a simple lineage chain and
            shows where definitions are missing or inconsistent. It helps you practise spotting lineage gaps.
          </p>
          <ToolCard title="Metadata and lineage map" description="Connect fields across systems and see a simple lineage story.">
            <MetadataLineageMapDashboard />
          </ToolCard>
        </>
      ),
    },
    "interoperability-standards-map": {
      body: (
        <>
          <p>
            Interoperability is about systems being able to exchange and understand data. Standards reduce friction and avoid
            one-off integrations. A standards map shows where common formats are used and where bespoke ones still exist.
          </p>
          <p>
            This dashboard lets you list interfaces or feeds and mark which standards or formats they use. It then shows a simple
            view of where standards cluster and where bespoke formats remain a risk.
          </p>
          <ToolCard
            title="Interoperability and standards map"
            description="Record interfaces and formats and see where standards are missing."
          >
            <InteroperabilityStandardsMapDashboard />
          </ToolCard>
        </>
      ),
    },
    "api-catalogue": {
      body: (
        <>
          <p>
            As organisations expose more APIs, it becomes important that they are discoverable and reasonably consistent. An API
            catalogue is a focused view of important endpoints, their purpose and their stability.
          </p>
          <p>
            This dashboard contains a small mock API catalogue. You can filter by domain or team and see where naming, versioning
            or ownership are unclear. It helps you practise what to look for in an API estate.
          </p>
          <ToolCard
            title="API catalogue and harmonisation"
            description="Explore a small API catalogue and spot consistency and ownership problems."
          >
            <ApiCatalogueDashboard />
          </ToolCard>
        </>
      ),
    },
    "consent-policy-sandbox": {
      body: (
        <>
          <p>
            Digitalisation must respect consent and policy. Different data uses may require consent, legitimate interest or other
            bases. A simple sandbox helps you practise checking whether a proposed use is aligned with policy.
          </p>
          <p>
            This dashboard lets you describe a proposed data use at a high level. It then walks you through simple questions
            about purpose, data type, retention and transparency. It does not give legal advice. It helps structure thinking and
            highlight where a deeper review would be needed.
          </p>
          <ToolCard title="Consent and policy sandbox" description="Describe a proposed data use and walk through simple policy checks.">
            <ConsentPolicySandboxDashboard />
          </ToolCard>
        </>
      ),
    },
    "data-sharing-agreement": {
      body: (
        <>
          <p>
            When organisations share data they need clarity on purpose, responsibilities and controls. A canvas view is a one-page
            summary of a data sharing arrangement that both sides can understand.
          </p>
          <p>
            This dashboard guides you through key elements such as parties, purpose, data sets, legal basis, controls and review
            cycle. It creates a structured summary rather than legal text.
          </p>
          <ToolCard
            title="Data sharing agreement canvas"
            description="Capture key elements of a data sharing arrangement on one page."
          >
            <DataSharingAgreementCanvasDashboard />
          </ToolCard>
        </>
      ),
    },
    "reference-data-stewardship": {
      body: (
        <>
          <p>
            Reference data such as codes and lists is often shared across many systems. Poor stewardship creates inconsistency and
            confusion. A simple board view helps you see ownership and health for key reference data sets.
          </p>
          <p>
            This dashboard shows a small list of sample reference data sets with owners, update frequency and quality notes. You
            can adjust health indicators and see which sets need attention.
          </p>
          <ToolCard title="Reference data stewardship board" description="Track key reference data sets, owners and health indicators.">
            <ReferenceDataStewardshipDashboard />
          </ToolCard>
        </>
      ),
    },
    "digital-service-journey-map": {
      body: (
        <>
          <p>
            Digitalisation is not only internal. It is about how people experience services. A journey map traces what a user is
            trying to do and which systems they touch. It makes failure points visible.
          </p>
          <p>
            This dashboard lets you sketch a short journey with steps, channels and back-end systems. It then highlights steps
            where the journey is manual, slow or dependent on a legacy system.
          </p>
          <ToolCard title="Digital service journey map" description="Sketch a service journey and see where experience is fragile.">
            <DigitalServiceJourneyMapDashboard />
          </ToolCard>
        </>
      ),
    },
    "process-automation-heatmap": {
      body: (
        <>
          <p>
            Automation can free people to focus on higher value work. It is not always the right answer. A heatmap shows where
            processes are repetitive and rule-based and where they need judgement.
          </p>
          <p>
            This dashboard provides a small grid where you place processes by volume and complexity. It suggests where automation,
            augmentation or redesign might be more suitable.
          </p>
          <ToolCard title="Process automation heatmap" description="Place processes on a simple grid to see automation candidates.">
            <ProcessAutomationHeatmapDashboard />
          </ToolCard>
        </>
      ),
    },
    "legacy-target-planner": {
      body: (
        <>
          <p>
            Most digitalisation journeys start from a mix of legacy and newer systems. The key is to be honest about where you are
            and deliberate about where you want to get to. This planner helps you sketch a simple current and target state.
          </p>
          <p>
            You list current systems and mark whether they are keep, modernise or retire. You then list target platforms. The tool
            shows where there is clear alignment and where there are gaps.
          </p>
          <ToolCard title="Legacy and target state planner" description="Classify current systems and sketch target platforms.">
            <LegacyTargetPlannerDashboard />
          </ToolCard>
        </>
      ),
    },
    "platform-strategy-canvas": {
      body: (
        <>
          <p>
            Platform thinking focuses on shared capabilities that many teams can use. A platform strategy canvas captures the core
            value, primary users and key capabilities of a platform in one view.
          </p>
          <p>
            This dashboard guides you through a small set of prompts about a potential platform. You record who it serves, what
            shared problems it solves and what it deliberately does not try to do.
          </p>
          <ToolCard title="Platform strategy canvas" description="Capture a platform idea and stress test its focus.">
            <PlatformStrategyCanvasDashboard />
          </ToolCard>
        </>
      ),
    },
    "outcome-kpi-dashboard": {
      body: (
        <>
          <p>
            Digitalisation should be tied to outcomes rather than activity. A simple outcome and KPI view links initiatives to the
            measures that matter. It avoids long lists of metrics and focuses on a few that are meaningful.
          </p>
          <p>
            This dashboard lets you define a handful of outcomes and the indicators that relate to them. You can adjust current
            and target values and see a simple traffic light view.
          </p>
          <ToolCard title="Outcome and KPI dashboard" description="Link outcomes and indicators and see how far there is to go.">
            <OutcomeKPIDashboard />
          </ToolCard>
        </>
      ),
    },
    "risk-control-register": {
      body: (
        <>
          <p>
            Digitalisation changes risk. New platforms, data flows and integrations bring both opportunity and exposure. A light
            risk and control register keeps this visible without overwhelming people.
          </p>
          <p>
            This dashboard lets you record digitalisation risks with likelihood, impact and key controls. It presents a simple
            view that supports conversation rather than compliance theatre.
          </p>
          <ToolCard title="Risk and control register" description="Record digital risks and controls in a simple, structured view.">
            <RiskControlRegisterDashboard />
          </ToolCard>
        </>
      ),
    },
    "stakeholder-persona-map": {
      body: (
        <>
          <p>
            Digitalisation touches many different people. Stakeholder and persona maps clarify who is affected, what they care
            about and how they experience change. This helps you design communication and training that matches reality.
          </p>
          <p>
            This dashboard lets you capture a small set of personas and stakeholders, their goals and their concerns. It groups
            them visually so you can see who may benefit and who may feel risk.
          </p>
          <ToolCard
            title="Stakeholder and persona map"
            description="Capture personas and stakeholders and see goals and concerns side by side."
          >
            <StakeholderPersonaMapDashboard />
          </ToolCard>
        </>
      ),
    },
    "roadmap-initiative-planner": {
      body: (
        <>
          <p>
            Roadmaps are stories about change. They show how initiatives fit together over time and how they support outcomes.
            This planner is a simple view where you can place initiatives along a timeline and link them to the dashboards above.
          </p>
          <p>
            You add initiatives with timing, owner and related outcomes. The view shows a compact timeline and highlights where
            initiatives overlap heavily or leave gaps.
          </p>
          <ToolCard title="Roadmap and initiative planner" description="Place initiatives on a timeline and connect them to outcomes.">
            <RoadmapInitiativePlannerDashboard />
          </ToolCard>
        </>
      ),
    },
    "benefit-realisation-tracker": {
      body: (
        <>
          <p>
            Promised benefits often drift away once projects complete. A benefit tracker helps you keep a direct line between
            digitalisation effort and realised value. It does not need to be complex. It needs to be honest and visible.
          </p>
          <p>
            This dashboard lets you document expected benefits, the measures that will show whether they are real and a simple
            status. It is a small daily reminder to ask whether the work is making a real difference.
          </p>
          <ToolCard
            title="Benefit realisation tracker"
            description="Track expected digitalisation benefits and whether they are actually realised."
          >
            <BenefitRealisationTrackerDashboard />
          </ToolCard>
        </>
      ),
    },
  }[id];

  return (
    <section id={id}>
      <h2>{title}</h2>
      {content?.body}
    </section>
  );
}
