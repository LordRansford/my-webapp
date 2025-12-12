"use client";

import { useMemo, useState } from "react";

const charsets = {
  "Digits (10)": 10,
  "Lowercase (26)": 26,
  "Lower+Upper (52)": 52,
  "Letters+Digits (62)": 62,
  "Letters+Digits+Symbols (~90)": 90,
};

export default function PasswordEntropyLab() {
  const [length, setLength] = useState(12);
  const [charset, setCharset] = useState("Letters+Digits (62)");

  const bits = useMemo(() => {
    const n = charsets[charset] || 1;
    return length * Math.log2(n);
  }, [length, charset]);

  const daysToCrack = useMemo(() => {
    const guessesPerSec = 1e9; // illustrative
    const totalGuesses = Math.pow(2, bits);
    return totalGuesses / guessesPerSec / 86400;
  }, [bits]);

  return (
    <div className="stack" style={{ gap: "0.6rem" }}>
      <p className="muted">
        See how length and character set change entropy and an illustrative time-to-crack estimate.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="control">
          <span>Length</span>
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <span className="muted">{length} characters</span>
        </label>
        <label className="control">
          <span>Character set</span>
          <select value={charset} onChange={(e) => setCharset(e.target.value)}>
            {Object.keys(charsets).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="rounded-lg border px-3 py-3 bg-gray-50">
        <p className="eyebrow">Entropy</p>
        <p className="text-xl font-semibold text-gray-900">{bits.toFixed(1)} bits</p>
        <p className="muted">Higher is harder to guess. Length usually beats complexity tricks.</p>
      </div>
      <div className="rounded-lg border px-3 py-3">
        <p className="eyebrow">Illustrative offline crack time</p>
        <p className="text-sm text-gray-800">
          ~{daysToCrack.toExponential(2)} days at 1B guesses/sec (for teaching only).
        </p>
        <p className="muted text-xs">
          Real-world crack times depend on rate limits, hashing algorithms, and attacker resources.
        </p>
      </div>
    </div>
  );
}
