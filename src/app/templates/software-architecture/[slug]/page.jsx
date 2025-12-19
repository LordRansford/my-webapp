import { notFound } from "next/navigation";
import registry from "../../../../../content/templates/registry.json";
import TemplateRenderer from "./TemplateRenderer";

export function generateStaticParams() {
  const items = registry.filter((item) => item.category === "Software Architecture" && item.route);
  return items.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
  const entry = registry.find((item) => item.id === params.slug);
  return {
    title: entry ? entry.title : "Software architecture template",
    description: entry ? entry.description : "Software architecture template",
  };
}

export default function ArchitectureTemplatePage({ params }) {
  const entry = registry.find((item) => item.id === params.slug && item.category === "Software Architecture");
  if (!entry) return notFound();
  return <TemplateRenderer slug={params.slug} />;
}
