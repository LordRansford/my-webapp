/**
 * Unified Tool Runner
 * 
 * Single interface for executing all tools with consistent error handling,
 * validation, and result formatting.
 */

import type { ToolContract } from "@/components/tools/ToolShell";
import { runJs } from "@/lib/sandbox/js/runJs";
import { runPython } from "@/lib/sandbox/python/runPython";
import { runSql } from "@/lib/sandbox/sql/runSql";
import type { ToolError } from "@/components/tools/ErrorPanel";

export interface ToolRunResult {
  ok: boolean;
  output?: string;
  warnings?: string[];
  metrics?: {
    durationMs: number;
    cpuMs: number;
    memoryMb: number;
  };
  error?: {
    code: string;
    message: string;
    whatToDo: string;
    debugId: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate inputs against tool contract
 */
export function validateInputs(
  contract: ToolContract,
  inputs: Record<string, unknown>
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!contract.inputs || contract.inputs.length === 0) {
    return { valid: true, errors: [] };
  }

  for (const inputDef of contract.inputs) {
    const value = inputs[inputDef.name];
    const isRequired = inputDef.required !== false;

    // Check required
    if (isRequired && (value === undefined || value === null || value === "")) {
      errors.push({
        field: inputDef.name,
        message: `${inputDef.name} is required`,
      });
      continue;
    }

    // Skip validation if value is empty and not required
    if (value === undefined || value === null || value === "") {
      continue;
    }

    // Type validation
    switch (inputDef.type) {
      case "string":
        if (typeof value !== "string") {
          errors.push({
            field: inputDef.name,
            message: `${inputDef.name} must be a string`,
          });
        } else {
          // Check limits from limits string (e.g., "max 10KB")
          const maxKbMatch = inputDef.limits.match(/max\s+(\d+)\s*kb/i);
          if (maxKbMatch) {
            const maxBytes = parseInt(maxKbMatch[1]) * 1024;
            if (new Blob([value]).size > maxBytes) {
              errors.push({
                field: inputDef.name,
                message: `${inputDef.name} exceeds ${maxKbMatch[1]}KB limit`,
              });
            }
          }
        }
        break;
      case "number":
        if (typeof value !== "number" || isNaN(value)) {
          errors.push({
            field: inputDef.name,
            message: `${inputDef.name} must be a number`,
          });
        }
        break;
      case "boolean":
        if (typeof value !== "boolean") {
          errors.push({
            field: inputDef.name,
            message: `${inputDef.name} must be a boolean`,
          });
        }
        break;
      case "array":
        if (!Array.isArray(value)) {
          errors.push({
            field: inputDef.name,
            message: `${inputDef.name} must be an array`,
          });
        }
        break;
      case "enum":
        if (typeof value !== "string") {
          errors.push({
            field: inputDef.name,
            message: `${inputDef.name} must be a string`,
          });
        } else {
          const allowedValues = inputDef.limits.split("|");
          if (!allowedValues.includes(value)) {
            errors.push({
              field: inputDef.name,
              message: `${inputDef.name} must be one of: ${allowedValues.join(", ")}`,
            });
          }
        }
        break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Run a tool with unified interface
 */
export async function runTool(
  contract: ToolContract,
  mode: "local" | "compute",
  inputs: Record<string, unknown>
): Promise<ToolRunResult> {
  const debugId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // Validate inputs
    const validation = validateInputs(contract, inputs);
    if (!validation.valid) {
      return {
        ok: false,
        error: {
          code: "validation_error",
          message: `Input validation failed: ${validation.errors.map((e) => e.message).join(", ")}`,
          whatToDo: `Fix these fields: ${validation.errors.map((e) => e.field).join(", ")}`,
          debugId,
        },
      };
    }

    // Route to appropriate executor
    if (mode === "compute") {
      // Compute mode - call API
      try {
        const res = await fetch("/api/tools/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId: contract.id, mode, inputs }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          return {
            ok: false,
            error: {
              code: errorData.error?.code || "compute_error",
              message: errorData.error?.message || "Compute execution failed",
              whatToDo: errorData.error?.fixSuggestion || "Try using Local mode instead",
              debugId,
            },
          };
        }

        const data = await res.json();
        if (data.success) {
          const duration = Date.now() - startTime;
          return {
            ok: true,
            output: typeof data.output === "string" ? data.output : JSON.stringify(data.output, null, 2),
            metrics: {
              durationMs: duration,
              cpuMs: duration,
              memoryMb: 0,
            },
          };
        } else {
          return {
            ok: false,
            error: {
              code: data.error?.code || "compute_error",
              message: data.error?.message || "Execution failed",
              whatToDo: data.error?.fixSuggestion || "Check your inputs and try again",
              debugId,
            },
          };
        }
      } catch (err) {
        return {
          ok: false,
          error: {
            code: "network_error",
            message: err instanceof Error ? err.message : "Network request failed",
            whatToDo: "Check your connection and try again, or use Local mode",
            debugId,
          },
        };
      }
    }

    // Local mode - route to appropriate sandbox
    let result: { success: boolean; output?: string | { result?: string; stdout?: string[] } | { rows: unknown[][]; columns: string[]; rowCount: number }; error?: { code: string; message: string } };

    if (contract.id === "js-sandbox" || contract.id === "javascript-sandbox" || contract.route.includes("js-sandbox")) {
      const code = inputs.code as string;
      if (!code || typeof code !== "string") {
        return {
          ok: false,
          error: {
            code: "validation_error",
            message: "Code input is required",
            whatToDo: "Enter JavaScript code to execute",
            debugId,
          },
        };
      }
      const jsResult = await runJs(code, contract);
      if (jsResult.success && jsResult.output) {
        const outputObj = jsResult.output;
        let outputStr: string;
        if (typeof outputObj === "string") {
          outputStr = outputObj;
        } else if (outputObj && typeof outputObj === "object") {
          outputStr = outputObj.result || (Array.isArray(outputObj.stdout) ? outputObj.stdout.join("\n") : JSON.stringify(outputObj, null, 2));
        } else {
          outputStr = String(outputObj);
        }
        return {
          ok: true,
          output: outputStr,
          metrics: {
            durationMs: Date.now() - startTime,
            cpuMs: Date.now() - startTime,
            memoryMb: 0,
          },
        };
      } else {
        return {
          ok: false,
          error: {
            code: jsResult.error?.code || "execution_error",
            message: jsResult.error?.message || "Execution failed",
            whatToDo: "Check your code for syntax errors",
            debugId,
          },
        };
      }
    } else if (contract.id === "python-playground" || contract.route.includes("python-playground")) {
      const code = inputs.code as string;
      if (!code || typeof code !== "string") {
        return {
          ok: false,
          error: {
            code: "validation_error",
            message: "Code input is required",
            whatToDo: "Enter Python code to execute",
            debugId,
          },
        };
      }
      const pythonResult = await runPython(code, contract);
      if (pythonResult.success && pythonResult.output) {
        const outputObj = pythonResult.output;
        let outputStr: string;
        if (typeof outputObj === "string") {
          outputStr = outputObj;
        } else if (outputObj && typeof outputObj === "object") {
          outputStr = outputObj.result || (Array.isArray(outputObj.stdout) ? outputObj.stdout.join("\n") : JSON.stringify(outputObj, null, 2));
        } else {
          outputStr = String(outputObj);
        }
        return {
          ok: true,
          output: outputStr,
          metrics: {
            durationMs: Date.now() - startTime,
            cpuMs: Date.now() - startTime,
            memoryMb: 0,
          },
        };
      } else {
        return {
          ok: false,
          error: {
            code: pythonResult.error?.code || "execution_error",
            message: pythonResult.error?.message || "Execution failed",
            whatToDo: "Check your code for syntax errors or install Pyodide",
            debugId,
          },
        };
      }
    } else if (contract.id === "sql-sqlite" || contract.id === "sql-sandbox" || contract.route.includes("sql-sandbox")) {
      const query = inputs.query as string;
      if (!query || typeof query !== "string") {
        return {
          ok: false,
          error: {
            code: "validation_error",
            message: "Query input is required",
            whatToDo: "Enter a SQL query to execute",
            debugId,
          },
        };
      }
      const sqlResult = await runSql(query, contract);
      if (sqlResult.success && sqlResult.output) {
        return {
          ok: true,
          output: JSON.stringify(sqlResult.output, null, 2),
          metrics: {
            durationMs: Date.now() - startTime,
            cpuMs: Date.now() - startTime,
            memoryMb: 0,
          },
        };
      } else {
        return {
          ok: false,
          error: {
            code: sqlResult.error?.code || "execution_error",
            message: sqlResult.error?.message || "Query execution failed",
            whatToDo: "Check your SQL syntax and try again",
            debugId,
          },
        };
      }
    } else {
      // For other tools, they should implement their own execution
      // This is a fallback
      return {
        ok: false,
        error: {
          code: "not_implemented",
          message: `Local execution not implemented for ${contract.id}`,
          whatToDo: "This tool may require compute mode or needs implementation",
          debugId,
        },
      };
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    return {
      ok: false,
      error: {
        code: "runtime_error",
        message: err instanceof Error ? err.message : "Unexpected error",
        whatToDo: "Try refreshing the page or contact support",
        debugId,
      },
      metrics: {
        durationMs: duration,
        cpuMs: duration,
        memoryMb: 0,
      },
    };
  }
}

