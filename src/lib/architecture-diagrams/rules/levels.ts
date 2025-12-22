export type DiagramLevel = "c4-context" | "c4-container" | "deployment" | "dfd";

export type DiagramItemKind =
  | "person"
  | "system"
  | "relationship"
  | "container"
  | "database"
  | "queue"
  | "internal-api"
  | "class"
  | "module"
  | "function"
  | "runtime-node"
  | "environment"
  | "boundary"
  | "process"
  | "data-store"
  | "external-entity"
  | "flow";

export type LevelValidationWarning = {
  kind: "warning";
  message: string;
  omitted: { kind: DiagramItemKind; label: string; reason: string }[];
};

const ALLOWED: Record<DiagramLevel, Set<DiagramItemKind>> = {
  "c4-context": new Set(["person", "system", "relationship"]),
  "c4-container": new Set(["container", "database", "queue", "system", "relationship", "internal-api"]),
  deployment: new Set(["runtime-node", "environment", "boundary", "relationship"]),
  dfd: new Set(["process", "data-store", "external-entity", "flow", "boundary"]),
};

const LEVEL_NAMES: Record<DiagramLevel, string> = {
  "c4-context": "C4 Context",
  "c4-container": "C4 Container",
  deployment: "Deployment",
  dfd: "DFD",
};

export function getStabilityNote(level: DiagramLevel) {
  if (level === "c4-context") return "Context diagrams change slowly.";
  if (level === "c4-container") return "Container diagrams change moderately.";
  return "Component and runtime detail changes often.";
}

export function validateLevelItems(
  level: DiagramLevel,
  items: Array<{ kind: DiagramItemKind; label: string }>
): { kept: Array<{ kind: DiagramItemKind; label: string }>; warning: LevelValidationWarning | null } {
  const allowed = ALLOWED[level] || new Set<DiagramItemKind>();
  const omitted: LevelValidationWarning["omitted"] = [];
  const kept: Array<{ kind: DiagramItemKind; label: string }> = [];

  for (const item of items || []) {
    const label = String(item?.label || "").trim();
    if (!label) continue;
    const kind = item.kind;
    if (!allowed.has(kind)) {
      omitted.push({
        kind,
        label,
        reason: `${kind} does not belong at ${LEVEL_NAMES[level]} level.`,
      });
      continue;
    }
    kept.push({ kind, label });
  }

  if (omitted.length === 0) return { kept, warning: null };

  return {
    kept,
    warning: {
      kind: "warning",
      message: `Some details were excluded to keep the diagram at the correct abstraction level (${LEVEL_NAMES[level]}).`,
      omitted,
    },
  };
}


