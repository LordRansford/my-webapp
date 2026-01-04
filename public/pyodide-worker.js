// Pyodide Worker - Loaded as a static file to avoid blob URL issues
// This file is served from /pyodide-worker.js

let pyodide = null;
let loading = false;
let loadPromise = null;

function blobSizeKb(text) {
  try {
    return new Blob([text]).size / 1024;
  } catch (e) {
    // Fallback: best-effort approximation
    return (text && text.length ? text.length / 1024 : 0);
  }
}

function postStatus(requestId, phase, message) {
  try {
    self.postMessage({ type: "status", requestId: requestId, phase: phase, message: message });
  } catch (e) {
    // ignore
  }
}

function postResult(requestId, payload) {
  self.postMessage(
    Object.assign(
      {
        type: "result",
        requestId: requestId,
      },
      payload
    )
  );
}

function buildPyodideLoadHelp(errorMsg) {
  const base =
    "Python runtime failed to load (Pyodide). This usually happens when your network blocks the CDN or your browser blocks cross-origin scripts.";

  const hints = [];
  const msg = String(errorMsg || "");
  if (/csp|content security policy|refused to load the script/i.test(msg)) {
    hints.push("Your Content Security Policy blocked loading Pyodide. Allow `cdn.jsdelivr.net` (or self-host Pyodide).");
  } else if (/networkerror|failed to fetch|load failed|importScripts/i.test(msg)) {
    hints.push("Your network may be blocking Pyodide. Allowlist `cdn.jsdelivr.net` (and fallback jsDelivr domains) or self-host Pyodide.");
  }

  hints.push(
    "If you control deployment: ensure `script-src` allows Pyodide and that cross-origin requests to the Pyodide CDN are permitted."
  );

  return base + (hints.length ? " " + hints.join(" ") : "");
}

async function loadPyodideInstance() {
  if (pyodide) return pyodide;
  if (loading && loadPromise) return loadPromise;
  
  loading = true;
  loadPromise = (async () => {
    try {
      // Load Pyodide script (with resilient jsDelivr domain fallbacks).
      // We intentionally keep the version pinned for safety/reproducibility.
      const sources = [
        { script: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js", index: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/" },
        { script: "https://fastly.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js", index: "https://fastly.jsdelivr.net/pyodide/v0.24.1/full/" },
        { script: "https://gcore.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js", index: "https://gcore.jsdelivr.net/pyodide/v0.24.1/full/" },
      ];

      let lastErr = null;
      for (let i = 0; i < sources.length; i++) {
        const src = sources[i];
        try {
          importScripts(src.script);
          if (typeof self.loadPyodide === "undefined") {
            throw new Error("loadPyodide not available after importScripts");
          }
          pyodide = await self.loadPyodide({ indexURL: src.index });
          break;
        } catch (e) {
          lastErr = e;
          pyodide = null;
          // Continue to next source
        }
      }

      if (!pyodide) {
        throw lastErr || new Error("Unable to load Pyodide from any CDN source");
      }
      
      // Block networking
      pyodide.runPython(`
        import sys
        if 'micropip' in sys.modules:
          sys.modules['micropip'] = None
      `);
      
      loading = false;
      return pyodide;
    } catch (err) {
      loading = false;
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error("Failed to load Pyodide: " + msg);
    }
  })();
  
  return loadPromise;
}

function truncateOutput(output, maxKb) {
  const maxBytes = maxKb * 1024;
  try {
    const sizeBytes = new Blob([output]).size;
    if (sizeBytes <= maxBytes) return output;
  } catch (e) {
    if (output.length <= maxBytes) return output;
  }
  return output.slice(0, maxBytes) + "\n... (truncated, max " + maxKb + "KB)";
}

self.onmessage = async function(e) {
  const { requestId, code, timeoutMs, maxOutputKb } = e.data || {};
  if (!requestId) return;

  const timeoutId = setTimeout(function() {
    postResult(requestId, {
      success: false,
      stdout: [],
      result: "",
      error: { code: "timeout", message: "Execution exceeded " + timeoutMs + "ms limit" },
    });
    self.close();
  }, timeoutMs);

  try {
    postStatus(requestId, "loading_runtime", "Loading Python runtime...");
    const py = await loadPyodideInstance();
    postStatus(requestId, "ready", "Python runtime ready.");
    
    // Capture stdout/stderr
    py.runPython(`
      import sys
      from io import StringIO
      
      _stdout_buffer = StringIO()
      _stderr_buffer = StringIO()
      sys.stdout = _stdout_buffer
      sys.stderr = _stderr_buffer
    `);

    // Run user code
    postStatus(requestId, "running", "Running code...");
    py.runPython(code);
    
    // Get captured output
    const stdout_captured = py.runPython('sys.stdout.getvalue()');
    const stderr_captured = py.runPython('sys.stderr.getvalue()');
    
    clearTimeout(timeoutId);

    let output = '';
    if (stdout_captured) output += stdout_captured;
    if (stderr_captured) {
      if (output) output += '\n';
      output += stderr_captured;
    }
    
    const truncatedOutput = truncateOutput(output, maxOutputKb);
    const stdoutLines = output.split('\n').filter(function(line) { return line.trim(); });

    postResult(requestId, {
      success: true,
      stdout: stdoutLines,
      result: truncatedOutput,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const error = err instanceof Error ? err : new Error(String(err));
    
    let errorCode = 'runtime_error';
    const errorMsg = error.message || String(err);
    
    if (errorMsg.indexOf('SyntaxError') !== -1 || errorMsg.indexOf('IndentationError') !== -1) {
      errorCode = 'syntax_error';
    } else if (errorMsg.indexOf('NameError') !== -1) {
      errorCode = 'name_error';
    } else if (errorMsg.indexOf('TypeError') !== -1) {
      errorCode = 'type_error';
    } else if (errorMsg.indexOf('loadPyodide') !== -1 || errorMsg.indexOf('Failed to load') !== -1 || errorMsg.indexOf('importScripts') !== -1) {
      errorCode = 'pyodide_load_failed';
    }
    
    const help =
      errorCode === "pyodide_load_failed"
        ? buildPyodideLoadHelp(errorMsg)
        : "";

    const extra =
      errorCode === "pyodide_load_failed"
        ? " (Tip: first load can take ~10–30s; after that, runs should be fast.)"
        : "";

    postResult(requestId, {
      success: false,
      stdout: [],
      result: "",
      error: {
        code: errorCode,
        message: (errorMsg || "Execution failed") + extra + (help ? "\n\n" + help : ""),
      },
    });
  }
};

