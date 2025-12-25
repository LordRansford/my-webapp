/**
 * Python Sandbox Runner (Pyodide)
 * 
 * Runs Python code in a Web Worker using Pyodide.
 * Secure sandbox: no file system, no network access.
 */

import type { ToolContract } from "@/components/tools/ToolShell";

export interface PythonRunResult {
  success: boolean;
  output?: {
    stdout: string[];
    result: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function runPython(
  code: string,
  contract: ToolContract
): Promise<PythonRunResult> {
  // Validate input size
  const inputKb = new Blob([code]).size / 1024;
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
    // Use a static worker file instead of blob URL to avoid importScripts issues
    // The worker file is served from /pyodide-worker.js
    const worker = new Worker('/pyodide-worker.js');

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
            stdout: response.stdout || [],
            result: response.result || "",
          },
        });
      } else {
        resolve({
          success: false,
          error: response.error || {
            code: "unknown_error",
            message: "Execution failed",
          },
        });
      }
    };

    worker.onerror = (err) => {
      clearTimeout(timeout);
      worker.terminate();
      
      const errorMsg = err.message || "Worker execution failed";
      resolve({
        success: false,
        error: {
          code: "worker_error",
          message: errorMsg + ". Pyodide worker may have failed to load. Check browser console.",
        },
      });
    };

    worker.postMessage({
      code,
      timeoutMs: contract.limits.cpuMs,
      maxOutputKb: contract.limits.outputKb,
    });
  });
}
