"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { getToolsRegistry } from "@/lib/catalog";

type Tone = "slate" | "emerald" | "indigo" | "amber";

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) {
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

function categoryFromToolHref(href: string) {
  const parts = String(href || "")
    .split("/")
    .filter(Boolean);
  if (parts[0] !== "tools") return "general";
  return parts.length >= 3 ? parts[1] : "general";
}

function categoryLabel(category: string) {
  if (category === "software-architecture") return "Software Architecture";
  if (category === "cyber") return "Cybersecurity";
  if (category === "digitalisation") return "Digitalisation";
  if (category === "ai") return "AI";
  if (category === "data") return "Data";
  return "General";
}

function toneForCategory(category: string): Tone {
  if (category === "cyber") return "amber";
  if (category === "ai") return "indigo";
  if (category === "data") return "emerald";
  return "slate";
}

export default function ToolsHubClient() {
  const all = useMemo(() => getToolsRegistry(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    all.forEach((t) => set.add(categoryFromToolHref(t.href)));
    return Array.from(set).sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)));
  }, [all]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {};
    all.forEach((t) => {
      const cat = categoryFromToolHref(t.href);
      base[cat] = (base[cat] || 0) + 1;
    });
    return base;
  }, [all]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((t) => {
        const cat = categoryFromToolHref(t.href);
        if (category !== "all" && cat !== category) return false;
        if (!q) return true;
        const hay = `${t.title} ${t.description} ${(t.tags || []).join(" ")} ${t.route}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [all, query, category]);

  return (
    <section className="section" aria-label="Tools hub">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Useful tools</p>
          <h1>Tool workspaces</h1>
          <p className="lead">Search and open tools in dedicated workspace pages.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-72"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter tools by category"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-64"
          >
            <option value="all">All categories ({all.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)} ({counts[c] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => {
          const cat = categoryFromToolHref(t.href);
          return (
            <Link
              key={t.id}
              href={t.href}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              aria-label={`Open tool workspace: ${t.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-base font-semibold text-slate-900 truncate">{t.title}</p>
                  <p className="mt-1 text-sm text-slate-700 line-clamp-2">{t.description}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900" aria-hidden="true">
                  Open →
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={toneForCategory(cat)}>{categoryLabel(cat)}</Badge>
                {(t.badges || []).slice(0, 3).map((b) => (
                  <Badge key={b.label} tone={(b.tone as Tone) || "slate"}>
                    {b.label}
                  </Badge>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700" role="status" aria-live="polite">
          No tools match your search/filter.
        </div>
      ) : null}
    </section>
  );
}

