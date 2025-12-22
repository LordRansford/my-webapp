"use client";

import TemplateCard from "./TemplateCard";

export default function TemplateGrid({ templates, onUse, onPreview }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} onUse={onUse} onPreview={onPreview} />
      ))}
    </div>
  );
}


