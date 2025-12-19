import registry from "../../../../content/templates/registry.json";
import AiTemplatesClient from "./AiTemplatesClient";

export const metadata = {
  title: "AI templates",
  description: "Flagship AI planning tools for data, model, and delivery workflows.",
};

const templates = registry.filter((item) => item.category === "AI");
const areas = Array.from(new Set(templates.map((t) => t.area || "Other")));

export default function AiTemplatesPage() {
  return <AiTemplatesClient templates={templates} areas={areas} />;
}
