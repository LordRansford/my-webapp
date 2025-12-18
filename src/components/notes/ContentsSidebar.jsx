"use client";

import { useEffect, useMemo, useState } from "react";

export default function ContentsSidebar({
  headings = [],
  activeId = "",
  mobile = false,
  initialOpen = true,
  className = "",
  onNavigate,
}) {
  const [open, setOpen] = useState(initialOpen);
  const [expanded, setExpanded] = useState({});
  const navId = mobile ? "contents-nav-mobile" : "contents-nav-desktop";

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
      aria-label="On-page contents"
      className={`${mobile ? "block" : "hidden lg:block"} sticky top-24 h-[calc(100vh-120px)] w-full max-w-[260px] max-w-64 overflow-auto ${className}`}
    >
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-700">Contents</span>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border px-3 py-1 text-[11px] text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
            aria-expanded={open}
            aria-controls={navId}
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
        {open ? (
          <nav aria-label="Contents" id={navId} className="mt-3">
            <ul className="space-y-1 text-sm">
              {sections.map((section) => {
                const isActive = activeId === section.id;
                const isExpanded = expanded[section.id] ?? false;
                return (
                  <li key={section.id}>
                    <div className={`flex items-center justify-between rounded px-2 py-1 ${isActive ? "bg-blue-50 text-blue-800" : "text-gray-800"}`}>
                      <a
                        className="flex-1 text-left hover:underline focus:outline-none focus:ring focus:ring-blue-200"
                        href={`#${section.id}`}
                        aria-current={isActive ? "location" : undefined}
                        onClick={(event) => {
                          // expand to reveal children when navigating
                          setExpanded((prev) => ({ ...prev, [section.id]: true }));
                          if (mobile && typeof onNavigate === "function") onNavigate(event);
                        }}
                      >
                        {section.title}
                      </a>
                      <button
                        type="button"
                        className="ml-2 rounded-full border px-2 text-xs text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
                        aria-label={isExpanded ? `Collapse ${section.title}` : `Expand ${section.title}`}
                        aria-expanded={isExpanded}
                        aria-controls={`${section.id}-children`}
                        onClick={() =>
                          setExpanded((prev) => ({ ...prev, [section.id]: !isExpanded }))
                        }
                      >
                        {isExpanded ? "-" : "+"}
                      </button>
                    </div>
                    {isExpanded && section.children.length ? (
                      <ul id={`${section.id}-children`} className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2">
                        {section.children.map((c) => (
                          <li key={c.id}>
                            <a
                              className={`block rounded px-2 py-1 text-[13px] ${
                                activeId === c.id ? "bg-blue-50 text-blue-800" : "text-gray-700"
                              } hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200`}
                              href={`#${c.id}`}
                              aria-current={activeId === c.id ? "location" : undefined}
                              onClick={(event) => {
                                if (mobile && typeof onNavigate === "function") onNavigate(event);
                              }}
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
