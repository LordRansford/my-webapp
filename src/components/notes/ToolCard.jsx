"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCPD } from "@/hooks/useCPD";
import { resolveTrackId } from "@/lib/cpd";
import { motionPresets, reducedMotionProps } from "@/lib/motion";
import SaveProgressPrompt from "@/components/auth/SaveProgressPrompt";
import { useAnalytics } from "@/hooks/useAnalytics";
import { emitInternalToolEvent } from "@/lib/analytics/internalClient";

class ToolErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // No console logging of tool contents.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="m-0 text-sm text-slate-700">This tool could not load. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ToolCard({
  id,
  title,
  description,
  usageHint,
  children,
  href,
  icon: Icon,
  courseId,
  levelId,
  sectionId,
  cpdMinutesOnUse,
}) {
  const slugify = (text = "") =>
    String(text)
      .toLowerCase()
      .replace(/&[#\w]+;?/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);

  const resolvedId = id || slugify(title) || undefined;

  const { updateSection, isAuthed } = useCPD();
  const { track } = useAnalytics();
  const [hasAwarded, setHasAwarded] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const trackId = courseId ? resolveTrackId(courseId) : null;
  const reduce = useReducedMotion();
  useSession();

  const handleUse = ({ allowPrompt = true } = {}) => {
    if (!isAuthed) {
      if (allowPrompt) setShowSavePrompt(true);
      return;
    }

    if (resolvedId) track({ type: "tool_used", toolId: resolvedId, trackId: trackId || undefined, levelId, sectionId });
    if (!trackId || !levelId || !sectionId) return;
    if (hasAwarded) return;

    updateSection({
      trackId,
      levelId,
      sectionId,
      minutesDelta: cpdMinutesOnUse ?? 5,
      note: resolvedId ? `Used tool ${resolvedId}` : `Used tool ${title}`,
    });

    setHasAwarded(true);
  };

  const showCta = Boolean(href) && !children;
  const ResolvedIcon = Icon || ArrowRight;
  const showPlaceholder = !children && !href;
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current) return;
    if (!resolvedId) return;
    viewedRef.current = true;
    emitInternalToolEvent({ type: "tool_viewed", toolId: resolvedId });
  }, [resolvedId]);

  const Inner = (
    <>
      <header className="mb-4 min-w-0">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            {showCta ? (
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                <ResolvedIcon className="h-4 w-4 text-slate-700" aria-hidden="true" />
              </span>
            ) : null}
            <div className="min-w-0">
              <h3 className="mb-2 break-words text-lg font-semibold text-slate-900">{title}</h3>
              {description ? <p className="break-words text-sm leading-relaxed text-slate-600">{description}</p> : null}
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {usageHint || "How to use: open the tool, follow the inputs, and run with limits shown."}
              </p>
            </div>
          </div>
          {showCta ? (
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Open <span aria-hidden="true">-&gt;</span>
            </span>
          ) : null}
        </div>
      </header>

      {children ? (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors duration-200">
          <ToolErrorBoundary>{children}</ToolErrorBoundary>
        </div>
      ) : showPlaceholder ? (
        <div className="w-full rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="m-0 text-sm text-slate-700">
            Tool coming online. This card is intentionally visible so the section is not a blank gap.
          </p>
        </div>
      ) : null}
    </>
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.section
        {...reducedMotionProps(reduce, motionPresets.slideUp)}
        data-tool-id={resolvedId || ""}
        data-tool-title={title || ""}
        className="notes-tool-card my-6 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
      >
        {href ? (
          <Link
            href={href}
            className="block w-full min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => handleUse({ allowPrompt: false })}
            aria-label={`Open ${title}`}
          >
            {Inner}
          </Link>
        ) : (
          <button
            type="button"
            className="w-full min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => handleUse({ allowPrompt: true })}
            aria-label={`Use ${title}`}
          >
            {Inner}
          </button>
        )}
      </m.section>
      {showSavePrompt && !isAuthed ? <SaveProgressPrompt /> : null}
    </LazyMotion>
  );
}
