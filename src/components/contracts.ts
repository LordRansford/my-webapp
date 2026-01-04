// Component contracts act as API documentation and light enforcement for UI usage.
// These definitions should be referenced by tests and linting to prevent regressions.

export type HeaderContract = {
  props: {};
  allowed: string[];
  forbidden: string[];
};

export const HeaderContract: HeaderContract = {
  props: {},
  allowed: ["Logo", "Courses", "Tools", "Studios", "Games hub", "Updates", "About", "Account/Sign in", "Sticky"],
  forbidden: ["Icon-only items", "Progress indicators"],
};

export type FooterContract = {
  props: {};
  requiredLinks: string[];
};

export const FooterContract: FooterContract = {
  props: {},
  requiredLinks: ["Courses", "Tools", "Play", "Studios", "Support", "About", "Accessibility", "Privacy", "Terms"],
};

export type CourseProgressBarContract = {
  props: { courseId: string; manifest?: unknown; courseTitle?: string };
  allowed: string[];
  forbidden: string[];
};

export const CourseProgressBarContract: CourseProgressBarContract = {
  props: { courseId: "", manifest: undefined, courseTitle: undefined },
  allowed: ["Course pages only", "Auto-fit steps"],
  forbidden: ["Non-course pages", "Labs", "Studios", "Games"],
};

export type CourseSidebarContract = {
  props: { sections: Array<{ id: string; title: string; href: string }> };
  allowed: string[];
  forbidden: string[];
};

export const CourseSidebarContract: CourseSidebarContract = {
  props: { sections: [] },
  allowed: ["Course pages only"],
  forbidden: ["Non-course pages", "Labs", "Studios", "Games"],
};

export type ToolCardContract = {
  props: { title: string; description: string; usageHint: string; actionLabel?: string };
  allowed: string[];
  forbidden: string[];
};

export const ToolCardContract: ToolCardContract = {
  props: { title: "", description: "", usageHint: "", actionLabel: undefined },
  allowed: ["Inline actions", "Clear purpose", "Capabilities listed"],
  forbidden: ["Empty description", "Fixed heights", "Inline styles", "Missing usage hint"],
};

export type FeedbackChatWidgetContract = {
  props: {};
  allowed: string[];
  forbidden: string[];
};

export const FeedbackChatWidgetContract: FeedbackChatWidgetContract = {
  props: {},
  allowed: ["Screenshot upload", "Page context capture"],
  forbidden: ["Icon-only triggers"],
};

export type ProfessorChatWidgetContract = {
  props: {};
  allowed: string[];
  forbidden: string[];
};

export const ProfessorChatWidgetContract: ProfessorChatWidgetContract = {
  props: {},
  allowed: ["Course help", "Tool help", "Citations to site pages", "Assessment integrity pause"],
  forbidden: ["Exam help during active timed sessions", "Icon-only triggers"],
};

export type GameCanvasContract = {
  props: { children: unknown };
  allowed: string[];
  forbidden: string[];
};

export const GameCanvasContract: GameCanvasContract = {
  props: { children: null },
  allowed: ["Keyboard support", "Mobile support", "Offline capable where applicable"],
  forbidden: ["Course UI", "Progress bars", "Sidebars"],
};

export type StudioToolbarContract = {
  props: { backHref: string };
  allowed: string[];
  forbidden: string[];
};

export const StudioToolbarContract: StudioToolbarContract = {
  props: { backHref: "" },
  allowed: ["Back navigation", "Contextual actions"],
  forbidden: ["Course progress", "Sidebars"],
};

export type ToolMetadata = {
  id: string;
  purpose: string;
  inputs: { name: string; type: string; limits: string }[];
  execution: "local" | "compute-runner";
  outputs: string[];
  errorTaxonomy: string[];
};

export const TOOL_METADATA: ToolMetadata[] = [
  {
    id: "architecture-diagram-studio",
    purpose: "Generate draft architecture diagrams from structured inputs for communication and review.",
    inputs: [
      { name: "systemName", type: "string", limits: "max 80 chars" },
      { name: "systemDescription", type: "string", limits: "max 600 chars" },
      { name: "audience", type: "enum", limits: "students|professionals" },
      { name: "goal", type: "enum", limits: "explain|design-review|security-review|data-review" },
      { name: "actors/blocks/flows/security", type: "arrays", limits: "capped by ARCH_DIAGRAM_LIMITS" },
    ],
    execution: "local",
    outputs: ["Mermaid-based diagrams (context/container/DFD/sequence)", "SVG/PNG downloads", "Architecture brief and ADR stubs"],
    errorTaxonomy: [
      "validation_error: input fails schema or exceeds limits",
      "generation_error: diagram generation fails on valid input",
      "user_error: missing required fields (e.g., trust boundaries for security goals)",
    ],
  },
];
