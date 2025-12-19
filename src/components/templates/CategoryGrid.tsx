import Link from "next/link";
import React from "react";
import type { TemplateCategory } from "@/data/templates/categories";

type CategoryGridProps = {
  categories: TemplateCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/templates/${category.id}`}
          className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              <span>{category.icon}</span>
              <span>Category</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700">Explore</span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-900">{category.title}</h3>
          <p className="text-sm text-slate-600">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}
