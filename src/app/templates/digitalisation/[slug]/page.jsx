import { notFound } from "next/navigation";
import registry from "../../../../../content/templates/registry.json";
import TemplateRenderer from "./TemplateRenderer";

export function generateStaticParams() {
  const items = registry.filter((item) => item.category === "Digitalisation" && item.route);
  return items.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
  const entry = registry.find((item) => item.id === params.slug);
  return {
    title: entry ? entry.title : "Digitalisation template",
    description: entry ? entry.description : "Digitalisation template",
  };
}

export default function DigitalisationTemplatePage({ params }) {
  const entry = registry.find((item) => item.id === params.slug && item.category === "Digitalisation");
  if (!entry) return notFound();
  return <TemplateRenderer slug={params.slug} />;
}
