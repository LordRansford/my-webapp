"use client";

import { useEffect, useMemo, useState } from "react";
import { TemplateCard } from "./TemplateCard";
import { DownloadOptionsModal } from "./DownloadOptionsModal";

const FAVORITES_KEY = "rn-template-favorites";

function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      setFavorites(Array.isArray(stored) ? stored : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return { favorites, toggleFavorite };
}

export function TemplateListClient({ templates, categoryTitle }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState("title");
  const [tag, setTag] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();

  const tags = useMemo(() => {
    const set = new Set();
    templates.forEach((t) => t.tags?.forEach((tg) => set.add(tg)));
    return Array.from(set).sort();
  }, [templates]);

  const filtered = useMemo(() => {
    return templates
      .filter((t) => {
        const matchSearch =
          !search ||
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          (t.tags || []).some((tg) => tg.toLowerCase().includes(search.toLowerCase()));
        const matchDifficulty = difficulty === "all" || t.difficulty === difficulty;
        const matchTag = tag === "all" || (t.tags || []).includes(tag);
        return matchSearch && matchDifficulty && matchTag;
      })
      .sort((a, b) => {
        if (sort === "time-asc") return a.estimatedMinutes - b.estimatedMinutes;
        if (sort === "time-desc") return b.estimatedMinutes - a.estimatedMinutes;
        return a.title.localeCompare(b.title);
      });
  }, [templates, search, difficulty, sort, tag]);

  const favoritesFirst = useMemo(
    () => [...filtered].sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id))),
    [filtered, favorites]
  );

  return (
    <div className="stack" style={{ gap: "1rem" }}>
      <div
        className="card"
      >
        <div className="flex-between" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <label style={{ flex: "1 1 240px" }}>
            <span className="eyebrow">Search {categoryTitle}</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles, tags, descriptions"
              aria-label="Search templates"
            />
          </label>
          <label>
            <span className="eyebrow">Difficulty</span>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Filter by difficulty">
              <option value="all">All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label>
            <span className="eyebrow">Tag</span>
            <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Filter by tag">
              <option value="all">All</option>
              {tags.map((tg) => (
                <option key={tg} value={tg}>
                  {tg}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="eyebrow">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort templates">
              <option value="title">Title A-Z</option>
              <option value="time-asc">Shortest first</option>
              <option value="time-desc">Longest first</option>
            </select>
          </label>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          Favourites bubble to the top automatically. Nothing is stored on the server.
        </p>
      </div>

      <div className="stack" style={{ gap: "1rem" }}>
        {favoritesFirst.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isFavorite={favorites.includes(template.id)}
            onToggleFavorite={toggleFavorite}
            onDownload={(tpl) => setSelectedTemplate(tpl)}
          />
        ))}
        {!favoritesFirst.length && <p className="muted">No tools match your filters yet.</p>}
      </div>

      <DownloadOptionsModal open={Boolean(selectedTemplate)} onClose={() => setSelectedTemplate(null)} template={selectedTemplate} />
    </div>
  );
}
