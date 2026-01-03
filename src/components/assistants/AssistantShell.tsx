"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { LifeBuoy } from "lucide-react";
import FeedbackAssistant from "@/components/assistants/FeedbackAssistant";
import { readAssistantsOpenState, writeAssistantsOpenState } from "@/components/assistants/state";

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

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const persisted = readAssistantsOpenState();
    setFeedbackOpen(persisted.feedbackOpen);
  }, []);

  useEffect(() => {
    writeAssistantsOpenState({ feedbackOpen });
  }, [feedbackOpen]);

  const onEsc = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
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
                  setFeedbackOpen((v) => !v);
                }}
              >
                <LifeBuoy className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Feedback</span>
              </button>
            </div>
          </div>
        </div>

        <m.div {...drawerMotion("left")}>
          <FeedbackAssistant open={feedbackOpen} onClose={() => setFeedbackOpen(false)} pageUrl={pathname} pageTitle={typeof document !== "undefined" ? document.title || "" : ""} />
        </m.div>
      </div>
    </LazyMotion>
  );
}


