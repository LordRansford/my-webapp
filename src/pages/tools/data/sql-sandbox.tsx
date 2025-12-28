"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { runSql } from "@/lib/sandbox/sql/runSql";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("sql-sqlite");

const examples = [
  {
    title: "Select All Users",
    inputs: { query: "SELECT * FROM users;" },
  },
  {
    title: "Join Query",
    inputs: {
      query: `SELECT u.name, o.amount 
FROM users u
JOIN orders o ON u.id = o.user_id;`,
    },
  },
  {
    title: "Aggregation",
    inputs: {
      query: `SELECT u.name, SUM(o.amount) as total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;`,
    },
  },
  {
    title: "Filter and Sort",
    inputs: {
      query: `SELECT name, email 
FROM users 
WHERE created_at > '2024-01-01'
ORDER BY name ASC
LIMIT 10;`,
    },
  },
];

export default function SqlSandboxPage() {
  const [query, setQuery] = useState("SELECT * FROM users;");

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const queryInput = inputs.query as string;
    if (!queryInput || typeof queryInput !== "string") {
      return {
        success: false,
        error: createToolError("validation_error", "sql-sqlite", { field: "query" }),
      };
    }

    if (mode === "compute") {
      try {
        const res = await fetch("/api/tools/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId: "sql-sqlite", mode, inputs }),
        });
        const data = await res.json();
        if (data.success) {
          return { success: true, output: data.output };
        } else {
          return { success: false, error: createToolError(data.error.code, "sql-sqlite", data.error) };
        }
      } catch (err) {
        return {
          success: false,
          error: createToolError("runtime_error", "sql-sqlite", { message: err instanceof Error ? err.message : String(err) }),
        };
      }
    }

    // Local mode
    const result = await runSql(queryInput, contract);
    if (result.success && result.output) {
      // Format SQL results nicely
      const formatted = {
        columns: result.output.columns,
        rows: result.output.rows,
        rowCount: result.output.rowCount,
      };
      return { success: true, output: JSON.stringify(formatted, null, 2) };
    } else {
      return {
        success: false,
        error: result.error ? createToolError(result.error.code, "sql-sqlite", result.error) : createToolError("query_error", "sql-sqlite"),
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

      <ToolShell contract={contract} onRun={handleRun} examples={examples} initialInputs={{ query }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-semibold text-slate-900">
              SQL Query
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={10}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter your SQL query here..."
            />
            <p className="mt-1 text-xs text-slate-600">Max {contract.limits.inputKb}KB. Sample tables: users, orders</p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}
