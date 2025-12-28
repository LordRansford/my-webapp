"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("password-entropy");

const examples = [
  {
    title: "Weak Password",
    inputs: { password: "password123" },
  },
  {
    title: "Strong Password",
    inputs: { password: "Tr0ub4dor&3" },
  },
  {
    title: "Passphrase Style",
    inputs: { password: "correct-horse-battery-staple-2024!" },
  },
];

function calculateEntropy(password: string): { bits: number; strength: string; timeToCrack: string } {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  const bits = Math.log2(Math.pow(charsetSize, password.length));
  let strength = "Weak";
  let timeToCrack = "< 1 hour";

  if (bits >= 80) {
    strength = "Very Strong";
    timeToCrack = "Centuries";
  } else if (bits >= 60) {
    strength = "Strong";
    timeToCrack = "Years";
  } else if (bits >= 40) {
    strength = "Moderate";
    timeToCrack = "Days to weeks";
  }

  return { bits: Math.round(bits), strength, timeToCrack };
}

export default function PasswordEntropyPage() {
  const [password, setPassword] = useState("");

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const passwordInput = inputs.password as string;
    if (!passwordInput || typeof passwordInput !== "string") {
      return {
        success: false,
        error: createToolError("validation_error", "password-entropy", { field: "password" }),
      };
    }

    if (passwordInput.length > 256) {
      return {
        success: false,
        error: createToolError("invalid_input", "password-entropy", { message: "Password exceeds 256 character limit" }),
      };
    }

    const result = calculateEntropy(passwordInput);
    return { success: true, output: JSON.stringify(result, null, 2) };
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples} initialInputs={{ password }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter password to analyze..."
            />
            <p className="mt-1 text-xs text-slate-600">Max 256 characters</p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

