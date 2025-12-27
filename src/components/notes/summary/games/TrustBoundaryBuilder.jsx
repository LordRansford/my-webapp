"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/analytics/track";
import { Check } from "lucide-react";

const components = ["Browser", "API Gateway", "Auth Service", "Database", "Admin Panel", "Logging"];
const zones = ["Public", "Semi trusted", "Trusted"];

export default function TrustBoundaryBuilder({ onComplete }) {
  const [placements, setPlacements] = useState({});
  const [validation, setValidation] = useState({});
  const [compromised, setCompromised] = useState("Browser");

  const coverage = useMemo(() => {
    const zoneScore = Object.keys(placements).length / components.length;
    const validationScore = Object.keys(validation).length / components.length;
    return Math.round(((zoneScore + validationScore) / 2) * 100);
  }, [placements, validation]);

  useEffect(() => {
    track("game_state", { game: "trust", placements, validation, compromised });
  }, [placements, validation, compromised]);

  const reachable = useMemo(() => {
    // simplified: everything in same or lower trust zone becomes reachable
    const compromisedZone = placements[compromised] || "Public";
    const order = { Public: 0, "Semi trusted": 1, Trusted: 2 };
    return components.filter((c) => (placements[c] ? order[placements[c]] <= order[compromisedZone] : true));
  }, [placements, compromised]);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Place components into zones, mark validation points, and simulate compromise. Lower blast radius wins.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {zones.map((z) => (
          <div key={z} className="rounded-xl border bg-white/70 p-3">
            <div className="text-xs uppercase tracking-wide text-gray-500">{z}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {components.map((c) => (
                <button
                  key={c + z}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    placements[c] === z ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"
                  }`}
                  onClick={() => setPlacements((prev) => ({ ...prev, [c]: z }))}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white/70 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-500">Validation points</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {components.map((c) => (
            <button
              key={c}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                validation[c] ? "bg-emerald-100 border-emerald-400 text-emerald-800" : "bg-white text-gray-800"
              }`}
              onClick={() => setValidation((prev) => ({ ...prev, [c]: !prev[c] }))}
            >
              {validation[c] ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              <span>Validate {c}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white/80 p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-gray-500">Compromised</span>
          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={compromised}
            onChange={(e) => setCompromised(e.target.value)}
          >
            {components.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            className="rounded-full border px-3 py-1 text-xs text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
            onClick={() => {
              setPlacements({});
              setValidation({});
              setCompromised("Browser");
              track("game_reset", { game: "trust" });
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

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Meter label="Blast radius" value={Math.round((reachable.length / components.length) * 100)} />
          <Meter label="Validation coverage" value={Math.round((Object.keys(validation).length / components.length) * 100)} />
          <Meter label="Overall" value={coverage} />
        </div>

        <div className="mt-3 text-xs text-gray-700">
          Compromised node: <strong>{compromised}</strong>. Reachable: {reachable.join(", ")}.
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="relative mt-1 h-2 rounded-full bg-gray-200">
        <motion.div
          className="absolute left-0 top-0 h-2 rounded-full bg-blue-500"
          style={{ width: `${value}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="text-xs text-gray-700 mt-1">{value}%</div>
    </div>
  );
}
