const slugify = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "diagram";

export function buildDiagramFileBase({
  systemName,
  diagramType,
  variant,
  date = new Date(),
}: {
  systemName: string;
  diagramType: string;
  variant: string;
  date?: Date;
}) {
  const iso = date.toISOString().slice(0, 10);
  return `${slugify(systemName)}-${slugify(diagramType)}-${slugify(variant)}-${iso}`;
}


