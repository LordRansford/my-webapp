"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { motionPresets, reducedMotionProps } from "@/lib/motion";

export default function LoadingState({
  label = "Preparing tool",
  hint = "Loading in your browser…",
  compact = false,
}) {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        {...reducedMotionProps(reduce, motionPresets.fadeIn)}
        className={`w-full max-w-full ${compact ? "" : "rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className={`flex items-center gap-3 ${compact ? "text-sm" : ""}`}>
          <Loader2 className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800">{label}</div>
            {hint ? <div className="text-xs text-slate-600">{hint}</div> : null}
          </div>
        </div>
      </m.div>
    </LazyMotion>
  );
}


