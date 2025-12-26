"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { runPython } from "@/lib/sandbox/python/runPython";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("python-playground");

const examples = [
  {
    title: "Hello World",
    inputs: { code: 'print("Hello, world!")' },
  },
  {
    title: "Simple Loop",
    inputs: {
      code: `total = 0
for i in range(1, 6):
    total += i
print("Sum:", total)`,
    },
  },
  {
    title: "List Comprehension",
    inputs: {
      code: `nums = [1, 2, 3, 4]
doubled = [n * 2 for n in nums]
print("Doubled:", doubled)`,
    },
  },
];

export default function PythonPlaygroundPage() {
  const [code, setCode] = useState('print("Hello, world!")');

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
        error: createToolError("validation_error", "python-playground", { field: "code" }),
      };
    }

    if (mode === "compute") {
      try {
        const res = await fetch("/api/tools/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId: "python-playground", mode, inputs }),
        });
        const data = await res.json();
        if (data.success) {
          return { success: true, output: data.output };
        } else {
          return { success: false, error: createToolError(data.error.code, "python-playground", data.error) };
        }
      } catch (err) {
        return {
          success: false,
          error: createToolError("runtime_error", "python-playground", { message: err instanceof Error ? err.message : String(err) }),
        };
      }
    }

    // Local mode
    const result = await runPython(codeInput, contract);
    if (result.success && result.output) {
      return {
        success: true,
        output: result.output.result || result.output.stdout.join("\n"),
      };
    } else {
      return {
        success: false,
        error: result.error ? createToolError(result.error.code, "python-playground", result.error) : createToolError("runtime_error", "python-playground"),
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
              Python Code
            </label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                // Also update ToolShell inputs
                handleInputsChange({ code: e.target.value });
              }}
              rows={15}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter your Python code here..."
            />
            <p className="mt-1 text-xs text-slate-600">Max {contract.limits.inputKb}KB</p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}
