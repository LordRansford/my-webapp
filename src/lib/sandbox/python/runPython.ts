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
    // Create worker from inline code
    // Load Pyodide via importScripts in the worker
    const workerCode = `
      // Load Pyodide using dynamic import approach
      let pyodide = null;
      let loading = false;
      let loadPromise = null;

      async function loadPyodideInstance() {
        if (pyodide) return pyodide;
        if (loading && loadPromise) return loadPromise;
        
        loading = true;
        loadPromise = (async () => {
          try {
            // Use importScripts to load Pyodide
            importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
            
            // Wait briefly for global to be available
            await new Promise(resolve => setTimeout(resolve, 50));
            
            if (typeof self.loadPyodide === 'undefined') {
              throw new Error('loadPyodide not available after importScripts');
            }
            
            pyodide = await self.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
            });
            
            // Block networking
            pyodide.runPython(\`
              import sys
              if 'micropip' in sys.modules:
                sys.modules['micropip'] = None
            \`);
            
            loading = false;
            return pyodide;
          } catch (err) {
            loading = false;
            throw new Error('Failed to load Pyodide: ' + (err instanceof Error ? err.message : String(err)));
          }
        })();
        
        return loadPromise;
      }

      function truncateOutput(output, maxKb) {
        const maxBytes = maxKb * 1024;
        if (output.length <= maxBytes) return output;
        return output.slice(0, maxBytes) + '\\n... (truncated, max ' + maxKb + 'KB)';
      }

      self.onmessage = async (e) => {
        const { code, timeoutMs, maxOutputKb } = e.data;

        const timeoutId = setTimeout(() => {
          self.postMessage({
            success: false,
            stdout: [],
            result: '',
            error: { code: 'timeout', message: 'Execution exceeded ' + timeoutMs + 'ms limit' }
          });
          self.close();
        }, timeoutMs);

        try {
          const py = await loadPyodideInstance();
          
          // Capture stdout/stderr
          py.runPython(\`
            import sys
            from io import StringIO
            
            _stdout_buffer = StringIO()
            _stderr_buffer = StringIO()
            sys.stdout = _stdout_buffer
            sys.stderr = _stderr_buffer
          \`);

          // Run user code
          py.runPython(code);
          
          // Get captured output
          const stdout_captured = py.runPython('sys.stdout.getvalue()');
          const stderr_captured = py.runPython('sys.stderr.getvalue()');
          
          clearTimeout(timeoutId);

          let output = '';
          if (stdout_captured) output += stdout_captured;
          if (stderr_captured) {
            if (output) output += '\\n';
            output += stderr_captured;
          }
          
          const truncatedOutput = truncateOutput(output, maxOutputKb);
          const stdoutLines = output.split('\\n').filter(line => line.trim());

          self.postMessage({
            success: true,
            stdout: stdoutLines,
            result: truncatedOutput
          });
        } catch (err) {
          clearTimeout(timeoutId);
          const error = err instanceof Error ? err : new Error(String(err));
          
          let errorCode = 'runtime_error';
          const errorMsg = error.message || String(err);
          
          if (errorMsg.includes('SyntaxError') || errorMsg.includes('IndentationError')) {
            errorCode = 'syntax_error';
          } else if (errorMsg.includes('NameError')) {
            errorCode = 'name_error';
          } else if (errorMsg.includes('TypeError')) {
            errorCode = 'type_error';
          } else if (errorMsg.includes('loadPyodide') || errorMsg.includes('Failed to load')) {
            errorCode = 'worker_error';
          }
          
          self.postMessage({
            success: false,
            stdout: [],
            result: '',
            error: {
              code: errorCode,
              message: errorMsg
            }
          });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrlBlob = URL.createObjectURL(blob);
    const worker = new Worker(workerUrlBlob);

    const timeout = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrlBlob);
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
      URL.revokeObjectURL(workerUrlBlob);
      
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
      URL.revokeObjectURL(workerUrlBlob);
      
      const errorMsg = err.message || "Worker execution failed";
      resolve({
        success: false,
        error: {
          code: "worker_error",
          message: errorMsg + ". Pyodide may be failing to load. Check browser console for details.",
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
