"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics/track";

const stages = ["Recon", "Initial access", "Privilege escalation", "Data access", "Exfiltration"];
const signals = [
  { id: "auth", label: "Auth logs", cost: 1, noise: 1 },
  { id: "access", label: "Access logs", cost: 1, noise: 1 },
  { id: "db", label: "Database audit", cost: 2, noise: 1 },
  { id: "anomaly", label: "Anomaly detection", cost: 2, noise: 2 },
  { id: "rate", label: "Rate limit alerts", cost: 1, noise: 1 },
];

export default function DetectionTimelineChallenge({ onComplete }) {
  const [placed, setPlaced] = useState({});

  const detectionStep = useMemo(() => {
    const idx = stages.findIndex((stage) => signals.some((sig) => placed[sig.id]?.includes(stage)));
    return idx === -1 ? null : idx;
  }, [placed]);

  const cost = useMemo(() => {
    let c = 0;
    Object.keys(placed).forEach((k) => {
      if (placed[k]?.length) {
        const sig = signals.find((s) => s.id === k);
        c += sig?.cost || 0;
      }
    });
    return c;
  }, [placed]);

  const noise = useMemo(() => {
    let n = 0;
    Object.keys(placed).forEach((k) => {
      if (placed[k]?.length) {
        const sig = signals.find((s) => s.id === k);
        n += sig?.noise || 0;
      }
    });
    return n;
  }, [placed]);

  const detectedBeforeExfil = detectionStep !== null && detectionStep < stages.length - 1;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">Place detection points along the attack path. Detect before exfiltration while keeping noise reasonable.</p>

      <div className="overflow-auto rounded-2xl border bg-white/70 p-3">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="px-3 py-2">Signal</th>
              {stages.map((s) => (
                <th key={s} className="px-3 py-2">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {signals.map((sig) => (
              <tr key={sig.id} className="border-t">
                <td className="px-3 py-2 font-semibold text-gray-900">
                  {sig.label}
                  <div className="text-sm text-gray-500">Cost {sig.cost} · Noise {sig.noise}</div>
                </td>
                {stages.map((stage) => {
                  const key = `${sig.id}-${stage}`;
                  const active = placed[sig.id]?.includes(stage);
                  return (
                    <td key={key} className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) =>
                          setPlaced((prev) => {
                            const list = new Set(prev[sig.id] || []);
                            if (e.target.checked) list.add(stage);
                            else list.delete(stage);
                            return { ...prev, [sig.id]: Array.from(list) };
                          })
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border bg-white/80 p-3 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-gray-500">Timeline</div>
        <div className="mt-2 flex items-center gap-2">
          {stages.map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  detectionStep === idx
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {s}
              </span>
              {idx < stages.length - 1 ? <div className="h-px w-8 bg-gray-300" aria-hidden /> : null}
            </div>
          ))}
        </div>
        <p className="mt-3 text-gray-800">
          {detectedBeforeExfil
            ? `Detected at ${stages[detectionStep]}.`
            : "No detection before exfiltration. Add better signals earlier."}
        </p>
        <p className="text-xs text-gray-600">Cost {cost} · Noise score {noise}. Balance both.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-full border px-3 py-1 text-xs text-gray-800 hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200"
          onClick={() => {
            setPlaced({});
            track("game_reset", { game: "detection" });
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
