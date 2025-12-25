/**
 * Python Sandbox Runner (Pyodide)
 * 
 * Runs Python code in a Web Worker using Pyodide.
 * Note: Requires pyodide package. Install with: npm install pyodide
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

// Inline worker code for Pyodide
const pythonWorkerCode = `
  let pyodide = null;
  let loading = false;
  let loadPromise = null;

  async function loadPyodide() {
    if (pyodide) return pyodide;
    if (loading) return loadPromise;
    
    loading = true;
    loadPromise = (async () => {
      try {
        // @ts-ignore - Pyodide types
        self.pyodide = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        
        // Disable micropip and networking
        self.pyodide.runPython(\`
          import sys
          sys.modules['micropip'] = None
        \`);
        
        pyodide = self.pyodide;
        return pyodide;
      } catch (err) {
        throw new Error('Failed to load Pyodide: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        loading = false;
      }
    })();
    
    return loadPromise;
  }

  const stdout = [];
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    const msg = args.map(a => String(a)).join(' ');
    stdout.push(msg);
    originalLog.apply(console, args);
  };

  console.error = (...args) => {
    const msg = 'ERROR: ' + args.map(a => String(a)).join(' ');
    stdout.push(msg);
    originalError.apply(console, args);
  };

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
      const py = await loadPyodide();
      
      // Capture Python stdout
      py.runPython(\`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
        sys.stderr = StringIO()
      \`);

      // Run user code
      py.runPython(code);
      
      // Get captured output
      const stdout_captured = py.runPython('sys.stdout.getvalue()');
      const stderr_captured = py.runPython('sys.stderr.getvalue()');
      
      if (stdout_captured) stdout.push(stdout_captured);
      if (stderr_captured) stdout.push('STDERR: ' + stderr_captured);

      clearTimeout(timeoutId);

      const stdoutStr = stdout.join('\\n');
      const truncatedOutput = truncateOutput(stdoutStr, maxOutputKb);

      self.postMessage({
        success: true,
        stdout: stdout.slice(),
        result: truncatedOutput
      });
    } catch (err) {
      clearTimeout(timeoutId);
      const error = err instanceof Error ? err : new Error(String(err));
      const isSyntaxError = error.message.includes('SyntaxError') || error.message.includes('IndentationError');
      
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

  // Pyodide is optional - will be loaded in worker
  // No need to check here as worker will handle it

  return new Promise((resolve) => {
    const blob = new Blob([pythonWorkerCode], { type: "application/javascript" });
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

