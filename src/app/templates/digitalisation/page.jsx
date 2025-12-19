import registry from "../../../../content/templates/registry.json";
import DigitalisationTemplatesClient from "./DigitalisationTemplatesClient";

export const metadata = {
  title: "Digitalisation templates",
  description: "Strategy, governance, delivery, and benefits tools for digital programmes.",
};

const templates = registry.filter((item) => item.category === "Digitalisation");
const areas = Array.from(new Set(templates.map((t) => t.area || "Other")));

export default function DigitalisationTemplatesPage() {
  return <DigitalisationTemplatesClient templates={templates} areas={areas} />;
}
