import type { ArchitectureDiagramInput } from "./schema";

export const EXAMPLE_KID_FRIENDLY: ArchitectureDiagramInput = {
  systemName: "Online toy shop",
  systemDescription: "A small shop where customers browse toys, sign in, and pay for orders. Admins manage products and orders.",
  audience: "kids",
  goal: "explain",
  users: [{ name: "Customer" }, { name: "Admin" }],
  externalSystems: [{ name: "Payment provider" }],
  containers: [
    { name: "Web app", type: "ui", description: "Browser site for browsing and checkout." },
    { name: "API", type: "api", description: "Handles login, orders, and inventory." },
    { name: "Database", type: "database", description: "Stores users, products, and orders." },
  ],
  dataTypes: ["pii", "financial"],
  dataStores: [{ name: "Orders DB", description: "Orders, customers, and payment status." }],
  flows: [
    { from: "Customer", to: "Web app", purpose: "Browse and checkout", sensitive: false },
    { from: "Web app", to: "API", purpose: "Create order and sign in", sensitive: true },
    { from: "API", to: "Payment provider", purpose: "Take payment", sensitive: true },
  ],
  security: {
    authenticationMethod: "Password + optional MFA for admins",
    trustBoundaries: ["Browser to server"],
    hasNoTrustBoundariesConfirmed: false,
    adminAccess: true,
    sensitiveDataCategories: ["pii", "financial"],
  },
  versionName: "Toy shop draft",
};

export const EXAMPLE_PROFESSIONAL: ArchitectureDiagramInput = {
  systemName: "Customer support platform",
  systemDescription:
    "A web app and API that lets agents manage tickets. Authentication uses an external identity provider. Events are logged to a central platform for audit and monitoring.",
  audience: "professionals",
  goal: "security-review",
  users: [{ name: "Support agent" }, { name: "Support admin" }],
  externalSystems: [{ name: "Identity provider" }, { name: "Logging platform" }],
  containers: [
    { name: "Web app", type: "ui", description: "Agent UI, runs in browser." },
    { name: "API", type: "api", description: "Ticket service and admin endpoints." },
    { name: "Worker", type: "worker", description: "Async processing for notifications and exports." },
    { name: "Postgres", type: "database", description: "Tickets, users, and audit records." },
    { name: "Third party: email", type: "third-party", description: "Outbound email provider." },
  ],
  dataTypes: ["pii", "telemetry", "credentials"],
  dataStores: [{ name: "Postgres", description: "Primary data store with audit logging." }],
  flows: [
    { from: "Web app", to: "Identity provider", purpose: "User sign-in", sensitive: true },
    { from: "Web app", to: "API", purpose: "Ticket operations", sensitive: true },
    { from: "API", to: "Logging platform", purpose: "Audit and monitoring events", sensitive: true },
  ],
  security: {
    authenticationMethod: "OIDC with MFA for privileged roles",
    trustBoundaries: ["Browser to API", "API to third party"],
    hasNoTrustBoundariesConfirmed: false,
    adminAccess: true,
    sensitiveDataCategories: ["pii", "credentials"],
  },
  versionName: "Security review draft",
};


