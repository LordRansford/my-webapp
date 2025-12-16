"use client";

import { useMemo, useState } from "react";

export default function DataNoiseTool() {
  const [signal, setSignal] = useState(70);
  const [noise, setNoise] = useState(20);

  const ratio = useMemo(() => {
    const r = signal / Math.max(1, noise);
    if (r > 5) return { label: "Clean", desc: "Most patterns are real. Small errors still matter.", value: r };
    if (r > 2) return { label: "OK", desc: "Usable, but you need validation and monitoring.", value: r };
    return { label: "Noisy", desc: "Patterns may be illusions. Collect more data or clean better.", value: r };
  }, [signal, noise]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div>
        <label className="block text-xs font-semibold text-gray-600">Signal strength</label>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={signal}
          onChange={(e) => setSignal(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-1 text-xs text-gray-600">Signal: {signal}</div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600">Noise level</label>
        <input
          type="range"
          min="5"
          max="80"
          step="5"
          value={noise}
          onChange={(e) => setNoise(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-1 text-xs text-gray-600">Noise: {noise}</div>
      </div>

      <div className="rounded-2xl border bg-white/70 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">Signal-to-noise</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">{ratio.label}</div>
        <p className="mt-1 text-sm text-gray-700">{ratio.desc}</p>
        <p className="mt-1 text-xs text-gray-600">
          Ratio: {ratio.value.toFixed(2)}. If noise rises without better modelling, you risk learning the noise.
        </p>
      </div>
    </div>
  );
}
