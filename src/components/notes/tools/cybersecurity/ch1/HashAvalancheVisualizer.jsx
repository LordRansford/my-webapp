'use client'

import { useEffect, useState } from "react";

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashAvalancheVisualizer() {
  const [input, setInput] = useState("hello");
  const [mutated, setMutated] = useState("hello!");
  const [hashA, setHashA] = useState("");
  const [hashB, setHashB] = useState("");

  useEffect(() => {
    let cancelled = false;
    sha256(input).then((h) => !cancelled && setHashA(h));
    sha256(mutated).then((h) => !cancelled && setHashB(h));
    return () => {
      cancelled = true;
    };
  }, [input, mutated]);

  const diff = diffHex(hashA, hashB);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Change one character and see how many hex characters differ. This is the avalanche effect.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Original input" value={input} onChange={setInput} />
        <Field label="Mutated input" value={mutated} onChange={setMutated} />
      </div>

      <HashBlock label="Hash A" value={hashA} />
      <HashBlock label="Hash B" value={hashB} />

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Difference</div>
        <p className="text-gray-800">
          {diff.changed} of {diff.total} hex characters differ (
          {diff.total ? Math.round((diff.changed / diff.total) * 100) : 0}%).
        </p>
        <p className="text-xs text-gray-600 mt-1">Small input changes produce large output changes.</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
        <input
          className="w-full rounded-md border px-2 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
  );
}

function HashBlock({ label, value }) {
  return (
    <div className="rounded-lg border px-3 py-3 leading-6">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="font-mono text-[13px] text-gray-900 break-words mt-1">{value}</div>
    </div>
  );
}

function diffHex(a, b) {
  if (!a || !b || a.length !== b.length) return { changed: 0, total: Math.max(a.length, b.length) || 0 };
  let changed = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) changed++;
  }
  return { changed, total: a.length };
}
