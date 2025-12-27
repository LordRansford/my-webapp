"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics/track";
import { Check } from "lucide-react";

const controls = [
  { id: "httponly", label: "HttpOnly cookie", friction: 1, block: ["storage"] },
  { id: "short", label: "Short expiry", friction: 1, block: ["replay"] },
  { id: "rotate", label: "Rotation", friction: 2, block: ["network", "replay"] },
  { id: "bind", label: "Bind to device", friction: 2, block: ["replay"] },
  { id: "server", label: "Server session store", friction: 2, block: ["revoke"] },
  { id: "revoke", label: "Revoke on password change", friction: 1, block: ["replay", "network", "storage"] },
];

const theftPoints = ["storage", "network", "replay"];

export default function SessionHijackSimulator({ onComplete }) {
  const [stolenAt, setStolenAt] = useState("storage");
  const [chosen, setChosen] = useState({});

  const blocked = theftPoints.every((p) =>
    controls.some((c) => chosen[c.id] && c.block.includes(p))
  );
  const friction = Object.keys(chosen)
    .filter((k) => chosen[k])
    .reduce((sum, key) => sum + (controls.find((c) => c.id === key)?.friction || 0), 0);

  const result = blocked ? "Attacker blocked" : "Token stolen";

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Choose controls to defend against token theft at different points.</p>

      <div className="flex flex-wrap gap-2">
        {theftPoints.map((p) => (
          <button
            key={p}
            onClick={() => setStolenAt(p)}
            className={`rounded-full border px-3 py-1 text-xs ${
              stolenAt === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"
            }`}
          >
            Theft at {labelFor(p)}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-white/70 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-500">Controls</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {controls.map((c) => {
            const active = chosen[c.id];
            return (
              <button
                key={c.id}
                onClick={() => setChosen((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                  active ? "bg-emerald-100 border-emerald-400 text-emerald-800" : "bg-white text-gray-800"
                }`}
              >
                {active ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border bg-white/80 p-3 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-gray-500">Simulation</div>
        <p className={`mt-2 font-semibold ${blocked ? "text-emerald-700" : "text-red-700"}`}>{result}</p>
        <p className="text-xs text-gray-700 mt-1">
          Token stolen at {labelFor(stolenAt)}. Friction score: {friction}. Balance defence with user experience.
        </p>
        <motion.div
          className="mt-3 h-2 rounded-full bg-gray-200"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(friction * 20, 100)}%` }}
          transition={{ duration: 0.25 }}
        >
          <span className="sr-only">Friction meter</span>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-full border px-3 py-1 text-xs text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
          onClick={() => {
            setChosen({});
            track("game_reset", { game: "session" });
          }}
        >
          Reset
        </button>
        <button
          className="rounded-full border px-3 py-1 text-xs text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
          onClick={() => onComplete?.()}
        >
          Mark complete
        </button>
      </div>
    </div>
  );
}

function labelFor(point) {
  if (point === "storage") return "device storage";
  if (point === "network") return "network transit";
  return "replay later";
}
