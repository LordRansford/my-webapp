import registry from "../../../../content/templates/registry.json";
import CyberTemplatesClient from "./CyberTemplatesClient";

export const metadata = {
  title: "Cybersecurity templates",
  description: "Flagship cybersecurity planning tools for risk, threat modelling, and incident response.",
};

const templates = registry.filter((item) => item.category === "Cybersecurity");
const areas = Array.from(new Set(templates.map((t) => t.area || "Other")));

export default function CybersecurityTemplatesPage() {
  return <CyberTemplatesClient templates={templates} areas={areas} />;
}
