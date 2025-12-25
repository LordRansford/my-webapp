"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import ToolsErrorBoundary from "@/components/tools/ToolsErrorBoundary";
import { getToolContract } from "@/lib/tools/loadContract";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";
import type { ToolError } from "@/components/tools/ErrorPanel";

const contract = getToolContract("js-sandbox");

function JsSandboxContent() {
  const [code, setCode] = useState('console.log("Hello, world!");');

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  // ToolShell will use unified runner if onRun is undefined
  // We can pass undefined to let it handle execution automatically

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} initialInputs={{ code }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-slate-900">
              JavaScript Code
            </label>
            <textarea
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter your JavaScript code here..."
            />
            <p className="mt-1 text-xs text-slate-600">Max {contract.limits.inputKb}KB</p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

export default function JsSandboxPage() {
  return (
    <ToolsErrorBoundary toolId="js-sandbox">
      <JsSandboxContent />
    </ToolsErrorBoundary>
  );
}
