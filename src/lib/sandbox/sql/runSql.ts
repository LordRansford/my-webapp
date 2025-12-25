/**
 * SQL Sandbox Runner (sql.js)
 * 
 * Runs SQL queries in a Web Worker using sql.js (SQLite compiled to WASM).
 * Secure sandbox: no file system access, in-memory database only.
 */

import type { ToolContract } from "@/components/tools/ToolShell";

export interface SqlRunResult {
  success: boolean;
  output?: {
    rows: unknown[][];
    columns: string[];
    rowCount: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function runSql(
  query: string,
  contract: ToolContract
): Promise<SqlRunResult> {
  // Validate input size
  const inputKb = new Blob([query]).size / 1024;
  if (inputKb > contract.limits.inputKb) {
    return {
      success: false,
      error: {
        code: "input_too_large",
        message: `Input exceeds ${contract.limits.inputKb}KB limit`,
      },
    };
  }

  return new Promise((resolve) => {
    // Use a static worker file instead of blob URL
    const worker = new Worker('/sql-worker.js');

    const timeout = setTimeout(() => {
      worker.terminate();
      resolve({
        success: false,
        error: {
          code: "timeout",
          message: `Execution exceeded ${contract.limits.wallMs}ms limit`,
        },
      });
    }, contract.limits.wallMs);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      
      const response = e.data;
      if (response.success) {
        resolve({
          success: true,
          output: {
            rows: response.rows || [],
            columns: response.columns || [],
            rowCount: response.rowCount || 0,
          },
        });
      } else {
        resolve({
          success: false,
          error: response.error || {
            code: "unknown_error",
            message: "Query execution failed",
          },
        });
      }
    };

    worker.onerror = (err) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve({
        success: false,
        error: {
          code: "worker_error",
          message: err.message || "Worker execution failed. sql.js may not be loading correctly.",
        },
      });
    };

    worker.postMessage({
      query,
      timeoutMs: contract.limits.cpuMs,
      maxOutputKb: contract.limits.outputKb,
      maxRows: 1000,
    });
  });
}
