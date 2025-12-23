"use client";

import Link from "next/link";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { motionPresets, reducedMotionProps } from "@/lib/motion";

export default function NotesStepper({ items, activeLevelId }) {
  const reduce = useReducedMotion();
  return (
    <div className="mb-6 w-full rounded-2xl border border-[color:var(--line)] bg-[var(--surface)]/80 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Progress</div>
      <LazyMotion features={domAnimation}>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const isActive = activeLevelId ? item.id === activeLevelId : item.active;
              return (
                <m.div key={item.label} {...reducedMotionProps(reduce, motionPresets.slideUp)} className="min-w-[9.5rem] flex-1 sm:flex-none">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex w-full items-center justify-center ${activeLevelId ? "gap-2" : "gap-1"} rounded-full border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring focus:ring-blue-200 ${
                      isActive ? "bg-blue-600 text-white border-blue-600" : "bg-[var(--surface)] text-[var(--text-body)] border-[color:var(--line)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeLevelId && isActive ? (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                        Current
                      </span>
                    ) : null}
                  </Link>
                </m.div>
              );
            })}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </div>
  );
}
