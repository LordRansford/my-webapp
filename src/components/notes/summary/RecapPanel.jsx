"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function RecapPanel() {
  const reduce = useReducedMotion();
  const items = [
    {
      title: "Beginner",
      text: "Data, meaning, CIA, trust boundaries, and how networks move packets.",
    },
    {
      title: "Intermediate",
      text: "Attacker and defender thinking, threat models, identity and sessions, crypto intuition, detection.",
    },
    {
      title: "Advanced",
      text: "Architecture, explicit assumptions, blast radius, protocols, zero trust, operations, supply chain risk.",
    },
  ];

  return (
    <section className="mt-4">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        className="grid gap-3 md:grid-cols-3"
      >
        {items.map((item) => (
          <div key={item.title} className="rounded-3xl border bg-white/60 p-4 md:p-5 backdrop-blur">
            <div className="text-sm font-semibold text-gray-900">{item.title}</div>
            <p className="mt-2 text-sm text-gray-700 opacity-85">{item.text}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
