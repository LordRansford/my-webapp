import type { ArchitectureTemplate } from "./types";

export const cyberZeroTrustWebAppTemplate: ArchitectureTemplate = {
  id: "cyber-zero-trust-web-app",
  title: "Zero trust web app",
  description: "Identity provider, policy enforcement, internal services, and logging and monitoring for security review.",
  intendedAudience: "professionals",
  diagramTypesIncluded: ["Context", "Container", "Deployment", "Data Flow", "Sequence"],
  input: {
    systemName: "Zero trust web app",
    systemDescription: "A web app where every request is authenticated and authorised. Policies are enforced consistently and events are logged.",
    audience: "professionals",
    goal: "security-review",
    users: [{ name: "Employee" }, { name: "Security reviewer" }],
    externalSystems: [{ name: "Identity provider" }, { name: "Logging and monitoring" }],
    containers: [
      { name: "Web app", type: "ui", description: "Browser UI for the application." },
      { name: "Policy enforcement point", type: "api", description: "Validates identity and policy on each request." },
      { name: "Internal API", type: "api", description: "Business logic service behind policy enforcement." },
      { name: "Data store", type: "database", description: "Primary store for application records." },
    ],
    dataTypes: ["pii", "credentials", "telemetry"],
    dataStores: [{ name: "App DB", description: "Application data with audit fields." }],
    flows: [
      { from: "Web app", to: "Identity provider", purpose: "User sign-in and token issuance", sensitive: true },
      { from: "Web app", to: "Policy enforcement point", purpose: "Call protected endpoints with token", sensitive: true },
      { from: "Policy enforcement point", to: "Internal API", purpose: "Forward authorised requests", sensitive: true },
      { from: "Internal API", to: "Data store", purpose: "Read and write records", sensitive: true },
      { from: "Policy enforcement point", to: "Logging and monitoring", purpose: "Write access and policy decision logs", sensitive: true },
    ],
    security: {
      authenticationMethod: "OIDC with device and session policies",
      trustBoundaries: ["Browser to enforcement", "Enforcement to internal services"],
      hasNoTrustBoundariesConfirmed: false,
      adminAccess: true,
      sensitiveDataCategories: ["pii", "credentials"],
    },
    versionName: "Zero trust starter",
  },
};


