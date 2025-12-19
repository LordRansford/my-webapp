import registry from "../../../../content/templates/registry.json";
import ArchitectureTemplatesClient from "./ArchitectureTemplatesClient";

export const metadata = {
  title: "Software architecture templates",
  description: "Architecture decision, documentation, reliability, and delivery tools.",
};

const templates = registry.filter((item) => item.category === "Software Architecture");
const areas = Array.from(new Set(templates.map((t) => t.area || "Other")));

export default function ArchitectureTemplatesPage() {
  return <ArchitectureTemplatesClient templates={templates} areas={areas} />;
}
