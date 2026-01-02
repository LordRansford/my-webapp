"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TemplateGrid from "@/components/templates/TemplateGrid";
import TemplateFilters from "@/components/templates/TemplateFilters";
import { TemplateSelector } from "@/components/templates/TemplateSelector";
import { getFavourites, toggleFavourite } from "@/lib/templates/favourites";

export default function AiTemplatesClient({ templates, areas }) {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("usefulness");
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    setFavourites(getFavourites());
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    let list = [...templates].filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.tags || []).some((tag) => tag.toLowerCase().includes(query));
      const matchesArea = area === "all" || item.area === area;
      const matchesDifficulty = difficulty === "all" || item.difficulty === difficulty;
      const matchesFav = showFavouritesOnly ? favourites.includes(item.id) : true;
      return matchesSearch && matchesArea && matchesDifficulty && matchesFav;
    });

    if (sortBy === "time") {
      list = list.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    } else if (sortBy === "newest") {
      list = list.sort((a, b) => (a.id > b.id ? -1 : 1));
    } else {
      list = list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [area, difficulty, favourites, search, showFavouritesOnly, sortBy, templates]);

  const handleToggleFavourite = (id) => {
    const next = toggleFavourite(id);
    setFavourites(next);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Templates - AI</p>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">AI useful tools</h1>
        <p className="max-w-3xl text-base text-slate-700">
          Practical AI planning, governance, and delivery tools. Everything runs in the browser with exports ready when you need
          them.
        </p>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-800">
          Built for data and ML teams: clear instructions, editable workspace, outputs, and attribution notice. Autosave keeps
          drafts safe between visits. Educational and planning aids, not legal advice; use only on data you are permitted to work
          on.
        </div>
      </section>

      <section className="mt-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">AI tools</h2>
          <Link
            href="/support"
            className="text-xs font-semibold uppercase tracking-wide text-slate-600 underline underline-offset-2"
          >
            Need permission or donation info?
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("selector")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "selector"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Interactive Selector
            </button>
          </div>
        </div>

        {viewMode === "selector" ? (
          <TemplateSelector
            templates={filtered}
            showPreview={true}
            showUpload={true}
            mode="grid"
          />
        ) : (
          <>
            <TemplateFilters
              search={search}
              setSearch={setSearch}
              area={area}
              setArea={setArea}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showFavouritesOnly={showFavouritesOnly}
              setShowFavouritesOnly={setShowFavouritesOnly}
              areas={areas}
            />

            <TemplateGrid templates={filtered} favourites={favourites} onToggleFavourite={handleToggleFavourite} />
          </>
        )}
      </section>
    </main>
  );
}
