import type { ArchitectureTemplate } from "./types";

export const proPaymentsPlatformTemplate: ArchitectureTemplate = {
  id: "pro-payments-platform",
  title: "Payments platform 💳",
  description: "Web app, API gateway, auth provider, payment processor, and audit logging for review-ready outputs.",
  intendedAudience: "professionals",
  diagramTypesIncluded: ["Context", "Container", "Deployment", "Data Flow", "Sequence"],
  input: {
    systemName: "Payments platform",
    systemDescription: "Customers check out and pay. The platform authenticates users, processes payments, and logs audit events.",
    audience: "professionals",
    goal: "design-review",
    users: [{ name: "Customer" }, { name: "Support admin" }],
    externalSystems: [{ name: "Auth provider" }, { name: "Payment processor" }, { name: "Audit logging service" }],
    containers: [
      { name: "Web app", type: "ui", description: "Checkout UI and account management." },
      { name: "API gateway", type: "api", description: "Routes requests and enforces access controls." },
      { name: "Payments service", type: "api", description: "Creates payment intents and reconciles status." },
      { name: "Orders database", type: "database", description: "Orders, customers, and payment status." },
      { name: "Worker", type: "worker", description: "Async reconciliation and notifications." },
    ],
    dataTypes: ["pii", "financial", "telemetry"],
    dataStores: [{ name: "Orders DB", description: "Order and payment records with audit fields." }],
    flows: [
      { from: "Web app", to: "Auth provider", purpose: "User sign-in", sensitive: true },
      { from: "Web app", to: "API gateway", purpose: "Checkout and account requests", sensitive: true },
      { from: "API gateway", to: "Payments service", purpose: "Create payment and confirm status", sensitive: true },
      { from: "Payments service", to: "Payment processor", purpose: "Process payment", sensitive: true },
      { from: "Payments service", to: "Orders database", purpose: "Persist order and payment status", sensitive: true },
      { from: "Payments service", to: "Audit logging service", purpose: "Write audit event", sensitive: true },
    ],
    security: {
      authenticationMethod: "OIDC with MFA for privileged roles",
      trustBoundaries: ["Browser to gateway", "Gateway to internal services", "Internal to third party"],
      hasNoTrustBoundariesConfirmed: false,
      adminAccess: true,
      sensitiveDataCategories: ["pii", "financial"],
    },
    versionName: "Payments platform starter",
  },
};


