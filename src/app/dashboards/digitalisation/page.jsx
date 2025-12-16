import ClientPage from "./page.client";

export const metadata = {
  title: "Digitalisation dashboards",
  description: "Interactive digitalisation sandboxes to think through data, platforms, journeys, risk and benefits.",
};

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

export default function DigitalisationDashboardsPage() {
  return <ClientPage />;
}
