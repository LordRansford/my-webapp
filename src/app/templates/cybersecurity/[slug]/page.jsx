import { notFound } from "next/navigation";
import registry from "../../../../../content/templates/registry.json";
import TemplateRenderer from "./TemplateRenderer";

export function generateStaticParams() {
  const items = registry.filter((item) => item.category === "Cybersecurity" && item.route);
  return items.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
  const entry = registry.find((item) => item.id === params.slug);
  return {
    title: entry ? entry.title : "Cybersecurity template",
    description: entry ? entry.description : "Cybersecurity template",
  };
}

export default function CyberTemplatePage({ params }) {
  const entry = registry.find((item) => item.id === params.slug && item.category === "Cybersecurity");
  if (!entry) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800">
        <p className="text-lg font-semibold">Template not found in registry.</p>
        <p className="mt-2 text-sm">Return to the cybersecurity library to pick an available tool.</p>
      </main>
    );
  }
  return <TemplateRenderer slug={params.slug} />;
}
