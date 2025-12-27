import type { ArchitectureTemplate } from "./types";

export const studentsTodoLoginTemplate: ArchitectureTemplate = {
  id: "students-todo-login",
  title: "Todo app with login",
  description: "A simple web app with login, an API, and a database to store tasks.",
  intendedAudience: "students",
  diagramTypesIncluded: ["Context", "Container", "Deployment", "Data Flow", "Sequence"],
  input: {
    systemName: "Todo app",
    systemDescription: "Users sign in, create tasks, and mark them complete. Admins can manage users.",
    audience: "students",
    goal: "design-review",
    users: [{ name: "User" }, { name: "Admin" }],
    externalSystems: [{ name: "Identity provider" }],
    containers: [
      { name: "Web app", type: "ui", description: "Browser UI for tasks." },
      { name: "Todo API", type: "api", description: "CRUD tasks and users." },
      { name: "Database", type: "database", description: "Stores users and tasks." },
    ],
    dataTypes: ["pii"],
    dataStores: [{ name: "Todo DB", description: "Users, tasks, and audit fields." }],
    flows: [
      { from: "Web app", to: "Identity provider", purpose: "User sign-in", sensitive: true },
      { from: "Web app", to: "Todo API", purpose: "Create and update tasks", sensitive: true },
      { from: "Todo API", to: "Database", purpose: "Read and write tasks", sensitive: true },
    ],
    security: {
      authenticationMethod: "OIDC login via identity provider",
      trustBoundaries: ["Browser to API", "API to database"],
      hasNoTrustBoundariesConfirmed: false,
      adminAccess: true,
      sensitiveDataCategories: ["pii"],
    },
    versionName: "Todo starter",
  },
};


