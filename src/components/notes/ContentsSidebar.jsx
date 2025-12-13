"use client";

import { useState } from "react";

export default function ContentsSidebar({ headings = [], activeId = "", mobile = false }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const topLevel = headings.filter((h) => h.depth === 2);
  const children = headings.filter((h) => h.depth === 3);

  return (
    <aside
      className={`${mobile ? "block" : "hidden lg:block"} sticky top-24 h-[calc(100vh-120px)] w-full max-w-[260px] overflow-auto`}
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
              {topLevel.map((h) => (
                <li key={h.id}>
                  <button
                    className={`flex w-full items-center justify-between rounded px-2 py-1 text-left ${
                      activeId === h.id ? "bg-blue-50 text-blue-800" : "text-gray-800"
                    } hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200`}
                    onClick={() => setExpanded((prev) => ({ ...prev, [h.id]: !prev[h.id] }))}
                  >
                    <span>{h.title}</span>
                    <span className="text-xs text-gray-500">{expanded[h.id] ? "−" : "+"}</span>
                  </button>
                  {expanded[h.id] ? (
                    <ul className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2">
                      {children
                        .filter((c) => c.parentId === h.id || c.id.startsWith(h.id))
                        .map((c) => (
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
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </aside>
  );
}
