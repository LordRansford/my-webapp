// JavaScript Sandbox Worker - Loaded as a static file
// This file is served from /js-worker.js

const stdout = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
  stdout.push(args.map(function(a) { return String(a); }).join(' '));
  originalLog.apply(console, args);
};

console.error = function(...args) {
  stdout.push('ERROR: ' + args.map(function(a) { return String(a); }).join(' '));
  originalError.apply(console, args);
};

console.warn = function(...args) {
  stdout.push('WARN: ' + args.map(function(a) { return String(a); }).join(' '));
  originalWarn.apply(console, args);
};

// Block network access
globalThis.fetch = function() {
  throw new Error('Network access is not allowed in the sandbox');
};

function BlockedXHR() {}
BlockedXHR.prototype.open = function() { throw new Error('Network access is not allowed'); };
BlockedXHR.prototype.send = function() { throw new Error('Network access is not allowed'); };
globalThis.XMLHttpRequest = BlockedXHR;

function truncateOutput(output, maxKb) {
  const maxBytes = maxKb * 1024;
  if (output.length <= maxBytes) return output;
  return output.slice(0, maxBytes) + '\n... (truncated, max ' + maxKb + 'KB)';
}

self.onmessage = function(e) {
  const { code, timeoutMs, maxOutputKb } = e.data;
  stdout.length = 0;

  const timeoutId = setTimeout(function() {
    self.postMessage({
      success: false,
      stdout: stdout.slice(),
      error: { code: 'timeout', message: 'Execution exceeded ' + timeoutMs + 'ms limit' }
    });
    self.close();
  }, timeoutMs);

  try {
    // Use Function constructor for safer evaluation
    const func = new Function('"use strict"; ' + code + '; return typeof result !== "undefined" ? result : undefined;');
    const result = func();
    clearTimeout(timeoutId);

    const resultStr = result !== undefined ? String(result) : '';
    const stdoutStr = stdout.join('\n');
    const fullOutput = stdoutStr + (resultStr ? '\n' + resultStr : '');
    const truncatedOutput = truncateOutput(fullOutput, maxOutputKb);

    self.postMessage({
      success: true,
      stdout: stdout.slice(),
      result: truncatedOutput
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const error = err instanceof Error ? err : new Error(String(err));
    const isSyntaxError = error.message.indexOf('SyntaxError') !== -1 || error.name === 'SyntaxError';

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

