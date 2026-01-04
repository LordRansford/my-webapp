"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
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
  {
    title: "Dictionary Fun",
    inputs: {
      code: `data = {"name": "Alice", "age": 30, "city": "NYC"}
for key, value in data.items():
    print(f"{key}: {value}")`,
    },
  },
];

function PythonEditor({ statusText }: { statusText: string | null }) {
  const { inputs, setInputs } = useToolInputs();
  const code = typeof inputs.code === "string" ? inputs.code : "";

  return (
    <div className="space-y-4">
      {statusText ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status" aria-live="polite">
          {statusText}
        </div>
      ) : null}
      <div>
        <label htmlFor="code" className="block text-sm font-semibold text-slate-900">
          Python Code
        </label>
        <textarea
          id="code"
          value={code}
          onChange={(e) => setInputs((prev) => ({ ...prev, code: e.target.value }))}
          rows={15}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Enter your Python code here..."
        />
        <p className="mt-1 text-xs text-slate-600">Max {contract?.limits.inputKb ?? 0}KB</p>
      </div>
    </div>
  );
}

export default function PythonPlaygroundPage() {
  const [statusText, setStatusText] = useState<string | null>(null);

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
    setStatusText("Loading Python runtime…");
    const result = await runPython(codeInput, contract, {
      onStatus: (phase, message) => {
        if (phase === "loading_runtime") setStatusText("Loading Python runtime… (first load can take ~10–30s)");
        else if (phase === "ready") setStatusText("Python runtime ready. Running…");
        else if (phase === "running") setStatusText("Running…");
        else setStatusText(message || null);
      },
    });
    setStatusText(null);
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

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples}>
        <PythonEditor statusText={statusText} />
      </ToolShell>
    </div>
  );
}
