/**
 * JavaScript Sandbox Runner
 * 
 * Runs JavaScript code in a Web Worker with strict limits.
 * Secure sandbox: no DOM access, no network access.
 */

import type { ToolContract } from "@/components/tools/ToolShell";

export interface JsRunResult {
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

export async function runJs(
  code: string,
  contract: ToolContract
): Promise<JsRunResult> {
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
    // Use a static worker file instead of blob URL
    const worker = new Worker('/js-worker.js');

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
          error: response.error,
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
          message: err.message || "Worker execution failed",
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
