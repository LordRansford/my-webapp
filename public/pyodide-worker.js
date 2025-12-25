// Pyodide Worker - Loaded as a static file to avoid blob URL issues
// This file is served from /pyodide-worker.js

let pyodide = null;
let loading = false;
let loadPromise = null;

async function loadPyodideInstance() {
  if (pyodide) return pyodide;
  if (loading && loadPromise) return loadPromise;
  
  loading = true;
  loadPromise = (async () => {
    try {
      // Load Pyodide script
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
      
      // Wait for loadPyodide to be available
      if (typeof self.loadPyodide === 'undefined') {
        throw new Error('loadPyodide not available after importScripts');
      }
      
      pyodide = await self.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });
      
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
      throw new Error('Failed to load Pyodide: ' + (err instanceof Error ? err.message : String(err)));
    }
  })();
  
  return loadPromise;
}

function truncateOutput(output, maxKb) {
  const maxBytes = maxKb * 1024;
  if (output.length <= maxBytes) return output;
  return output.slice(0, maxBytes) + '\n... (truncated, max ' + maxKb + 'KB)';
}

self.onmessage = async function(e) {
  const { code, timeoutMs, maxOutputKb } = e.data;

  const timeoutId = setTimeout(function() {
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
    py.runPython(`
      import sys
      from io import StringIO
      
      _stdout_buffer = StringIO()
      _stderr_buffer = StringIO()
      sys.stdout = _stdout_buffer
      sys.stderr = _stderr_buffer
    `);

    // Run user code
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
    
    if (errorMsg.indexOf('SyntaxError') !== -1 || errorMsg.indexOf('IndentationError') !== -1) {
      errorCode = 'syntax_error';
    } else if (errorMsg.indexOf('NameError') !== -1) {
      errorCode = 'name_error';
    } else if (errorMsg.indexOf('TypeError') !== -1) {
      errorCode = 'type_error';
    } else if (errorMsg.indexOf('loadPyodide') !== -1 || errorMsg.indexOf('Failed to load') !== -1) {
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

