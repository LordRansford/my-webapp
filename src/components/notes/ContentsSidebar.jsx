"use client";

import { useEffect, useMemo, useState } from "react";

export default function ContentsSidebar({
  headings = [],
  activeId = "",
  mobile = false,
  initialOpen = true,
  className = "",
}) {
  const [open, setOpen] = useState(initialOpen);
  const [expanded, setExpanded] = useState({});

  // Build a simple section tree: h2 with following h3 children
  const sections = useMemo(() => {
    const result = [];
    headings.forEach((h) => {
      if (h.depth === 2) {
        result.push({ ...h, children: [] });
      } else if (h.depth === 3 && result.length) {
        result[result.length - 1].children.push(h);
      }
    });
    return result;
  }, [headings]);

  // Automatically expand the active section (and its parent) when the activeId changes
  useEffect(() => {
    if (!sections.length) return;
    const initial = {};
    sections.forEach((sec) => {
      initial[sec.id] = activeId === sec.id || sec.children.some((c) => c.id === activeId);
    });
    setExpanded((prev) => ({ ...initial, ...prev }));
  }, [sections, activeId]);

  return (
    <aside
      className={`${mobile ? "block" : "hidden lg:block"} sticky top-24 h-[calc(100vh-120px)] w-full max-w-[260px] max-w-64 overflow-auto ${className}`}
    >
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-700">Contents</span>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border px-3 py-1 text-[11px] text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
        {open ? (
          <nav aria-label="Contents" className="mt-3">
            <ul className="space-y-1 text-sm">
              {sections.map((section) => {
                const isActive = activeId === section.id;
                const isExpanded = expanded[section.id] ?? false;
                return (
                  <li key={section.id}>
                    <div
                      className={`flex items-center justify-between rounded px-2 py-1 ${
                        isActive ? "bg-blue-50 text-blue-800" : "text-gray-800"
                      }`}
                    >
                      <button
                        type="button"
                        className="flex-1 text-left hover:underline focus:outline-none focus:ring focus:ring-blue-200"
                        onClick={() => {
                          // expand to reveal children when navigating
                          setExpanded((prev) => ({ ...prev, [section.id]: true }));
                          if (section.id) {
                            const el = document.getElementById(section.id);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }}
                      >
                        {section.title}
                      </button>
                      <button
                        type="button"
                        className="ml-2 rounded-full border px-2 text-xs text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
                        aria-label={isExpanded ? "Collapse section" : "Expand section"}
                        onClick={() =>
                          setExpanded((prev) => ({ ...prev, [section.id]: !isExpanded }))
                        }
                      >
                        {isExpanded ? "-" : "+"}
                      </button>
                    </div>
                    {isExpanded && section.children.length ? (
                      <ul className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2">
                        {section.children.map((c) => (
                          <li key={c.id}>
                            <a
                              className={`block rounded px-2 py-1 text-[13px] ${
                                activeId === c.id ? "bg-blue-50 text-blue-800" : "text-gray-700"
                              } hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200`}
                              href={`#${c.id}`}
                            >
                              {c.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </aside>
  );
}
