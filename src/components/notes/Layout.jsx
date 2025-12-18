"use client";

import Layout from "@/components/Layout";
import ContentsSidebar from "./ContentsSidebar";
import ProgressBar from "./ProgressBar";
import NotesStepper from "./summary/NotesStepper";
import cybersecurityCourse from "../../../content/courses/cybersecurity.json";
import { useEffect, useState } from "react";

export default function NotesLayout({ meta = {}, headings = [], children }) {
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-35% 0% -55% 0%" }
    );
    document.querySelectorAll("article h2, article h3").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const resolvedSection =
    meta.section ||
    (meta.slug?.includes("/ai") && "ai") ||
    (meta.slug?.includes("/digitalisation") && "digitalisation") ||
    (meta.slug?.includes("/software-architecture") && "architecture") ||
    (meta.slug?.includes("/cybersecurity") && "cybersecurity") ||
    "";

  const sectionLabelMap = {
    ai: "AI",
    cybersecurity: "Cybersecurity",
    digitalisation: "Digitalisation strategy",
    architecture: "Software architecture",
  };

  const cybersecurityStepperItems = [];

  if (cybersecurityCourse?.overview_route) {
    cybersecurityStepperItems.push({
      label: "Overview",
      href: cybersecurityCourse.overview_route,
      active: meta.slug?.startsWith(cybersecurityCourse.overview_route),
    });
  }

  (cybersecurityCourse?.levels || []).forEach((level) => {
    cybersecurityStepperItems.push({
      label: level.label || level.title,
      href: level.route,
      active: meta.slug?.startsWith(level.route) || meta.slug?.includes(level.route),
    });
  });

  if (cybersecurityCourse?.summary_route) {
    cybersecurityStepperItems.push({
      label: "Summary & Games",
      href: cybersecurityCourse.summary_route,
      active: meta.slug?.startsWith(cybersecurityCourse.summary_route) || meta.slug?.includes("/summary"),
    });
  }

  const stepperItems =
    resolvedSection === "ai"
      ? [
          { label: "Beginner", href: "/ai/beginner", active: meta.slug?.includes("/ai/beginner") },
          { label: "Intermediate", href: "/ai/intermediate", active: meta.slug?.includes("/ai/intermediate") },
          { label: "Advanced", href: "/ai/advanced", active: meta.slug?.includes("/ai/advanced") },
          { label: "Summary", href: "/ai/summary", active: meta.slug?.includes("/ai/summary") },
        ]
      : resolvedSection === "digitalisation"
      ? [
          { label: "Beginner", href: "/digitalisation/beginner", active: meta.slug?.includes("/digitalisation/beginner") },
          { label: "Intermediate", href: "/digitalisation/intermediate", active: meta.slug?.includes("/digitalisation/intermediate") },
          { label: "Advanced", href: "/digitalisation/advanced", active: meta.slug?.includes("/digitalisation/advanced") },
          { label: "Summary", href: "/digitalisation/summary", active: meta.slug?.includes("/digitalisation/summary") },
        ]
      : resolvedSection === "architecture"
      ? [
          { label: "Beginner", href: "/software-architecture/beginner", active: meta.slug?.includes("/software-architecture/beginner") },
          { label: "Intermediate", href: "/software-architecture/intermediate", active: meta.slug?.includes("/software-architecture/intermediate") },
          { label: "Advanced", href: "/software-architecture/advanced", active: meta.slug?.includes("/software-architecture/advanced") },
          { label: "Summary", href: "/software-architecture/summary", active: meta.slug?.includes("/software-architecture/summary") },
        ]
      : cybersecurityStepperItems;

  return (
    <Layout title={meta.title} description={meta.description}>
      <ProgressBar />
      <div className="flex flex-col lg:flex-row lg:gap-6">
        <div className="mb-3 lg:hidden">
          <button
            className="rounded-full border px-3 py-1 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="contents-nav-mobile"
          >
            Contents
          </button>
        </div>

        <ContentsSidebar headings={headings} activeId={activeId} />
        <main className="w-full max-w-[1000px] flex-1">
          <header className="mb-4 rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <p className="eyebrow m-0 text-gray-600">
              {sectionLabelMap[resolvedSection] || "Notes"} - {meta.level || "Notes"}
            </p>
            <h1 className="text-2xl font-semibold leading-tight text-gray-900">{meta.title}</h1>
            {meta.page ? (
              <p className="text-sm text-gray-700">
                Page {meta.page} of {meta.totalPages || "?"}
              </p>
            ) : null}
            {meta.description ? <p className="mt-2 text-sm text-gray-700">{meta.description}</p> : null}
            <div className="mt-3">
              <NotesStepper items={stepperItems} />
            </div>
          </header>
          <article className="prose prose-neutral max-w-none rounded-3xl border border-gray-200 bg-white/85 p-5 shadow-sm backdrop-blur">
            {children}
          </article>
        </main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[320px] bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-800">Contents</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Close
              </button>
            </div>
            <ContentsSidebar
              headings={headings}
              activeId={activeId}
              mobile
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
