"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { ProgressBar } from "./ProgressBar";
import NotesPager from "./NotesPager";

const cyberChapters = [
  { href: "/cybersecurity/beginner", label: "Beginner" },
  { href: "/cybersecurity/intermediate", label: "Intermediate" },
  { href: "/cybersecurity/advanced", label: "Advanced" },
];

export function NotesLayout({ title, subtitle, pageKey, children, prev, next }) {
  const [headings, setHeadings] = useState([]);
  const [query, setQuery] = useState("");
  const [tocOpen, setTocOpen] = useState(true); // desktop collapse
  const [mobileToc, setMobileToc] = useState(false);
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("article h2, article h3")).map((el) => ({
      id: el.id,
      title: el.textContent || "",
      depth: el.tagName === "H2" ? 2 : 3,
    }));
    setHeadings(nodes);

    if (observerRef.current) observerRef.current.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0% -60% 0%" }
    );
    observerRef.current = observer;
    nodes.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [children]);

  const filtered = useMemo(() => {
    if (!query) return headings;
    return headings.filter((h) => h.title.toLowerCase().includes(query.toLowerCase()));
  }, [headings, query]);

  const h2Headings = useMemo(() => filtered.filter((h) => h.depth === 2), [filtered]);
  const h3Map = useMemo(() => {
    const map = {};
    let current = null;
    filtered.forEach((h) => {
      if (h.depth === 2) {
        current = h.id;
        map[current] = [];
      } else if (h.depth === 3 && current) {
        map[current].push(h);
      }
    });
    return map;
  }, [filtered]);

  return (
    <Layout title={title} description={subtitle}>
      <div id="top" />
      <ProgressBar />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/80 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-1">
          <p className="eyebrow m-0">Notes</p>
          <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="lead m-0">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {cyberChapters.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  pageKey && c.href.includes(pageKey.split("-")[0])
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-transparent bg-gray-100 text-gray-800 hover:border-gray-200"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
          {(prev || next) && <NotesPager prev={prev} next={next} />}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
        <button
          onClick={() => setMobileToc(true)}
          className="rounded-full border px-3 py-1 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          aria-label="Open contents"
        >
          Contents
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(180px,280px)_1fr]">
        <aside
          className={`hidden lg:sticky lg:top-24 lg:h-[calc(100vh-140px)] lg:overflow-auto lg:block`}
        >
          <div className="rounded-xl border bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-700">Contents</span>
              <button
                onClick={() => setTocOpen((v) => !v)}
                className="rounded-full border px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
                aria-label="Collapse contents"
              >
                {tocOpen ? "Hide" : "Show"}
              </button>
            </div>
            {tocOpen ? (
              <>
                <div className="mt-2">
                  <input
                    type="search"
                    placeholder="Search headings"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                <nav aria-label="Contents" className="mt-3">
                  <ul className="space-y-1 text-sm">
                    {h2Headings.map((h) => (
                      <li key={h.id}>
                        <a
                          className={`block rounded px-2 py-1 transition hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200 ${
                            activeId === h.id ? "bg-blue-50 text-blue-800" : "text-gray-800"
                          }`}
                          href={`#${h.id}`}
                        >
                          {h.title}
                        </a>
                        {h3Map[h.id]?.length ? (
                          <ul className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2">
                            {h3Map[h.id].map((c) => (
                              <li key={c.id}>
                                <a
                                  className={`block rounded px-2 py-1 text-[13px] transition hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200 ${
                                    activeId === c.id ? "bg-blue-50 text-blue-800" : "text-gray-700"
                                  }`}
                                  href={`#${c.id}`}
                                >
                                  {c.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            ) : null}
          </div>
        </aside>

        <main className="notes-shell" data-page={pageKey}>
          <article className="prose prose-neutral max-w-4xl text-[17px] leading-[1.85]">{children}</article>
        </main>
      </div>

      {mobileToc ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[320px] bg-white shadow-xl p-4 overflow-auto">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-800">Contents</span>
              <button
                onClick={() => setMobileToc(false)}
                className="rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Close
              </button>
            </div>
            <div className="mt-2">
              <input
                type="search"
                placeholder="Search headings"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <nav aria-label="Contents" className="mt-3">
              <ul className="space-y-1 text-sm">
                {h2Headings.map((h) => (
                  <li key={h.id}>
                    <a
                      className={`block rounded px-2 py-1 transition hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200 ${
                        activeId === h.id ? "bg-blue-50 text-blue-800" : "text-gray-800"
                      }`}
                      href={`#${h.id}`}
                      onClick={() => setMobileToc(false)}
                    >
                      {h.title}
                    </a>
                    {h3Map[h.id]?.length ? (
                      <ul className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2">
                        {h3Map[h.id].map((c) => (
                          <li key={c.id}>
                            <a
                              className={`block rounded px-2 py-1 text-[13px] transition hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200 ${
                                activeId === c.id ? "bg-blue-50 text-blue-800" : "text-gray-700"
                              }`}
                              href={`#${c.id}`}
                              onClick={() => setMobileToc(false)}
                            >
                              {c.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <button className="absolute inset-0 w-full h-full" onClick={() => setMobileToc(false)} aria-label="Close" />
        </div>
      ) : null}
    </Layout>
  );
}
