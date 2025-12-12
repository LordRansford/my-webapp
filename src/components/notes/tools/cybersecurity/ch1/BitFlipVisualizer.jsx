"use client";

import { useState, useMemo } from "react";

export default function BitFlipVisualizer() {
  const [bits, setBits] = useState(Array(8).fill(0));

  const value = useMemo(
    () =>
      bits.reduce((sum, bit, idx) => {
        const power = 7 - idx;
        return sum + bit * Math.pow(2, power);
      }, 0),
    [bits]
  );

  const toggleBit = (index) => {
    setBits((prev) => prev.map((b, i) => (i === index ? (b === 1 ? 0 : 1) : b)));
  };

  const reset = () => setBits(Array(8).fill(0));

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-700">Toggle bits to see how binary values change. The leftmost bit is the most significant.</div>

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

      <div className="text-sm">
        Decimal value: <span className="font-semibold">{value}</span>
      </div>

      <button onClick={reset} className="text-xs text-gray-600 underline hover:text-gray-900">
        Reset
      </button>
    </div>
  );
}
