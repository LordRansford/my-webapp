"use client";

import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { ProgressBar } from "./ProgressBar";

export function NotesLayout({ title, subtitle, pageKey, children }) {
  const [headings, setHeadings] = useState([]);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query) return headings;
    return headings.filter((h) => h.title.toLowerCase().includes(query.toLowerCase()));
  }, [headings, query]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("article h2, article h3")).map((el) => ({
      id: el.id,
      title: el.textContent || "",
      depth: el.tagName === "H2" ? 2 : 3,
    }));
    setHeadings(nodes);
  }, [children]);

  return (
    <Layout title={title} description={subtitle}>
      <ProgressBar />
      <header className="page-header">
        <p className="eyebrow">Notes</p>
        <h1>{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(160px,220px)_1fr]">
        <aside className="hidden lg:block sticky top-20 h-[calc(100vh-100px)] overflow-auto pr-2">
          <div className="mb-2">
            <input
              type="search"
              placeholder="Search headings"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border px-2 py-1 text-sm"
            />
          </div>
          <nav aria-label="Contents">
            <ul className="space-y-1 text-sm">
              {filtered.map((h) => (
                <li key={h.id} className={h.depth === 3 ? "ml-3" : ""}>
                  <a className="text-gray-700 hover:text-gray-900" href={`#${h.id}`}>
                    {h.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="notes-shell" data-page={pageKey}>
          {children}
        </main>
      </div>
    </Layout>
  );
}
