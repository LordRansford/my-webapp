"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { TEMPLATE_CATEGORIES } from "@/data/templates/categories";

type Tone = "slate" | "emerald" | "indigo" | "amber";

type Badge = { label: string; tone?: Tone };

export type TemplatesHubItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  badges?: Badge[];
  previewHref?: string;
  runHref?: string;
};

function BadgePill({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : tone === "indigo"
      ? "bg-indigo-50 text-indigo-800 ring-indigo-100"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 ring-amber-100"
      : "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass}`}>{children}</span>;
}

function categoryLabel(category: string) {
  const match = (TEMPLATE_CATEGORIES || []).find((c) => c?.id === category);
  if (match?.title) return match.title;
  return String(category || "Templates")
    .split("-")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

export function TemplatesHubClient({ templates }: { templates: TemplatesHubItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => set.add(t.category));
    return Array.from(set).sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)));
  }, [templates]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {};
    templates.forEach((t) => {
      base[t.category] = (base[t.category] || 0) + 1;
    });
    return base;
  }, [templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates
      .filter((t) => {
        if (category !== "all" && t.category !== category) return false;
        if (!q) return true;
        const hay = `${t.title} ${t.description} ${(t.tags || []).join(" ")} ${t.category}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [templates, query, category]);

  return (
    <section className="space-y-4" aria-label="Templates hub">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">All templates</p>
          <h2 className="text-2xl font-semibold text-slate-900">Browse, preview, or run live</h2>
          <p className="text-sm text-slate-700">Search across categories. Open previews or use interactive runners where available.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-72"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter templates by category"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-64"
          >
            <option value="all">All categories ({templates.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)} ({counts[c] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div key={t.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <BadgePill>{categoryLabel(t.category)}</BadgePill>
              {(t.badges || []).slice(0, 2).map((b) => (
                <BadgePill key={b.label} tone={b.tone || "slate"}>
                  {b.label}
                </BadgePill>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-slate-900">{t.title}</h3>
            <p className="text-sm text-slate-700 flex-1">{t.description}</p>

            <div className="flex flex-col gap-2">
              {t.previewHref ? (
                <Link
                  href={t.previewHref}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  Preview
                </Link>
              ) : null}
              {t.runHref ? (
                <Link
                  href={t.runHref}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  Run live
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700" role="status" aria-live="polite">
          No templates match your search/filter.
        </div>
      ) : null}
    </section>
  );
}

