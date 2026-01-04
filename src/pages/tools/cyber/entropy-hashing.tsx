"use client";

import React from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("entropy-hashing");

const examples = [
  {
    title: "SHA-256 Hash",
    inputs: { input: "hello world", algorithm: "SHA-256" },
  },
  {
    title: "Hash Your Name",
    inputs: { input: "Ransford's Notes", algorithm: "SHA-256" },
  },
  {
    title: "See Avalanche Effect",
    inputs: { input: "The quick brown fox jumps over the lazy dog", algorithm: "SHA-256" },
  },
];

async function hashInput(input: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function EntropyHashingForm() {
  const { inputs, setInputs } = useToolInputs();
  const input = typeof inputs.input === "string" ? inputs.input : "";
  const algorithm = (inputs.algorithm as "SHA-256" | "MD5" | "SHA-1") || "SHA-256";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="input" className="block text-sm font-semibold text-slate-900">
          Input Text
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInputs((prev) => ({ ...prev, input: e.target.value }))}
          rows={5}
          maxLength={1024}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Enter text to hash..."
        />
        <p className="mt-1 text-xs text-slate-600">Max 1KB</p>
      </div>
      <div>
        <label htmlFor="algorithm" className="block text-sm font-semibold text-slate-900">
          Algorithm
        </label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setInputs((prev) => ({ ...prev, algorithm: e.target.value }))}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="SHA-256">SHA-256 (Recommended)</option>
          <option value="MD5" disabled>
            MD5 (Not available in Web Crypto API)
          </option>
          <option value="SHA-1" disabled>
            SHA-1 (Not available in Web Crypto API)
          </option>
        </select>
        <p className="mt-1 text-xs text-slate-600">Only SHA-256 is supported via Web Crypto API</p>
      </div>
    </div>
  );
}

export default function EntropyHashingPage() {
  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const inputStr = inputs.input as string;
    const algo = inputs.algorithm as string;

    if (!inputStr || typeof inputStr !== "string") {
      return {
        success: false,
        error: createToolError("validation_error", "entropy-hashing", { field: "input" }),
      };
    }

    if (!["SHA-256", "MD5", "SHA-1"].includes(algo)) {
      return {
        success: false,
        error: createToolError("unsupported_algorithm", "entropy-hashing", { message: "Algorithm must be SHA-256, MD5, or SHA-1" }),
      };
    }

    try {
      // Map algorithm names to Web Crypto API names
      const cryptoAlgo = algo === "SHA-256" ? "SHA-256" : algo === "MD5" ? "MD5" : "SHA-1";
      
      // Note: MD5 and SHA-1 are not available in Web Crypto API, so we'll use a fallback
      if (cryptoAlgo === "MD5" || cryptoAlgo === "SHA-1") {
        return {
          success: false,
          error: createToolError("unsupported_algorithm", "entropy-hashing", { 
            message: `${algo} is not available via Web Crypto API. Use SHA-256 for secure hashing.` 
          }),
        };
      }

      const hash = await hashInput(inputStr, cryptoAlgo);
      
      // Demonstrate avalanche effect with a small change
      const modifiedInput = inputStr + "x";
      const modifiedHash = await hashInput(modifiedInput, cryptoAlgo);
      
      const result = {
        input: inputStr,
        algorithm: algo,
        hash,
        hashLength: hash.length,
        avalancheDemo: {
          original: hash,
          modified: modifiedHash,
          changed: hash !== modifiedHash,
        },
      };

      return { success: true, output: JSON.stringify(result, null, 2) };
    } catch (err) {
      return {
        success: false,
        error: createToolError("runtime_error", "entropy-hashing", { message: err instanceof Error ? err.message : String(err) }),
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

      <ToolShell contract={contract} onRun={handleRun} examples={examples}>
        <EntropyHashingForm />
      </ToolShell>
    </div>
  );
}

