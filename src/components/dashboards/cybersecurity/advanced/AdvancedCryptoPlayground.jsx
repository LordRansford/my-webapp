"use client";

import { useMemo, useState } from "react";

const KEY_SIZES = [64, 128, 192, 256];
const GUESS_RATES = [
  { label: "1B guesses/s", rate: 1e9 },
  { label: "100B guesses/s", rate: 1e11 },
];

function formatExponent(bits) {
  return `~2^${bits.toLocaleString()}`;
}

function bruteForceTime(bits, rate) {
  const seconds = Math.pow(2, bits) / rate;
  const years = seconds / (60 * 60 * 24 * 365);
  if (years > 1e6) return `${(years / 1e6).toFixed(1)} million years`;
  if (years > 1e3) return `${(years / 1e3).toFixed(1)}k years`;
  if (years > 1) return `${years.toFixed(1)} years`;
  const days = years * 365;
  if (days > 1) return `${days.toFixed(1)} days`;
  const hours = days * 24;
  return `${hours.toFixed(1)} hours`;
}

export default function AdvancedCryptoPlayground() {
  const [bits, setBits] = useState(128);
  const [message, setMessage] = useState("secure message");
  const [signed, setSigned] = useState("");
  const [verifyInput, setVerifyInput] = useState("secure message");
  const [kxStep, setKxStep] = useState(0);

  const signature = useMemo(() => (signed ? `sig-${hash(message)}` : ""), [signed, message]);
  const verifyStatus = useMemo(() => {
    if (!signed) return null;
    return hash(verifyInput) === signed ? "valid" : "invalid";
  }, [signed, verifyInput]);

  const kxSteps = [
    "Both parties choose private secrets.",
    "They exchange public values over the network.",
    "Each derives the same shared secret locally.",
  ];

  function hash(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = (h * 31 + text.charCodeAt(i)) % 100000;
    }
    return h.toString(16);
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Key size intuition */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900">Key size intuition</h4>
          <div className="mt-2 text-sm text-slate-800">
            <label className="block text-sm font-medium text-slate-900">Symmetric key size (bits)</label>
            <select
              value={bits}
              onChange={(e) => setBits(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            >
              {KEY_SIZES.map((b) => (
                <option key={b} value={b}>
                  {b} bits
                </option>
              ))}
            </select>
            <div className="mt-2 text-sm text-slate-800">Search space: {formatExponent(bits)}</div>
            <div className="mt-2 space-y-1 text-sm text-slate-800">
              {GUESS_RATES.map((g) => (
                <div key={g.label} className="flex justify-between">
                  <span>{g.label}</span>
                  <span className="font-semibold">{bruteForceTime(bits, g.rate)}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-700">
              Larger keys grow search space exponentially; doubling bits squares the work.
            </p>
          </div>
        </div>

        {/* Signature intuition */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900">Signature intuition</h4>
          <label className="text-sm text-slate-800">Message to sign</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            rows={3}
          />
          <button
            onClick={() => setSigned(hash(message))}
            className="mt-2 inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Sign
          </button>
          {signature && (
            <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono text-slate-900">
              Signature: {signature}
            </div>
          )}
          <div className="mt-2">
            <label className="text-sm text-slate-800">Verify message</label>
            <textarea
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
              rows={2}
            />
          </div>
          {verifyStatus && (
            <div
              className={`mt-2 rounded-lg border p-2 text-sm ${
                verifyStatus === "valid" ? "border-emerald-200 bg-emerald-50 text-slate-900" : "border-rose-200 bg-rose-50 text-slate-900"
              }`}
            >
              {verifyStatus === "valid" ? "Signature verifies for this message." : "Signature does not match this message."}
            </div>
          )}
        </div>

        {/* Key exchange intuition */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900">Key exchange intuition</h4>
          <p className="text-sm text-slate-800">Step through a simplified shared secret exchange.</p>
          <div className="mt-2 space-y-2 text-sm text-slate-800">
            {kxSteps.map((step, idx) => (
              <div
                key={idx}
                className={`rounded-lg border px-3 py-2 shadow-sm ${
                  idx === kxStep ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white"
                }`}
              >
                {idx + 1}. {step}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setKxStep((s) => Math.max(0, s - 1))}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
              disabled={kxStep === 0}
            >
              Previous
            </button>
            <button
              onClick={() => setKxStep((s) => Math.min(kxSteps.length - 1, s + 1))}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
              disabled={kxStep === kxSteps.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
