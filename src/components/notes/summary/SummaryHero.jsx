"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SummaryHero({ title, subtitle }) {
  const reduce = useReducedMotion();
  return (
    <section className="mb-6 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur">
      <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={reduce ? undefined : { opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Summary and games</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-700 text-base max-w-2xl">{subtitle}</p>
      </motion.div>
    </section>
  );
}
