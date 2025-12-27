"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/analytics/track";

const TrustBoundaryBuilder = dynamic(() => import("./games/TrustBoundaryBuilder"), { ssr: false });
const SessionHijackSimulator = dynamic(() => import("./games/SessionHijackSimulator"), { ssr: false });
const DetectionTimelineChallenge = dynamic(() => import("./games/DetectionTimelineChallenge"), { ssr: false });

const cards = [
  {
    key: "trust",
    title: "Trust Boundary Builder",
    tag: "Trust, blast radius",
    desc: "Place components, add boundaries, simulate compromise.",
    time: "5-8 min",
    difficulty: "Foundation",
  },
  {
    key: "session",
    title: "Session Hijack Simulator",
    tag: "Identity, sessions",
    desc: "See where tokens leak and block the theft.",
    time: "5-8 min",
    difficulty: "Intermediate",
  },
  {
    key: "detection",
    title: "Detection Timeline Challenge",
    tag: "Detection, response",
    desc: "Place sensors, balance noise, detect before exfiltration.",
    time: "6-10 min",
    difficulty: "Advanced",
  },
];

export default function GameHub() {
  const [active, setActive] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!active && startTime) {
      track("game_closed", { game: active, durationMs: Date.now() - startTime });
      setStartTime(null);
    }
  }, [active, startTime]);

  const open = (key) => {
    setActive(key);
    setStartTime(Date.now());
    track("game_opened", { game: key });
  };

  const close = () => {
    if (startTime) track("game_closed", { game: active, durationMs: Date.now() - startTime });
    setActive(null);
    setStartTime(null);
  };

  return (
    <section className="mt-8">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Game hub</h2>
        <p className="text-sm text-gray-700">Pick a game. Learn by doing. All touch and keyboard friendly.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.key}
            className="rounded-2xl border bg-white/70 p-4 text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring focus:ring-blue-200"
            onClick={() => open(card.key)}
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">{card.tag}</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{card.title}</div>
            <div className="mt-2 text-sm text-gray-700">{card.desc}</div>
            <div className="mt-3 text-xs text-gray-600">
              {card.time} | {card.difficulty}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 rounded-2xl border bg-white/80 p-4 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm uppercase tracking-wide text-gray-500">Game</div>
              <button
                className="rounded-full border px-3 py-1 text-sm text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
                onClick={close}
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              {active === "trust" && <TrustBoundaryBuilder onComplete={() => track("game_completed", { game: "trust" })} />}
              {active === "session" && <SessionHijackSimulator onComplete={() => track("game_completed", { game: "session" })} />}
              {active === "detection" && <DetectionTimelineChallenge onComplete={() => track("game_completed", { game: "detection" })} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

