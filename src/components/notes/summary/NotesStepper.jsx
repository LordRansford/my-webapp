"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesStepper({ items, activeLevelId }) {
  return (
    <div className="mb-6 rounded-2xl border bg-white/70 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Progress</div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const isActive = activeLevelId ? item.id === activeLevelId : item.active;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center ${activeLevelId ? "gap-2" : "gap-1"} rounded-full border px-3 py-1 text-sm transition focus:outline-none focus:ring focus:ring-blue-200 ${
                    isActive ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"
                  }`}
                >
                  <span>{item.label}</span>
                  {activeLevelId && isActive ? (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                      Current
                    </span>
                  ) : null}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
