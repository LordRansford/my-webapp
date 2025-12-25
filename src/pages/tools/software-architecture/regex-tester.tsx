"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("regex-tester");

const examples = [
  {
    title: "Email Pattern",
    inputs: {
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      text: "Contact us at hello@example.com or support@test.org",
    },
  },
  {
    title: "Number Extraction",
    inputs: {
      pattern: "\\d+",
      text: "The price is $42.99 and quantity is 5",
    },
  },
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const patternInput = inputs.pattern as string;
    const textInput = inputs.text as string;

    if (!patternInput || typeof patternInput !== "string") {
      return {
        success: false,
        error: createToolError("validation_error", "regex-tester", { field: "pattern" }),
      };
    }

    if (!textInput || typeof textInput !== "string") {
      return {
        success: false,
        error: createToolError("validation_error", "regex-tester", { field: "text" }),
      };
    }

    // Local execution only (regex is browser-safe)
    try {
      const regex = new RegExp(patternInput, "g");
      const matches: string[] = [];
      let match;
      const startTime = Date.now();
      const timeout = contract.limits.cpuMs;

      while ((match = regex.exec(textInput)) !== null) {
        if (Date.now() - startTime > timeout) {
          return {
            success: false,
            error: createToolError("timeout", "regex-tester", { limitMs: timeout }),
          };
        }
        matches.push(match[0]);
        if (matches.length > 1000) break; // Prevent excessive matches
      }

      const result = {
        matches,
        matchCount: matches.length,
        groups: matches.length > 0 ? Array.from(matches[0].matchAll(new RegExp(patternInput)))[0]?.groups : null,
      };

      return { success: true, output: JSON.stringify(result, null, 2) };
    } catch (err) {
      return {
        success: false,
        error: createToolError("invalid_regex", "regex-tester", { message: err instanceof Error ? err.message : String(err) }),
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

      <ToolShell contract={contract} onRun={handleRun} examples={examples} initialInputs={{ pattern, text }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="pattern" className="block text-sm font-semibold text-slate-900">
              Regular Expression Pattern
            </label>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter regex pattern..."
            />
          </div>
          <div>
            <label htmlFor="text" className="block text-sm font-semibold text-slate-900">
              Test Text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter text to test against the pattern..."
            />
            <p className="mt-1 text-xs text-slate-600">Max {contract.limits.inputKb}KB</p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

