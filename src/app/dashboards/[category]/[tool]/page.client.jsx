"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NotesLayout from "@/components/NotesLayout";
import LoadingState from "@/components/LoadingState";
import { ErrorBoundary } from "@/components/notes/ErrorBoundary";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { motionPresets, reducedMotionProps } from "@/lib/motion";
import { ArrowLeft } from "lucide-react";
import { DASHBOARD_TOOL_REGISTRY as TOOL_REGISTRY } from "@/lib/catalog/dashboards.client";

const CATEGORY_LABELS = {
  ai: "AI",
  architecture: "Architecture",
  cybersecurity: "Cybersecurity",
  digitalisation: "Digitalisation",
};

const COURSE_LINKS = {
  ai: "/ai",
  architecture: "/software-architecture",
  cybersecurity: "/cybersecurity",
  digitalisation: "/digitalisation",
};

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="rn-callout" role="alert">
      <div className="rn-callout-title">Dashboard unavailable</div>
      <div className="rn-callout-body">
        <p>This dashboard could not be loaded. This might be a temporary issue.</p>
        {process.env.NODE_ENV !== "production" && error && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Technical details</summary>
            <pre className="mt-2 overflow-auto text-xs">{error?.message || String(error)}</pre>
          </details>
        )}
        <button onClick={resetErrorBoundary} className="rn-btn rn-btn-primary rn-mt" type="button">
          Try again
        </button>
      </div>
    </div>
  );
}

export default function ClientPage({ params }) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [routeParams, setRouteParams] = useState(() => ({
    category: params?.category || null,
    tool: params?.tool || null,
  }));

  useEffect(() => {
    if (routeParams.category && routeParams.tool) return;
    if (typeof window === "undefined") return;

    const parts = String(window.location?.pathname || "")
      .split("/")
      .filter(Boolean);
    const idx = parts.indexOf("dashboards");
    const categoryFromPath = idx >= 0 ? parts[idx + 1] : null;
    const toolFromPath = idx >= 0 ? parts[idx + 2] : null;

    if (!categoryFromPath || !toolFromPath) return;
    setRouteParams({ category: categoryFromPath, tool: toolFromPath });
  }, [routeParams.category, routeParams.tool]);

  const category = routeParams.category;
  const tool = routeParams.tool;

  const entry = useMemo(() => {
    if (!category || !tool) return null;
    return TOOL_REGISTRY?.[category]?.[tool] || null;
  }, [category, tool]);

  const title = entry?.title || "Dashboard tool";
  const categoryLabel = CATEGORY_LABELS[category] || "Further practice";
  const backHref = category ? `/dashboards/${category}` : "/dashboards";
  const courseHref = COURSE_LINKS[category] || "/";

  useEffect(() => {
    if (reduce) {
      setReady(true);
      return;
    }
    setReady(false);
    const t = setTimeout(() => setReady(true), 140);
    return () => clearTimeout(t);
  }, [category, tool, reduce]);

  if (!category || !tool) {
    return (
      <NotesLayout
        meta={{
          title: "Loading dashboard",
          description: "Preparing dashboard.",
          section: "dashboards",
          slug: "/dashboards",
          level: "Further practice",
        }}
        headings={[]}
      >
        <LoadingState label="Preparing dashboard" compact />
      </NotesLayout>
    );
  }

  if (!entry || !entry.Component) {
    return (
      <NotesLayout
        meta={{
          title: "Dashboard not found",
          description: "The requested dashboard could not be found.",
          section: category,
          slug: `/dashboards/${category}/${tool}`,
          level: "Further practice",
        }}
        headings={[]}
      >
        <div className="mb-4">
          <Link href={backHref} className="rn-mini rn-card-link">
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to {categoryLabel} dashboards
            </span>
          </Link>
        </div>
        <div className="rn-callout">
          <div className="rn-callout-title">Dashboard not found</div>
          <div className="rn-callout-body">
            <p>The dashboard {tool} in category {categoryLabel} could not be found.</p>
            <Link href={backHref} className="rn-btn rn-btn-primary rn-mt">
              Go back
            </Link>
          </div>
        </div>
      </NotesLayout>
    );
  }

  const Component = entry.Component;

  return (
    <NotesLayout
      meta={{
        title: title,
        description: `${categoryLabel} dashboard: ${title}`,
        section: category,
        slug: `/dashboards/${category}/${tool}`,
        level: "Further practice",
      }}
      headings={[]}
    >
      <div className="mb-4">
        <Link href={backHref} className="rn-mini rn-card-link">
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to {categoryLabel} dashboards
          </span>
        </Link>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <LazyMotion features={domAnimation}>
          <m.div {...reducedMotionProps(reduce, motionPresets.fadeIn)}>
            <Component />
          </m.div>
        </LazyMotion>
      </ErrorBoundary>
    </NotesLayout>
  );
}
