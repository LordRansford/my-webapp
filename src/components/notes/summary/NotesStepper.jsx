"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesStepper({ items }) {
  return (
    <div className="mb-6 rounded-2xl border bg-white/70 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Progress</div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.href}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition focus:outline-none focus:ring focus:ring-blue-200 ${
                  item.active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
