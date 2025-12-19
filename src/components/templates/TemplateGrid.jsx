import { TemplateCard } from "./TemplateCard";

export default function TemplateGrid({ templates, favourites = [], onToggleFavourite }) {
  if (!templates || templates.length === 0) {
    return <p className="text-sm text-slate-700">Templates coming soon for this category.</p>;
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isFavourite={favourites.includes(template.id)}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}
