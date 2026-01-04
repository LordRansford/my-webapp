"use client";

import React from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("architecture-tradeoff-analysis");

const examples = [
  {
    title: "Database Choice: SQL vs NoSQL",
    inputs: {
      options: [
        "PostgreSQL (SQL database)",
        "MongoDB (NoSQL document store)",
        "DynamoDB (NoSQL key-value store)",
      ],
      constraints: [
        "Must support complex queries",
        "Must scale to 1M+ records",
        "Team has strong SQL experience",
        "Must support ACID transactions",
      ],
      criteria: [
        "Query flexibility",
        "Scalability",
        "Team expertise",
        "Consistency guarantees",
        "Cost",
        "Operational complexity",
      ],
    },
  },
  {
    title: "Deployment Strategy",
    inputs: {
      options: [
        "Blue-green deployment",
        "Canary deployment",
        "Rolling deployment",
      ],
      constraints: [
        "Zero downtime required",
        "Limited infrastructure capacity",
        "Must support instant rollback",
      ],
      criteria: [
        "Deployment speed",
        "Risk mitigation",
        "Resource efficiency",
        "Rollback speed",
        "Complexity",
        "Cost",
      ],
    },
  },
  {
    title: "Caching Strategy",
    inputs: {
      options: [
        "In-memory cache (Redis)",
        "CDN edge caching",
        "Application-level caching",
      ],
      constraints: [
        "Must reduce database load",
        "Global user base",
        "Budget limited",
      ],
      criteria: [
        "Performance improvement",
        "Cost",
        "Complexity",
        "Global coverage",
        "Cache invalidation complexity",
        "Maintenance overhead",
      ],
    },
  },
];

function ArchitectureTradeoffForm() {
  const { inputs, setInputs } = useToolInputs();
  const options = Array.isArray(inputs.options) ? (inputs.options as string[]) : ["", ""];
  const constraints = Array.isArray(inputs.constraints) ? (inputs.constraints as string[]) : [""];
  const criteria = Array.isArray(inputs.criteria) ? (inputs.criteria as string[]) : ["", "", "", "", "", ""];

  const updateArray = (key: "options" | "constraints" | "criteria", index: number, value: string) => {
    setInputs((prev) => {
      const arr = Array.isArray(prev[key]) ? ([...(prev[key] as string[])] as string[]) : [];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addItem = (key: "options" | "constraints" | "criteria", max: number, blank: string = "") => {
    setInputs((prev) => {
      const arr = Array.isArray(prev[key]) ? ([...(prev[key] as string[])] as string[]) : [];
      if (arr.length < max) arr.push(blank);
      return { ...prev, [key]: arr };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Options (2-3)</label>
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            value={opt}
            onChange={(e) => updateArray("options", idx, e.target.value)}
            maxLength={1000}
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={`Option ${idx + 1}`}
          />
        ))}
        {options.length < 3 && (
          <button type="button" onClick={() => addItem("options", 3)} className="mt-2 text-xs text-slate-600 underline">
            + Add Option
          </button>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Constraints (max 20)</label>
        {constraints.map((c, idx) => (
          <input
            key={idx}
            type="text"
            value={c}
            onChange={(e) => updateArray("constraints", idx, e.target.value)}
            maxLength={200}
            className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={`Constraint ${idx + 1}`}
          />
        ))}
        {constraints.length < 20 && (
          <button type="button" onClick={() => addItem("constraints", 20)} className="mt-2 text-xs text-slate-600 underline">
            + Add Constraint
          </button>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Criteria (6-10)</label>
        {criteria.map((c, idx) => (
          <input
            key={idx}
            type="text"
            value={c}
            onChange={(e) => updateArray("criteria", idx, e.target.value)}
            maxLength={500}
            className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder={`Criterion ${idx + 1}`}
          />
        ))}
        {criteria.length < 10 && (
          <button type="button" onClick={() => addItem("criteria", 10)} className="mt-2 text-xs text-slate-600 underline">
            + Add Criterion
          </button>
        )}
      </div>
    </div>
  );
}

export default function ArchitectureTradeoffAnalysisPage() {
  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const opts = inputs.options as string[];
    const consts = inputs.constraints as string[];
    const crits = inputs.criteria as string[];

    const validOptions = opts.filter((o) => o.trim().length > 0);
    if (validOptions.length < 2 || validOptions.length > 3) {
      return {
        success: false,
        error: createToolError("too_many_options", "architecture-tradeoff-analysis", { message: "Must have 2-3 options" }),
      };
    }

    const validCriteria = crits.filter((c) => c.trim().length > 0);
    if (validCriteria.length < 6 || validCriteria.length > 10) {
      return {
        success: false,
        error: createToolError("missing_criteria", "architecture-tradeoff-analysis", { message: "Must have 6-10 criteria" }),
      };
    }

    // Generate trade-off table
    const table = validOptions.map((opt) => ({
      option: opt,
      criteria: validCriteria.map((c) => ({ criterion: c, score: "N/A", notes: "" })),
    }));

    const result = {
      options: validOptions,
      constraints: consts.filter((c) => c.trim().length > 0),
      criteria: validCriteria,
      tradeoffTable: table,
      recommendation: "Review each option against criteria and document trade-offs",
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
        <ArchitectureTradeoffForm />
      </ToolShell>
    </div>
  );
}

