"use client";

import React, { useMemo, useState } from "react";
import { Lock, Shield } from "lucide-react";

const MAX_LENGTH = 50;

function calculateEntropy(length, charSetSize) {
  if (length === 0 || charSetSize === 0) return 0;
  return length * Math.log2(charSetSize);
}

function formatNumber(num) {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
  return `${(num / 1000000000).toFixed(1)}B`;
}

function estimateCrackTime(combinations, guessesPerSecond) {
  const seconds = combinations / guessesPerSecond;
  if (seconds < 60) return `${seconds.toFixed(0)} seconds`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`;
  return `${(seconds / 31536000).toFixed(1)} years`;
}

export default function PasswordEntropyDashboard() {
  const [length, setLength] = useState(12);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);

  const charSetSize = useMemo(() => {
    let size = 0;
    if (useLowercase) size += 26;
    if (useUppercase) size += 26;
    if (useDigits) size += 10;
    if (useSymbols) size += 32; // Common symbols
    return size;
  }, [useLowercase, useUppercase, useDigits, useSymbols]);

  const combinations = useMemo(() => {
    if (charSetSize === 0 || length === 0) return 0;
    return Math.pow(charSetSize, length);
  }, [charSetSize, length]);

  const entropy = useMemo(() => calculateEntropy(length, charSetSize), [length, charSetSize]);

  const crackTimes = useMemo(() => {
    const speeds = [
      { label: "Offline (1B guesses/s)", rate: 1e9 },
      { label: "Online (100 guesses/s)", rate: 100 },
    ];
    return speeds.map(({ label, rate }) => ({
      label,
      time: estimateCrackTime(combinations, rate),
    }));
  }, [combinations]);

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: controls */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Password pattern
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Adjust length and character sets to see how they affect search space. This tool does not
            store or log any passwords.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">
            Length: {length} characters
          </label>
          <input
            type="range"
            min="1"
            max={MAX_LENGTH}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-sky-400"
            aria-label="Password length"
          />
          <div className="mt-1 flex justify-between text-[0.7rem] text-slate-400">
            <span>1</span>
            <span>{MAX_LENGTH}</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">
            Character sets
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={useLowercase}
                onChange={(e) => setUseLowercase(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-sky-400 focus:ring-sky-400"
              />
              <span>Lowercase letters (a-z)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-sky-400 focus:ring-sky-400"
              />
              <span>Uppercase letters (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={useDigits}
                onChange={(e) => setUseDigits(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-sky-400 focus:ring-sky-400"
              />
              <span>Digits (0-9)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-sky-400 focus:ring-sky-400"
              />
              <span>Symbols (!@#$%...)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right: results */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Lock size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Entropy and search space</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-400">Character set size</span>
                <span className="font-semibold text-slate-100">{charSetSize}</span>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-400">Total combinations</span>
                <span className="font-semibold text-sky-300">
                  {formatNumber(combinations)}
                </span>
              </div>
              <div className="text-[0.7rem] text-slate-500">
                {charSetSize}
                <sup>{length}</sup>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-400">Entropy (bits)</span>
                <span className="font-semibold text-emerald-300">
                  {entropy.toFixed(1)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Shield size={18} className="text-purple-400" />
            <h4 className="text-xs font-semibold text-slate-100">Estimated crack time</h4>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            {crackTimes.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.label}</span>
                <span className="font-medium text-slate-100">{item.time}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.7rem] text-slate-400">
            These are rough estimates. Real attack speeds vary. Entropy above 80 bits is generally
            considered strong for most purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

