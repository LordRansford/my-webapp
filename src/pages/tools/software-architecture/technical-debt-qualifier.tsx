"use client";

import React from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("technical-debt-qualifier");

const examples = [
  {
    title: "Legacy Authentication Code",
    inputs: {
      debtItem: "Authentication system uses deprecated SHA-1 hashing instead of bcrypt/Argon2",
      impact: "High",
      urgency: "High",
      cost: "Medium",
    },
  },
  {
    title: "Monolithic Architecture",
    inputs: {
      debtItem: "Entire application is a monolith, making deployments risky and scaling difficult",
      impact: "High",
      urgency: "Medium",
      cost: "High",
    },
  },
  {
    title: "Outdated Dependencies",
    inputs: {
      debtItem: "Several npm packages are 2+ years out of date with known security vulnerabilities",
      impact: "Medium",
      urgency: "High",
      cost: "Low",
    },
  },
];

function TechnicalDebtForm() {
  const { inputs, setInputs } = useToolInputs();
  const debtItem = typeof inputs.debtItem === "string" ? inputs.debtItem : "";
  const impact = (inputs.impact as "High" | "Medium" | "Low") || "Medium";
  const urgency = (inputs.urgency as "High" | "Medium" | "Low") || "Medium";
  const cost = (inputs.cost as "High" | "Medium" | "Low") || "Medium";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="debtItem" className="block text-sm font-semibold text-slate-900">
          Technical Debt Item <span className="text-red-600">*</span>
        </label>
        <textarea
          id="debtItem"
          value={debtItem}
          onChange={(e) => setInputs((prev) => ({ ...prev, debtItem: e.target.value }))}
          rows={3}
          maxLength={500}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Describe the technical debt..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="impact" className="block text-sm font-semibold text-slate-900">
            Impact
          </label>
          <select
            id="impact"
            value={impact}
            onChange={(e) => setInputs((prev) => ({ ...prev, impact: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="urgency" className="block text-sm font-semibold text-slate-900">
            Urgency
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setInputs((prev) => ({ ...prev, urgency: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="cost" className="block text-sm font-semibold text-slate-900">
            Cost to Fix
          </label>
          <select
            id="cost"
            value={cost}
            onChange={(e) => setInputs((prev) => ({ ...prev, cost: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function TechnicalDebtQualifierPage() {
  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const item = inputs.debtItem as string;
    const imp = inputs.impact as string;
    const urg = inputs.urgency as string;
    const cst = inputs.cost as string;

    if (!item || item.trim().length === 0) {
      return {
        success: false,
        error: createToolError("validation_error", "technical-debt-qualifier", { field: "debtItem" }),
      };
    }

    const priorityMap = { Low: 1, Medium: 2, High: 3 };
    const priorityScore = priorityMap[imp as keyof typeof priorityMap] * priorityMap[urg as keyof typeof priorityMap];
    const priority = priorityScore >= 6 ? "Critical" : priorityScore >= 4 ? "High" : priorityScore >= 2 ? "Medium" : "Low";

    const result = {
      debtItem: item,
      impact: imp,
      urgency: urg,
      cost: cst,
      priority,
      priorityScore,
      recommendation: priority === "Critical" 
        ? "Address immediately" 
        : priority === "High" 
        ? "Plan for next sprint" 
        : priority === "Medium"
        ? "Include in backlog"
        : "Monitor and reassess",
    };

    return { success: true, output: JSON.stringify(result, null, 2) };
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples}>
        <TechnicalDebtForm />
      </ToolShell>
    </div>
  );
}

