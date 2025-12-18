"use client";

import React, { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

function estimateEntropy(password: string): number {
  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^A-Za-z0-9]/.test(password)) charset += 32;
  if (charset === 0) return 0;
  return Math.log2(charset) * password.length;
}

function timeToCrack(entropy: number, guessesPerSecond: number): string {
  const seconds = Math.pow(2, entropy) / guessesPerSecond;
  if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(1)} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(1)} hours`;
  const days = hours / 24;
  if (days < 365) return `${days.toFixed(1)} days`;
  const years = days / 365;
  if (years < 1000) return `${years.toFixed(1)} years`;
  return "thousands of years";
}

export function PasswordStrengthTool() {
  const [password, setPassword] = useState("CorrectHorseBatteryStaple!");

  const entropy = useMemo(() => estimateEntropy(password), [password]);

  const fastGpu = timeToCrack(entropy, 1e12);
  const cloud = timeToCrack(entropy, 1e10);
  const desktop = timeToCrack(entropy, 1e8);

  return (
    <CyberToolCard
      id="password-strength-title"
      title="Password strength estimator"
      icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
      description="Estimate rough entropy and brute-force time for a password at different attack speeds. All calculations stay in your browser."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="password-input" className="block text-xs font-semibold text-slate-700">
            Enter a sample password
          </label>
          <input
            id="password-input"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="Type or paste a password"
          />
          <p className="text-xs text-slate-500">
            This does not store or send your input. For teaching: try adding length, mixed case, numbers and symbols.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p>
              Estimated entropy: <span className="font-semibold text-slate-900">{entropy.toFixed(1)} bits</span>
            </p>
            <p className="text-[11px] text-slate-600">
              This is a simplified estimate. Real-world strength depends on randomness, reuse, breaches and MFA.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">Brute-force time (offline)</p>
            <p className="text-[11px]">Fast GPU (~10^12 guesses/sec): {fastGpu}</p>
            <p className="text-[11px]">Cloud rig (~10^10 guesses/sec): {cloud}</p>
            <p className="text-[11px]">Desktop (~10^8 guesses/sec): {desktop}</p>
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
