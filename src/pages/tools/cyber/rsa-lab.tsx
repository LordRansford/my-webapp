"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("rsa-oaep");

// Educational RSA implementation (small primes only)
function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function findE(phi: number): number {
  for (let e = 2; e < phi; e++) {
    if (gcd(e, phi) === 1) return e;
  }
  return phi - 1;
}

function modInverse(a: number, m: number): number {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return 1;
}

export default function RsaLabPage() {
  const [p, setP] = useState(3);
  const [q, setQ] = useState(11);
  const [message, setMessage] = useState("7");

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const pVal = Number(inputs.p);
    const qVal = Number(inputs.q);
    const msg = inputs.message;

    if (!pVal || !qVal || pVal === qVal) {
      return {
        success: false,
        error: createToolError("invalid_primes", "rsa-oaep", { message: "p and q must be distinct primes" }),
      };
    }

    if (pVal < 2 || qVal < 2) {
      return {
        success: false,
        error: createToolError("invalid_primes", "rsa-oaep", { message: "Primes must be >= 2" }),
      };
    }

    try {
      const n = pVal * qVal;
      const phi = (pVal - 1) * (qVal - 1);
      const e = findE(phi);
      const d = modInverse(e, phi);

      const messageNum = typeof msg === "number" ? msg : Number(msg) || 7;
      if (messageNum >= n) {
        return {
          success: false,
          error: createToolError("invalid_message", "rsa-oaep", { message: `Message must be < n (${n})` }),
        };
      }

      const encrypted = modPow(messageNum, e, n);
      const decrypted = modPow(encrypted, d, n);

      const result = {
        primes: { p: pVal, q: qVal },
        n,
        phi,
        publicKey: { e, n },
        privateKey: { d, n },
        message: messageNum,
        encrypted,
        decrypted,
        verified: messageNum === decrypted,
      };

      return { success: true, output: JSON.stringify(result, null, 2) };
    } catch (err) {
      return {
        success: false,
        error: createToolError("computation_error", "rsa-oaep", { message: err instanceof Error ? err.message : String(err) }),
      };
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} initialInputs={{ p, q, message }}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="p" className="block text-sm font-semibold text-slate-900">
                Prime p
              </label>
              <input
                id="p"
                type="number"
                value={p}
                onChange={(e) => setP(Number(e.target.value))}
                min={2}
                max={100}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label htmlFor="q" className="block text-sm font-semibold text-slate-900">
                Prime q
              </label>
              <input
                id="q"
                type="number"
                value={q}
                onChange={(e) => setQ(Number(e.target.value))}
                min={2}
                max={100}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-slate-900">
              Message (number)
            </label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter numeric message"
            />
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

