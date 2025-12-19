import Link from "next/link";
import React from "react";
import { TEMPLATE_CATEGORIES } from "@/data/templates/categories";
import { templateDefinitions } from "../../../../content/templates/definitions";

export default async function TemplateCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await Promise.resolve(params);
  const categoryId = resolvedParams.category;

  const category = TEMPLATE_CATEGORIES.find((entry) => entry.id === categoryId);
  const templates = templateDefinitions.filter((tpl) => tpl.category === categoryId);

  return (
    <div className="page-content mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <Link href="/templates" className="font-semibold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4">
          Templates
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-600">{category?.title || "Category"}</span>
      </div>

      <div className="space-y-3 rounded-3xl bg-white px-6 py-7 ring-1 ring-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Templates</div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Preview only</div>
        <h1 className="text-3xl font-semibold text-slate-900">{category?.title || "Templates category"}</h1>
        <p className="max-w-3xl text-base text-slate-700 leading-relaxed">
          {category?.description ||
            "Browse available templates by category. These are preview-only placeholders that outline the structure of the platform."}
        </p>
      </div>

      <section aria-labelledby="templates-list">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Templates</p>
            <h2 id="templates-list" className="text-xl font-semibold text-slate-900">
              Available previews
            </h2>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">{templates.length} items</span>
        </div>

        {templates.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {templates.map((template) => (
              <article key={template.slug} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Preview + runner</div>
                <h3 className="text-base font-semibold text-slate-900">{template.title}</h3>
                <p className="text-sm text-slate-700 flex-1">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>Estimated {template.estimatedMinutes} mins</span>
                  <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-800">Preview only</span>
                </div>
                <Link
                  href={`/templates/run/${template.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  Open runner
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No templates available for this category yet. Choose another category from{" "}
            <Link href="/templates" className="font-semibold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4">
              the catalogue
            </Link>
            .
          </div>
        )}
      </section>
    </div>
  );
}
