export type GeneratedFile = {
  filename: string;
  content: string;
  mime?: string;
  description?: string;
  /**
   * Optional hint for UIs (not enforced).
   */
  kind?: "deliverable" | "trace" | "audit" | "config";
};

