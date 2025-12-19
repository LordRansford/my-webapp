import registry from "../../../../content/templates/registry.json";
import DataTemplatesClient from "./DataTemplatesClient";

export const metadata = {
  title: "Data templates",
  description: "Data governance, quality, interoperability, and analytics helpers.",
};

const templates = registry.filter((item) => item.category === "Data");
const areas = Array.from(new Set(templates.map((t) => t.area || "Other")));

export default function DataTemplatesPage() {
  return <DataTemplatesClient templates={templates} areas={areas} />;
}
