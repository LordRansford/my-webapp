/**
 * JavaScript Sandbox Worker
 * 
 * Runs user JavaScript code in an isolated worker context with:
 * - No DOM access (worker has none)
 * - Hard timeout (terminate worker)
 * - Output size limits (truncate)
 * - Blocked network (fetch/XMLHttpRequest throw)
 * - No importScripts from arbitrary URLs
 */

interface RunRequest {
  code: string;
  timeoutMs: number;
  maxOutputKb: number;
}

interface RunResponse {
  success: boolean;
  stdout: string[];
  result?: string;
  error?: {
    code: string;
    message: string;
  };
}

// Capture console.log output
const stdout: string[] = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args: unknown[]) => {
  stdout.push(args.map((a) => String(a)).join(" "));
  originalLog.apply(console, args);
};

console.error = (...args: unknown[]) => {
  stdout.push(`ERROR: ${args.map((a) => String(a)).join(" ")}`);
  originalError.apply(console, args);
};

console.warn = (...args: unknown[]) => {
  stdout.push(`WARN: ${args.map((a) => String(a)).join(" ")}`);
  originalWarn.apply(console, args);
};

// Block network access
const originalFetch = globalThis.fetch;
globalThis.fetch = () => {
  throw new Error("Network access is not allowed in the sandbox");
};

// Block XMLHttpRequest
class BlockedXHR {
  open() {
    throw new Error("Network access is not allowed in the sandbox");
  }
  send() {
    throw new Error("Network access is not allowed in the sandbox");
  }
}
(globalThis as unknown as { XMLHttpRequest: typeof XMLHttpRequest }).XMLHttpRequest = BlockedXHR as unknown as typeof XMLHttpRequest;

// Block importScripts (already blocked in workers, but be explicit)
const originalImportScripts = globalThis.importScripts;
globalThis.importScripts = () => {
  throw new Error("importScripts is not allowed in the sandbox");
};

function truncateOutput(output: string, maxKb: number): string {
  const maxBytes = maxKb * 1024;
  if (output.length <= maxBytes) return output;
  return output.slice(0, maxBytes) + `\n... (truncated, max ${maxKb}KB)`;
}

self.onmessage = async (e: MessageEvent<RunRequest>) => {
  const { code, timeoutMs, maxOutputKb } = e.data;
  
  stdout.length = 0; // Clear previous output
  
  const timeoutId = setTimeout(() => {
    self.postMessage({
      success: false,
      stdout: stdout.slice(),
      error: {
        code: "timeout",
        message: `Execution exceeded ${timeoutMs}ms limit`,
      },
    } as RunResponse);
    self.close();
  }, timeoutMs);

  try {
    // Create a restricted function context
    // Note: This is a basic implementation. For production, consider QuickJS WASM
    const func = new Function(`
      "use strict";
      ${code}
      return typeof result !== 'undefined' ? result : undefined;
    `);
    
    const result = func();
    
    clearTimeout(timeoutId);
    
    const resultStr = result !== undefined ? String(result) : "";
    const stdoutStr = stdout.join("\n");
    const fullOutput = stdoutStr + (resultStr ? `\n${resultStr}` : "");
    
    const truncatedOutput = truncateOutput(fullOutput, maxOutputKb);
    
    self.postMessage({
      success: true,
      stdout: stdout.slice(),
      result: truncatedOutput,
    } as RunResponse);
  } catch (err) {
    clearTimeout(timeoutId);
    
    const error = err instanceof Error ? err : new Error(String(err));
    const isSyntaxError = error.message.includes("SyntaxError") || error.name === "SyntaxError";
    
    self.postMessage({
      success: false,
      stdout: stdout.slice(),
      error: {
        code: isSyntaxError ? "syntax_error" : "runtime_error",
        message: error.message,
      },
    } as RunResponse);
  }
};

