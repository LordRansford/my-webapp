"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { motionTransition } from "@/lib/motion";

export default function ContentsSidebar({
  headings = [],
  activeId = "",
  mobileOpen = false,
  initialOpen = true,
  className = "",
  onNavigate,
  onClose,
}) {
  const [open, setOpen] = useState(initialOpen);
  const [expanded, setExpanded] = useState({});
  const navId = mobileOpen ? "contents-nav-mobile" : "contents-nav-desktop";
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

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

  // Reset expanded state when headings change (keep everything collapsed until explicitly expanded)
  useEffect(() => {
    if (!sections.length) return;
    setExpanded({});
  }, [sections]);

  return (
    <>
      <LazyMotion features={domAnimation}>
        <AnimatePresence initial={false}>
          {mobileOpen ? (
            <m.button
              type="button"
              aria-label="Close contents"
              className="fixed inset-0 z-30 bg-black/35 backdrop-blur-sm lg:hidden"
              onClick={onClose}
              initial={reduce ? false : { opacity: 0 }}
              animate={reduce ? false : { opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={reduce ? { duration: 0 } : motionTransition}
            />
          ) : null}
        </AnimatePresence>

        <m.aside
          aria-label="On-page contents"
          className={`fixed inset-y-0 left-0 z-40 w-[82%] max-w-[320px] overflow-y-auto bg-white p-4 shadow-xl lg:inset-auto lg:block lg:w-full lg:max-w-[280px] lg:p-0 lg:shadow-none lg:sticky lg:top-24 lg:h-[calc(100vh-140px)] ${className}`}
          initial={false}
          animate={
            reduce
              ? undefined
              : isDesktop
              ? { x: 0, opacity: 1 }
              : mobileOpen
              ? { x: 0, opacity: 1 }
              : { x: "-100%", opacity: 1 }
          }
          transition={reduce ? { duration: 0 } : motionTransition}
          style={reduce ? undefined : { willChange: "transform" }}
        >
          <div className="sticky top-4 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur lg:top-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-800">Contents</span>
              <button
                onClick={() => setOpen((v) => !v)}
                className="rounded-full border px-3 py-1 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
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
                        <div
                          className={`flex items-center justify-between rounded px-2 py-1 ${
                            isActive ? "bg-blue-50 text-blue-800" : "text-gray-900"
                          }`}
                        >
                          <a
                            className="flex-1 text-left hover:underline focus:outline-none focus:ring focus:ring-blue-200"
                            href={`#${section.id}`}
                            aria-current={isActive ? "location" : undefined}
                            onClick={(event) => {
                              setExpanded((prev) => ({ ...prev, [section.id]: true }));
                              if (typeof onNavigate === "function") onNavigate(event);
                              if (typeof onClose === "function" && mobileOpen) onClose(event);
                            }}
                          >
                            {section.title}
                          </a>
                          <button
                            type="button"
                            className="ml-2 rounded-full border px-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
                            aria-label={isExpanded ? `Collapse ${section.title}` : `Expand ${section.title}`}
                            aria-expanded={isExpanded}
                            aria-controls={`${section.id}-children`}
                            onClick={() => setExpanded((prev) => ({ ...prev, [section.id]: !isExpanded }))}
                          >
                            {isExpanded ? "–" : "+"}
                          </button>
                        </div>
                        {isExpanded && section.children.length ? (
                          <ul
                            id={`${section.id}-children`}
                            className="ml-2 mt-1 space-y-1 border-l border-gray-200 pl-2"
                          >
                            {section.children.map((c) => (
                              <li key={c.id}>
                                <a
                                  className={`block rounded px-2 py-1 text-sm ${
                                    activeId === c.id ? "bg-blue-50 text-blue-800" : "text-gray-800"
                                  } hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200`}
                                  href={`#${c.id}`}
                                  aria-current={activeId === c.id ? "location" : undefined}
                                  onClick={(event) => {
                                    if (typeof onNavigate === "function") onNavigate(event);
                                    if (typeof onClose === "function" && mobileOpen) onClose(event);
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
        </m.aside>
      </LazyMotion>
    </>
  );
}
