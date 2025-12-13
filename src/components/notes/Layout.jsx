"use client";

import Layout from "@/components/Layout";
import ContentsSidebar from "./ContentsSidebar";
import ProgressBar from "./ProgressBar";
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
          <header className="mb-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <p className="eyebrow m-0 text-gray-600">Cybersecurity · {meta.level || "Notes"}</p>
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{meta.title}</h1>
            {meta.page ? (
              <p className="text-sm text-gray-700">
                Page {meta.page} of {meta.totalPages || "?"}
              </p>
            ) : null}
            {meta.description ? <p className="mt-2 text-sm text-gray-700">{meta.description}</p> : null}
          </header>
          <article className="prose prose-neutral max-w-none rounded-2xl bg-white/80 p-4 shadow-sm">{children}</article>
        </main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[320px] bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
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
