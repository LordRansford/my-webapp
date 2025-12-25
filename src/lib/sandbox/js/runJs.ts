/**
 * JavaScript Sandbox Runner
 * 
 * Runs JavaScript code in a Web Worker with strict limits.
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
    // Create worker from inline code (Next.js will handle bundling)
    const workerCode = `
      ${runJsWorkerCode}
    `;
    
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const timeout = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
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
      URL.revokeObjectURL(workerUrl);
      
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
      URL.revokeObjectURL(workerUrl);
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

// Inline worker code (will be bundled)
const runJsWorkerCode = `
  const stdout = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => {
    stdout.push(args.map(a => String(a)).join(' '));
    originalLog.apply(console, args);
  };

  console.error = (...args) => {
    stdout.push('ERROR: ' + args.map(a => String(a)).join(' '));
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    stdout.push('WARN: ' + args.map(a => String(a)).join(' '));
    originalWarn.apply(console, args);
  };

  globalThis.fetch = () => {
    throw new Error('Network access is not allowed in the sandbox');
  };

  class BlockedXHR {
    open() { throw new Error('Network access is not allowed'); }
    send() { throw new Error('Network access is not allowed'); }
  }
  globalThis.XMLHttpRequest = BlockedXHR;

  function truncateOutput(output, maxKb) {
    const maxBytes = maxKb * 1024;
    if (output.length <= maxBytes) return output;
    return output.slice(0, maxBytes) + '\\n... (truncated, max ' + maxKb + 'KB)';
  }

  self.onmessage = async (e) => {
    const { code, timeoutMs, maxOutputKb } = e.data;
    stdout.length = 0;

    const timeoutId = setTimeout(() => {
      self.postMessage({
        success: false,
        stdout: stdout.slice(),
        error: { code: 'timeout', message: 'Execution exceeded ' + timeoutMs + 'ms limit' }
      });
      self.close();
    }, timeoutMs);

    try {
      const func = new Function('"use strict"; ' + code + '; return typeof result !== "undefined" ? result : undefined;');
      const result = func();
      clearTimeout(timeoutId);

      const resultStr = result !== undefined ? String(result) : '';
      const stdoutStr = stdout.join('\\n');
      const fullOutput = stdoutStr + (resultStr ? '\\n' + resultStr : '');
      const truncatedOutput = truncateOutput(fullOutput, maxOutputKb);

      self.postMessage({
        success: true,
        stdout: stdout.slice(),
        result: truncatedOutput
      });
    } catch (err) {
      clearTimeout(timeoutId);
      const error = err instanceof Error ? err : new Error(String(err));
      const isSyntaxError = error.message.includes('SyntaxError') || error.name === 'SyntaxError';

      self.postMessage({
        success: false,
        stdout: stdout.slice(),
        error: {
          code: isSyntaxError ? 'syntax_error' : 'runtime_error',
          message: error.message
        }
      });
    }
  };
`;

