"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import ContentsSidebar from "./ContentsSidebar";
import ProgressBar from "./ProgressBar";
import NotesStepper from "./summary/NotesStepper";
import DonateButton from "@/components/donations/DonateButton";
import BetaBanner from "./BetaBanner";
import PreviewBanner from "./PreviewBanner";
import cybersecurityCourse from "../../../content/courses/cybersecurity.json";
import { useEffect, useMemo, useState } from "react";
import FeedbackPanel from "@/components/feedback/FeedbackPanel";
import { highlightAnchorFromLocation } from "@/lib/mentor/highlight";
import dynamic from "next/dynamic";
import ReadAloudControls from "@/components/a11y/ReadAloudControls";

const AssistantShell = dynamic(() => import("@/components/assistants/AssistantShell"), { ssr: false });

/** @param {{ meta?: any, headings?: any[], children: any, activeLevelId?: any, showContentsSidebar?: boolean, showStepper?: boolean }} props */
export default function NotesLayout(props) {
  const { meta = {}, headings = [], children, activeLevelId, showContentsSidebar, showStepper } = props;
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

  useEffect(() => {
    // Briefly highlight headings when navigating to an anchor link.
    highlightAnchorFromLocation();
    const onHash = () => highlightAnchorFromLocation();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const resolvedSection =
    meta.section ||
    (meta.slug?.includes("/ai") && "ai") ||
    (meta.slug?.includes("/digitalisation") && "digitalisation") ||
    (meta.slug?.includes("/software-architecture") && "architecture") ||
    (meta.slug?.includes("/data") && "data") ||
    (meta.slug?.includes("/cybersecurity") && "cybersecurity") ||
    "";

  const sectionLabelMap = {
    ai: "AI",
    data: "Data",
    cybersecurity: "Cybersecurity",
    digitalisation: "Digitalisation strategy",
    architecture: "Software architecture",
  };

  const cybersecurityStepperItems = [];

  if (cybersecurityCourse?.overview_route) {
    cybersecurityStepperItems.push({
      id: "overview",
      label: "Overview",
      href: cybersecurityCourse.overview_route,
      active: meta.slug === cybersecurityCourse.overview_route,
    });
  }

  (cybersecurityCourse?.levels || []).forEach((level) => {
    cybersecurityStepperItems.push({
      id: level.id,
      label: level.label || level.title,
      href: level.route,
      active: meta.slug?.startsWith(level.route) || meta.slug?.includes(level.route),
    });
  });

  if (cybersecurityCourse?.summary_route) {
    cybersecurityStepperItems.push({
      id: "summary",
      label: "Summary and games",
      href: cybersecurityCourse.summary_route,
      active: meta.slug?.startsWith(cybersecurityCourse.summary_route) || meta.slug?.includes("/summary"),
    });
  }

  const stepperItems =
    resolvedSection === "ai"
      ? [
          { label: "Foundations", href: "/ai/beginner", active: meta.slug?.includes("/ai/beginner") },
          { label: "Intermediate", href: "/ai/intermediate", active: meta.slug?.includes("/ai/intermediate") },
          { label: "Advanced", href: "/ai/advanced", active: meta.slug?.includes("/ai/advanced") },
          { label: "Summary and games", href: "/ai/summary", active: meta.slug?.includes("/ai/summary") },
        ]
      : resolvedSection === "data"
      ? [
          { label: "Foundations", href: "/data/foundations", active: meta.slug?.includes("/data/foundations") },
          { label: "Intermediate", href: "/data/intermediate", active: meta.slug?.includes("/data/intermediate") },
          { label: "Advanced", href: "/data/advanced", active: meta.slug?.includes("/data/advanced") },
          { label: "Summary and games", href: "/data/summary", active: meta.slug?.includes("/data/summary") },
        ]
      : resolvedSection === "digitalisation"
      ? [
          { label: "Beginner", href: "/digitalisation/beginner", active: meta.slug?.includes("/digitalisation/beginner") },
          { label: "Intermediate", href: "/digitalisation/intermediate", active: meta.slug?.includes("/digitalisation/intermediate") },
          { label: "Advanced", href: "/digitalisation/advanced", active: meta.slug?.includes("/digitalisation/advanced") },
          { label: "Summary and games", href: "/digitalisation/summary", active: meta.slug?.includes("/digitalisation/summary") },
        ]
      : resolvedSection === "architecture"
      ? [
          { label: "Foundations", href: "/software-architecture/beginner", active: meta.slug?.includes("/software-architecture/beginner") },
          { label: "Intermediate", href: "/software-architecture/intermediate", active: meta.slug?.includes("/software-architecture/intermediate") },
          { label: "Advanced", href: "/software-architecture/advanced", active: meta.slug?.includes("/software-architecture/advanced") },
          { label: "Summary and games", href: "/software-architecture/summary", active: meta.slug?.includes("/software-architecture/summary") },
        ]
      : cybersecurityStepperItems;

  const showDonate = useMemo(() => {
    const level = (meta.level || "").toLowerCase();
    return level.includes("summary") || (meta.slug || "").includes("summary");
  }, [meta.level, meta.slug]);

  const slug = meta.slug || "";
  const showPreviewBanner = !slug.startsWith("/admin");
  const showFeedbackPanel = !slug.startsWith("/admin") && slug !== "/feedback" && slug !== "/signin";
  const showReadAloud =
    Boolean(slug) &&
    (slug === "/" ||
      slug.endsWith("/summary") ||
      slug.includes("/beginner") ||
      slug.includes("/foundations") ||
      slug.endsWith("/course") ||
      slug.endsWith("/index"));

  const isNotesStyleRoute =
    slug.startsWith("/ai") ||
    slug.startsWith("/data") ||
    slug.startsWith("/cybersecurity") ||
    slug.startsWith("/software-architecture") ||
    slug.startsWith("/digitalisation");

  const isCourseLearningPage =
    isNotesStyleRoute &&
    (slug.includes("/beginner") ||
      slug.includes("/foundations") ||
      slug.includes("/intermediate") ||
      slug.includes("/advanced") ||
      slug.endsWith("/summary"));

  const resolvedShowContentsSidebar =
    typeof showContentsSidebar === "boolean"
      ? showContentsSidebar
      : isNotesStyleRoute && Array.isArray(headings) && headings.length > 0;

  const resolvedShowStepper = typeof showStepper === "boolean" ? showStepper : isCourseLearningPage;

  return (
    <Layout title={meta.title} description={meta.description}>
      {showPreviewBanner ? <PreviewBanner /> : null}
      <ProgressBar />
      <div className="flex flex-col lg:flex-row lg:gap-6">
        {resolvedShowContentsSidebar ? (
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <button
              className="rounded-full border px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="contents-nav-mobile"
            >
              Contents
            </button>
          </div>
        ) : null}

        {resolvedShowContentsSidebar ? (
          <ContentsSidebar
            headings={headings}
            activeId={activeId}
            mobileOpen={mobileOpen}
            onNavigate={() => setMobileOpen(false)}
            onClose={() => setMobileOpen(false)}
          />
        ) : null}
        <main className="w-full max-w-[1000px] flex-1">
          <BetaBanner />
          <AssistantShell />
          <header className="mb-4 rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <p className="eyebrow m-0 text-gray-700">
              {sectionLabelMap[resolvedSection] || "Notes"} · {meta.level || "Notes"}
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-gray-900">{meta.title}</h1>
            {meta.page ? (
              <p className="text-sm text-gray-800">
                Page {meta.page} of {meta.totalPages || "?"}
              </p>
            ) : null}
            {meta.description ? <p className="mt-2 text-base text-gray-800">{meta.description}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/mentor"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
              >
                Ask the mentor
              </Link>
              {showReadAloud ? <ReadAloudControls selector="main article" label="Listen" /> : null}
            </div>
            <div className="mt-4">
              {resolvedShowStepper ? (
                <NotesStepper
                  items={stepperItems}
                  activeLevelId={resolvedSection === "cybersecurity" ? activeLevelId : undefined}
                />
              ) : null}
            </div>
          </header>
          <article className="prose prose-neutral max-w-none rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
            {children}
          </article>
          {showDonate ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">Support</p>
                <p className="text-sm text-slate-800">
                  If these notes or games help you, a small donation keeps the site independent and well tested.
                </p>
              </div>
              <DonateButton />
            </div>
          ) : null}
          {showFeedbackPanel ? <FeedbackPanel /> : null}
        </main>
      </div>
    </Layout>
  );
}
