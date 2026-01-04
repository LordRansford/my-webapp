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

type PythonWorkerMessage =
  | { type: "status"; requestId: string; phase: string; message?: string }
  | {
      type: "result";
      requestId: string;
      success: boolean;
      stdout?: string[];
      result?: string;
      error?: { code: string; message: string };
    };

let sharedWorker: Worker | null = null;
let sharedWorkerBusy = false;

function createPyWorker(): Worker {
  // Use a static worker file instead of blob URL to avoid importScripts issues.
  // The worker file is served from /pyodide-worker.js
  return new Worker("/pyodide-worker.js");
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
    // Reuse a shared worker so Pyodide only needs to load once per session.
    // If a run is already in-flight, fall back to a one-off worker to avoid cross-talk.
    const useShared = !sharedWorkerBusy;
    const worker = useShared ? (sharedWorker ?? (sharedWorker = createPyWorker())) : createPyWorker();
    if (useShared) sharedWorkerBusy = true;

    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

    const timeout = setTimeout(() => {
      worker.terminate();
      if (useShared) {
        sharedWorker = null;
        sharedWorkerBusy = false;
      }
      resolve({
        success: false,
        error: {
          code: "timeout",
          message: `Execution exceeded ${contract.limits.wallMs}ms limit`,
        },
      });
    }, contract.limits.wallMs);

    worker.onmessage = (e) => {
      const msg = e.data as PythonWorkerMessage;
      if (!msg || typeof msg !== "object" || msg.requestId !== requestId) return;

      if (msg.type === "status") {
        // Intentionally do not resolve; this lets the UI stay responsive while Pyodide loads.
        return;
      }

      if (msg.type !== "result") return;

      clearTimeout(timeout);
      if (!useShared) worker.terminate();
      if (useShared) sharedWorkerBusy = false;

      if (msg.success) {
        resolve({
          success: true,
          output: {
            stdout: msg.stdout || [],
            result: msg.result || "",
          },
        });
        return;
      }

      resolve({
        success: false,
        error: msg.error || {
          code: "unknown_error",
          message: "Execution failed",
        },
      });
    };

    worker.onerror = (err) => {
      clearTimeout(timeout);
      worker.terminate();
      if (useShared) {
        sharedWorker = null;
        sharedWorkerBusy = false;
      }
      
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
      requestId,
      code,
      timeoutMs: contract.limits.cpuMs,
      maxOutputKb: contract.limits.outputKb,
    });
  });
}
