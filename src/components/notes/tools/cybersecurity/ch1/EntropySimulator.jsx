'use client'

import { useMemo, useState } from "react";

const charsets = {
  "Lowercase (26)": 26,
  "Lower+Upper (52)": 52,
  "Letters+Digits (62)": 62,
  "Letters+Digits+Symbols (~90)": 90,
};

export default function EntropySimulator() {
  const [length, setLength] = useState(12);
  const [charset, setCharset] = useState("Letters+Digits (62)");

  const bits = useMemo(() => {
    const n = charsets[charset] || 1;
    return length * Math.log2(n);
  }, [length, charset]);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Adjust length and character set to see how guessing effort (entropy) changes. Length usually wins.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Length</span>
          <input
            type="range"
            min="4"
            max="24"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-800">{length} characters</span>
        </label>

        <label className="block space-y-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Character set</span>
          <select
            value={charset}
            onChange={(e) => setCharset(e.target.value)}
            className="w-full rounded-md border px-2 py-2 text-sm"
          >
            {Object.keys(charsets).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Estimated entropy</div>
        <p className="text-2xl font-semibold text-gray-900">{bits.toFixed(1)} bits</p>
        <p className="text-xs text-gray-600 mt-1">
          Doubling length roughly doubles entropy. Expanding the character set helps, but length matters most.
        </p>
      </div>
    </div>
  );
}
