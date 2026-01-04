import React from "react";
import { CategoryGrid } from "@/components/templates/CategoryGrid";
import { TEMPLATE_CATEGORIES } from "@/data/templates/categories";
import SupportBanner from "@/components/SupportBanner";
import Link from "next/link";
import { getTemplatesRegistry } from "@/lib/catalog";
import { TemplatesHubClient } from "@/components/templates/TemplatesHubClient";

export const metadata = {
  title: "Templates",
  description: "Templates across architecture, engineering, and governance.",
};

export default function TemplatesLandingPage() {
  const all = getTemplatesRegistry();

  // Merge preview + runner entries into a single hub card where possible.
  const mergedMap = new Map();
  for (const t of all) {
    const key = `${t.category}:${t.slug}`;
    const existing = mergedMap.get(key) || {
      id: key,
      title: t.title,
      description: t.description,
      category: t.category,
      tags: [],
      badges: [],
      previewHref: undefined,
      runHref: undefined,
    };

    existing.title = existing.title || t.title;
    existing.description = existing.description || t.description;
    existing.category = existing.category || t.category;
    existing.tags = Array.from(new Set([...(existing.tags || []), ...(t.tags || [])]));

    const badges = [...(existing.badges || []), ...(t.badges || [])];
    existing.badges = badges.filter((b, idx) => badges.findIndex((x) => x.label === b.label) === idx);

    if (t.hasRunner) existing.runHref = t.runHref || t.href;
    else existing.previewHref = t.href;

    mergedMap.set(key, existing);
  }

  const templates = Array.from(mergedMap.values()).sort((a, b) => a.title.localeCompare(b.title));

  const counts = templates.reduce((acc, tpl) => {
    acc[tpl.category] = (acc[tpl.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-5 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Templates</div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">Templates platform</h1>
          <p className="max-w-3xl text-base text-slate-700">
            Structural foundation for a templates experience. Browse categories to see curated previews across architecture, engineering, and
            governance disciplines.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 text-sm text-slate-800 shadow-sm ring-1 ring-slate-100">
            <span aria-hidden="true">📄</span>
            Downloadable templates in multiple formats.
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 text-sm text-slate-800 shadow-sm ring-1 ring-slate-100">
            <span aria-hidden="true">🎛️</span>
            Clean, consistent cards with restrained accents.
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 text-sm text-slate-800 shadow-sm ring-1 ring-slate-100">
            <span aria-hidden="true">🧭</span>
            Broad taxonomy ready for deeper journeys.
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-4" aria-labelledby="template-categories">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Categories</p>
            <h2 id="template-categories" className="text-2xl font-semibold text-slate-900">
              Explore by discipline
            </h2>
            <p className="text-sm text-slate-700">Structured coverage from cybersecurity architecture to operating models.</p>
          </div>
        </div>

        <CategoryGrid categories={TEMPLATE_CATEGORIES} counts={counts} />
      </section>

      <section className="mt-10">
        <TemplatesHubClient templates={templates} />
      </section>

      <section className="mt-10" aria-label="Support this work">
        <SupportBanner />
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Policy (placeholder)</p>
        <p className="mt-1">
          Commercial users must keep author credit. Internal use may remove branding. Donation or permission required for
          commercial redistribution. Not enforced automatically yet.
        </p>
        <Link
          href="/template-licence"
          className="mt-2 inline-flex text-sm font-semibold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4"
        >
          Read the template licence placeholder
        </Link>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm" aria-label="Note">
        Interactive runners are shown inline above (when available) with a <strong>Run live</strong> button.
      </section>
    </main>
  );
}
