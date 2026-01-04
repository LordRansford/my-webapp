"use client";

import React from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("logic-gates");

const examples = [
  {
    title: "AND Gate",
    inputs: { gateType: "AND", inputA: true, inputB: true },
  },
  {
    title: "OR Gate",
    inputs: { gateType: "OR", inputA: false, inputB: true },
  },
  {
    title: "XOR Gate",
    inputs: { gateType: "XOR", inputA: true, inputB: false },
  },
];

function computeGate(gateType: string, a: boolean, b: boolean): boolean {
  switch (gateType) {
    case "AND":
      return a && b;
    case "OR":
      return a || b;
    case "XOR":
      return a !== b;
    default:
      throw new Error(`Unknown gate type: ${gateType}`);
  }
}

function generateTruthTable(gateType: string): Array<{ a: boolean; b: boolean; output: boolean }> {
  const combinations = [
    { a: false, b: false },
    { a: false, b: true },
    { a: true, b: false },
    { a: true, b: true },
  ];
  return combinations.map(({ a, b }) => ({
    a,
    b,
    output: computeGate(gateType, a, b),
  }));
}

function LogicGatesForm() {
  const { inputs, setInputs } = useToolInputs();
  const gateType = (inputs.gateType as "AND" | "OR" | "XOR") || "AND";
  const inputA = Boolean(inputs.inputA);
  const inputB = Boolean(inputs.inputB);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="gateType" className="block text-sm font-semibold text-slate-900">
          Gate Type
        </label>
        <select
          id="gateType"
          value={gateType}
          onChange={(e) => setInputs((prev) => ({ ...prev, gateType: e.target.value }))}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
          <option value="XOR">XOR</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="inputA" className="block text-sm font-semibold text-slate-900">
            Input A
          </label>
          <select
            id="inputA"
            value={inputA ? "1" : "0"}
            onChange={(e) => setInputs((prev) => ({ ...prev, inputA: e.target.value === "1" }))}
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="0">0 (False)</option>
            <option value="1">1 (True)</option>
          </select>
        </div>
        <div>
          <label htmlFor="inputB" className="block text-sm font-semibold text-slate-900">
            Input B
          </label>
          <select
            id="inputB"
            value={inputB ? "1" : "0"}
            onChange={(e) => setInputs((prev) => ({ ...prev, inputB: e.target.value === "1" }))}
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="0">0 (False)</option>
            <option value="1">1 (True)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function LogicGatesPage() {
  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const gate = inputs.gateType as string;
    const a = Boolean(inputs.inputA);
    const b = Boolean(inputs.inputB);

    if (!["AND", "OR", "XOR"].includes(gate)) {
      return {
        success: false,
        error: createToolError("invalid_input", "logic-gates", { message: "Gate type must be AND, OR, or XOR" }),
      };
    }

    try {
      const output = computeGate(gate, a, b);
      const truthTable = generateTruthTable(gate);
      const result = {
        gateType: gate,
        inputA: a,
        inputB: b,
        output,
        truthTable,
      };
      return { success: true, output: JSON.stringify(result, null, 2) };
    } catch (err) {
      return {
        success: false,
        error: createToolError("runtime_error", "logic-gates", { message: err instanceof Error ? err.message : String(err) }),
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
        <LogicGatesForm />
      </ToolShell>
    </div>
  );
}

