import type { ArchitectureDiagramInput } from "../schema";
import type { Audience } from "../copy/audience";

export type ArchitectureTemplateId =
  | "kids-school-library"
  | "students-todo-login"
  | "pro-payments-platform"
  | "cyber-zero-trust-web-app"
  | "data-analytics-pipeline";

export type ArchitectureTemplate = {
  id: ArchitectureTemplateId;
  title: string;
  description: string;
  intendedAudience: Audience;
  diagramTypesIncluded: Array<"Context" | "Container" | "Deployment" | "Data Flow" | "Sequence">;
  input: ArchitectureDiagramInput;
};


