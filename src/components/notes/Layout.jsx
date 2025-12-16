"use client";

import Layout from "@/components/Layout";
import ContentsSidebar from "./ContentsSidebar";
import ProgressBar from "./ProgressBar";
import NotesStepper from "./summary/NotesStepper";
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

  return (
    <Layout title={meta.title} description={meta.description}>
      <ProgressBar />
      <div className="flex flex-col lg:flex-row lg:gap-6">
        <div className="mb-3 lg:hidden">
          <button
            className="rounded-full border px-3 py-1 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => setMobileOpen(true)}
          >
            Contents
          </button>
        </div>

        <ContentsSidebar headings={headings} activeId={activeId} />
        <main className="w-full max-w-[1000px] flex-1">
          <header className="mb-4 rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <p className="eyebrow m-0 text-gray-600">
              {(meta.section === "ai" && "AI") ||
                (meta.section === "cybersecurity" && "Cybersecurity") ||
                (meta.section === "digitalisation" && "Digitalisation strategy") ||
                (meta.section === "architecture" && "Software architecture") ||
                "Notes"} - {meta.level || "Notes"}
            </p>
            <h1 className="text-2xl font-semibold leading-tight text-gray-900">{meta.title}</h1>
            {meta.page ? (
              <p className="text-sm text-gray-700">
                Page {meta.page} of {meta.totalPages || "?"}
              </p>
            ) : null}
            {meta.description ? <p className="mt-2 text-sm text-gray-700">{meta.description}</p> : null}
            <div className="mt-3">
              <NotesStepper
                items={
                  meta.section === "ai"
                    ? [
                        { label: "Beginner", href: "/ai/beginner", active: meta.slug?.includes("/ai/beginner") },
                        { label: "Intermediate", href: "/ai/intermediate", active: meta.slug?.includes("/ai/intermediate") },
                        { label: "Advanced", href: "/ai/advanced", active: meta.slug?.includes("/ai/advanced") },
                        { label: "Summary", href: "/ai/summary", active: meta.slug?.includes("/ai/summary") },
                      ]
                    : meta.section === "digitalisation"
                    ? [
                        { label: "Beginner", href: "/digitalisation/beginner", active: meta.slug?.includes("/digitalisation/beginner") },
                        { label: "Intermediate", href: "/digitalisation/intermediate", active: meta.slug?.includes("/digitalisation/intermediate") },
                        { label: "Advanced", href: "/digitalisation/advanced", active: meta.slug?.includes("/digitalisation/advanced") },
                        { label: "Summary", href: "/digitalisation/summary", active: meta.slug?.includes("/digitalisation/summary") },
                      ]
                    : meta.section === "architecture"
                    ? [
                        { label: "Beginner", href: "/software-architecture/beginner", active: meta.slug?.includes("/software-architecture/beginner") },
                        { label: "Intermediate", href: "/software-architecture/intermediate", active: meta.slug?.includes("/software-architecture/intermediate") },
                        { label: "Advanced", href: "/software-architecture/advanced", active: meta.slug?.includes("/software-architecture/advanced") },
                        { label: "Summary", href: "/software-architecture/summary", active: meta.slug?.includes("/software-architecture/summary") },
                      ]
                    : [
                        { label: "Beginner", href: "/cybersecurity/beginner", active: meta.slug?.includes("/beginner") },
                        { label: "Intermediate", href: "/cybersecurity/intermediate", active: meta.slug?.includes("/intermediate") },
                        { label: "Advanced", href: "/cybersecurity/advanced", active: meta.slug?.includes("/advanced") },
                        {
                          label: "Summary",
                          href: "/cybersecurity/summary",
                          active: meta.slug?.includes("/summary") || meta.slug?.includes("/cybersecurity/summary"),
                        },
                      ]
                }
              />
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
            <ContentsSidebar headings={headings} activeId={activeId} mobile />
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
