import type { ArchitectureTemplate } from "./types";

export const dataAnalyticsPipelineTemplate: ArchitectureTemplate = {
  id: "data-analytics-pipeline",
  title: "Analytics pipeline 📊",
  description: "Ingestion, processing, storage, and reporting for a clear data review starter pack.",
  intendedAudience: "students",
  diagramTypesIncluded: ["Context", "Container", "Deployment", "Data Flow", "Sequence"],
  input: {
    systemName: "Analytics pipeline",
    systemDescription: "Data is ingested, processed, stored, and reported to stakeholders with clear sensitivity handling.",
    audience: "students",
    goal: "data-review",
    users: [{ name: "Analyst" }, { name: "Data engineer" }],
    externalSystems: [{ name: "Source systems" }, { name: "BI reporting" }],
    containers: [
      { name: "Ingestion service", type: "worker", description: "Collects and validates incoming data." },
      { name: "Processing service", type: "worker", description: "Transforms and aggregates data." },
      { name: "Data API", type: "api", description: "Serves curated datasets." },
      { name: "Warehouse", type: "database", description: "Stores raw and curated datasets." },
      { name: "Reporting UI", type: "ui", description: "Dashboards and reports." },
    ],
    dataTypes: ["pii", "telemetry"],
    dataStores: [{ name: "Warehouse", description: "Raw and curated datasets with access controls." }],
    flows: [
      { from: "Source systems", to: "Ingestion service", purpose: "Send events and extracts", sensitive: true },
      { from: "Ingestion service", to: "Warehouse", purpose: "Write raw dataset", sensitive: true },
      { from: "Processing service", to: "Warehouse", purpose: "Write curated dataset", sensitive: true },
      { from: "Data API", to: "Warehouse", purpose: "Read curated dataset", sensitive: true },
      { from: "Reporting UI", to: "Data API", purpose: "Request dashboards", sensitive: true },
      { from: "Reporting UI", to: "BI reporting", purpose: "Publish reports", sensitive: false },
    ],
    security: {
      authenticationMethod: "SSO for analysts and engineers",
      trustBoundaries: ["Internal network", "User to reporting"],
      hasNoTrustBoundariesConfirmed: false,
      adminAccess: true,
      sensitiveDataCategories: ["pii"],
    },
    versionName: "Analytics pipeline starter",
  },
};


