"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { DASHBOARD_CATEGORIES, getDashboardsRegistry } from "@/lib/catalog";

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

function toneForCategory(category: string): Tone {
  if (category === "cybersecurity") return "amber";
  if (category === "ai") return "indigo";
  if (category === "digitalisation") return "emerald";
  return "slate";
}

export default function DashboardsHubClient() {
  const all = useMemo(() => getDashboardsRegistry(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | (typeof DASHBOARD_CATEGORIES)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((item) => {
        if (category !== "all" && item.category !== category) return false;
        if (!q) return true;
        const hay = `${item.title} ${item.description} ${(item.tags || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [all, query, category]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {};
    all.forEach((i) => {
      base[i.category] = (base[i.category] || 0) + 1;
    });
    return base;
  }, [all]);

  return (
    <section className="section" aria-label="Dashboards hub">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="eyebrow m-0 text-gray-600">Further practice</p>
            <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900">Dashboards</h1>
            <p className="max-w-2xl text-sm text-slate-700">
              Interactive sandboxes you can use for practice and exploration. Many are also embedded inside the relevant courses.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dashboards..."
              aria-label="Search dashboards"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-72"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              aria-label="Filter dashboards by category"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:w-60"
            >
              <option value="all">All categories ({all.length})</option>
              {DASHBOARD_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({counts[c.id] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((d) => (
          <Link
            key={d.id}
            href={d.href}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            aria-label={`Open dashboard: ${d.title}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="m-0 text-base font-semibold text-slate-900 truncate">{d.title}</p>
                <p className="mt-1 text-sm text-slate-700 line-clamp-2">{d.description}</p>
              </div>
              <span className="text-sm font-semibold text-slate-900" aria-hidden="true">
                Open →
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={toneForCategory(d.category)}>{d.category}</Badge>
              {(d.badges || []).slice(0, 2).map((b) => (
                <Badge key={b.label} tone={(b.tone as Tone) || "slate"}>
                  {b.label}
                </Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700" role="status" aria-live="polite">
          No dashboards match your search/filter.
        </div>
      ) : null}
    </section>
  );
}

