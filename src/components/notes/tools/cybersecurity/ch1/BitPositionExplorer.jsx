'use client'

import { useMemo, useState } from "react";

export default function BitPositionExplorer() {
  const [bits, setBits] = useState(Array(8).fill(0));

  const value = useMemo(
    () =>
      bits.reduce((sum, bit, idx) => {
        const power = 7 - idx;
        return sum + bit * Math.pow(2, power);
      }, 0),
    [bits]
  );

  function toggleBit(index) {
    setBits((prev) => prev.map((b, i) => (i === index ? (b === 1 ? 0 : 1) : b)));
  }

  function reset() {
    setBits(Array(8).fill(0));
  }

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Flip bits to see how position changes value. The leftmost bit is the most significant.
      </p>

      <div className="flex gap-2 flex-wrap">
        {bits.map((bit, idx) => (
          <button
            key={idx}
            onClick={() => toggleBit(idx)}
            className={`w-10 h-10 rounded-md border text-lg font-mono transition ${
              bit === 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
            aria-label={`Bit ${idx}`}
          >
            {bit}
          </button>
        ))}
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50">
        <div className="font-semibold text-gray-800">Decimal value</div>
        <div className="text-2xl font-semibold text-gray-900 mt-1">{value}</div>
        <p className="text-xs text-gray-600 mt-1">
          Each step left doubles the weight. Try turning on only the leftmost bit.
        </p>
      </div>

      <button onClick={reset} className="text-xs text-gray-600 underline hover:text-gray-900">
        Reset
      </button>
    </div>
  );
}
