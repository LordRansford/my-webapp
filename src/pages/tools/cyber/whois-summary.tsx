"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import type { ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("whois-summary");

export default function WhoisSummaryToolPage() {
  const [target, setTarget] = useState("example.com");

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (_mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const t = inputs.target;
    const hostname = typeof t === "string" ? t.trim() : "";
    if (!hostname) {
      return { success: false, error: { code: "validation_error", message: "Target is required" } };
    }

    const res = await fetch("/api/tools/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId: "whois-summary", mode: "compute", inputs: { target: hostname } }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      return { success: false, error: { code: "compute_error", message: "Unable to run WHOIS summary." } };
    }

    if (data.success) {
      return { success: true, output: data.output };
    }

    return {
      success: false,
      error: {
        code: data.error?.code || "compute_error",
        message: data.error?.message || "WHOIS summary failed.",
        fixSuggestion: data.error?.fixSuggestion,
      },
    };
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} initialInputs={{ target }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="target" className="block text-sm font-semibold text-slate-900">
              Domain
            </label>
            <input
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="example.com"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            <p className="mt-1 text-xs text-slate-600">
              This tool is a safe, educational fallback. It tells you what to verify next, rather than claiming full WHOIS coverage.
            </p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

