"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("schema-inspector");

function parseSchema(schema: string) {
  // Try JSON schema first
  try {
    const json = JSON.parse(schema);
    if (json.type === "object" && json.properties) {
      return {
        type: "JSON Schema",
        entities: Object.keys(json.properties).map((key) => ({
          name: key,
          type: json.properties[key].type || "unknown",
          required: json.required?.includes(key) || false,
        })),
      };
    }
  } catch {
    // Not JSON, try SQL DDL
    const createTableMatch = schema.match(/CREATE TABLE\s+(\w+)\s*\(([^)]+)\)/i);
    if (createTableMatch) {
      const tableName = createTableMatch[1];
      const columns = createTableMatch[2]
        .split(",")
        .map((col) => {
          const parts = col.trim().split(/\s+/);
          return {
            name: parts[0],
            type: parts[1] || "unknown",
            constraints: parts.slice(2).join(" "),
          };
        });
      return {
        type: "SQL DDL",
        entities: [
          {
            name: tableName,
            columns,
          },
        ],
      };
    }
  }

  throw new Error("Unsupported schema format. Use JSON Schema or SQL DDL.");
}

export default function SchemaInspectorPage() {
  const [schema, setSchema] = useState("");

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const schemaInput = inputs.schema as string;
    if (!schemaInput || schemaInput.trim().length === 0) {
      return {
        success: false,
        error: createToolError("validation_error", "schema-inspector", { field: "schema" }),
      };
    }

    try {
      const parsed = parseSchema(schemaInput);
      return { success: true, output: JSON.stringify(parsed, null, 2) };
    } catch (err) {
      return {
        success: false,
        error: createToolError("parse_error", "schema-inspector", { message: err instanceof Error ? err.message : String(err) }),
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

      <ToolShell contract={contract} onRun={handleRun} initialInputs={{ schema }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="schema" className="block text-sm font-semibold text-slate-900">
              Schema (JSON Schema or SQL DDL)
            </label>
            <textarea
              id="schema"
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              rows={15}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Paste JSON Schema or SQL DDL..."
            />
            <p className="mt-1 text-xs text-slate-600">Max 20KB</p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

