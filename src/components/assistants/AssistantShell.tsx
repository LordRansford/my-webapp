"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { GraduationCap, LifeBuoy } from "lucide-react";
import MentorAssistant from "@/components/assistants/MentorAssistant";
import FeedbackAssistant from "@/components/assistants/FeedbackAssistant";
import { enforceOneOpen, readAssistantsOpenState, writeAssistantsOpenState } from "@/components/assistants/state";

declare global {
  interface Window {
    __RN_ASSISTANT_SHELL_MOUNTED__?: boolean;
  }
}

export default function AssistantShell() {
  // Prevent duplicate mounts if multiple layouts include the shell.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__RN_ASSISTANT_SHELL_MOUNTED__) return;
    window.__RN_ASSISTANT_SHELL_MOUNTED__ = true;
    setEnabled(true);
  }, []);

  const reduce = useReducedMotion();
  const pathname = usePathname() || "/";

  const [mentorOpen, setMentorOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const persisted = readAssistantsOpenState();
    setMentorOpen(persisted.mentorOpen);
    setFeedbackOpen(persisted.feedbackOpen);
  }, []);

  useEffect(() => {
    writeAssistantsOpenState(enforceOneOpen({ mentorOpen, feedbackOpen }));
  }, [mentorOpen, feedbackOpen]);

  useEffect(() => {
    // One assistant open at a time on small screens.
    const mq = window.matchMedia("(max-width: 640px)");
    const enforce = () => {
      if (!mq.matches) return;
      if (mentorOpen && feedbackOpen) setFeedbackOpen(false);
    };
    enforce();
    mq.addEventListener?.("change", enforce);
    return () => mq.removeEventListener?.("change", enforce);
  }, [mentorOpen, feedbackOpen]);

  const onEsc = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMentorOpen(false);
      setFeedbackOpen(false);
    }
  };

  const drawerMotion = (side: "left" | "right") => {
    if (reduce) return {} as any;
    return {
      initial: { x: side === "left" ? -12 : 12, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: side === "left" ? -12 : 12, opacity: 0 },
      transition: { duration: 0.18 },
    } as any;
  };

  if (!enabled) return null;

  return (
    <LazyMotion features={domAnimation}>
      <div onKeyDown={onEsc}>
        {/* Launchers */}
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40">
          <div className="mx-auto flex max-w-[1200px] justify-between px-4">
            <div className="pointer-events-auto">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="Feedback"
                onClick={() => {
                  setMentorOpen(false);
                  setFeedbackOpen((v) => !v);
                }}
              >
                <LifeBuoy className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Feedback</span>
              </button>
            </div>
            <div className="pointer-events-auto">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="Mentor"
                onClick={() => {
                  setFeedbackOpen(false);
                  setMentorOpen((v) => !v);
                }}
              >
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Mentor</span>
              </button>
            </div>
          </div>
        </div>

        <m.div {...drawerMotion("left")}>
          <FeedbackAssistant open={feedbackOpen} onClose={() => setFeedbackOpen(false)} pageUrl={pathname} pageTitle={typeof document !== "undefined" ? document.title || "" : ""} />
        </m.div>
        <m.div {...drawerMotion("right")}>
          <MentorAssistant open={mentorOpen} onClose={() => setMentorOpen(false)} />
        </m.div>
      </div>
    </LazyMotion>
  );
}


