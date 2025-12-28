"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import ToolsErrorBoundary from "@/components/tools/ToolsErrorBoundary";
import { getToolContract } from "@/lib/tools/loadContract";
import { runJs } from "@/lib/sandbox/js/runJs";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("js-sandbox");

const examples = [
  {
    title: "Hello World",
    inputs: { code: 'console.log("Hello, world!");' },
  },
  {
    title: "Array Operations",
    inputs: {
      code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Original:", numbers);
console.log("Doubled:", doubled);
console.log("Sum:", sum);`,
    },
  },
  {
    title: "Async/Await Example",
    inputs: {
      code: `async function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data loaded!"), 100);
  });
}

(async () => {
  const result = await fetchData();
  console.log(result);
})();`,
    },
  },
];

function JsSandboxContent() {
  const [code, setCode] = useState('console.log("Hello, world!");');

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const codeInput = inputs.code as string;
    if (!codeInput || typeof codeInput !== "string") {
      return {
        success: false,
        error: createToolError("validation_error", "js-sandbox", { field: "code" }),
      };
    }

    if (mode === "compute") {
      try {
        const res = await fetch("/api/tools/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId: "js-sandbox", mode, inputs }),
        });
        const data = await res.json();
        if (data.success) {
          return { success: true, output: data.output };
        } else {
          return { success: false, error: createToolError(data.error.code, "js-sandbox", data.error) };
        }
      } catch (err) {
        return {
          success: false,
          error: createToolError("runtime_error", "js-sandbox", { message: err instanceof Error ? err.message : String(err) }),
        };
      }
    }

    // Local mode
    const result = await runJs(codeInput, contract);
    if (result.success && result.output) {
      return {
        success: true,
        output: result.output.result || result.output.stdout.join("\n"),
      };
    } else {
      return {
        success: false,
        error: result.error ? createToolError(result.error.code, "js-sandbox", result.error) : createToolError("runtime_error", "js-sandbox"),
      };
    }
  };

  // Sync code state with ToolShell inputs
  const handleInputsChange = (inputs: Record<string, unknown>) => {
    if (inputs.code && typeof inputs.code === "string") {
      setCode(inputs.code);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples} initialInputs={{ code }} onInputsChange={handleInputsChange}>
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-slate-900">
              JavaScript Code
            </label>
            <textarea
              id="code"
              name="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                // Also update ToolShell inputs
                handleInputsChange({ code: e.target.value });
              }}
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
