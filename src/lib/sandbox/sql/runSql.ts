/**
 * SQL Sandbox Runner (sql.js)
 * 
 * Runs SQL queries in a Web Worker using sql.js (SQLite compiled to WASM).
 * Secure sandbox: no file system access, in-memory database only.
 */

import type { ToolContract } from "@/components/tools/ToolShell";

export interface SqlRunResult {
  success: boolean;
  output?: {
    rows: unknown[][];
    columns: string[];
    rowCount: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Inline worker code for sql.js
const sqlWorkerCode = `
  let SQL = null;
  let db = null;
  let loading = false;
  let loadPromise = null;

  async function loadSqlJs() {
    if (SQL) return SQL;
    if (loading) return loadPromise;
    
    loading = true;
    loadPromise = (async () => {
      try {
        // Load sql.js from CDN
        importScripts('https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js');
        
        // Initialize sql.js
        SQL = await initSqlJs({
          locateFile: (file) => 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/' + file
        });
        
        loading = false;
        return SQL;
      } catch (err) {
        loading = false;
        throw new Error('Failed to load sql.js: ' + (err instanceof Error ? err.message : String(err)));
      }
    })();
    
    return loadPromise;
  }

  async function initDatabase() {
    if (db) return db;
    
    const sql = await loadSqlJs();
    db = new sql.Database();

    // Create sample schema
    db.run(\`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        age INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        amount REAL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      INSERT OR IGNORE INTO users (id, name, email, age) VALUES
        (1, 'Alice', 'alice@example.com', 30),
        (2, 'Bob', 'bob@example.com', 25),
        (3, 'Charlie', 'charlie@example.com', 35);
      
      INSERT OR IGNORE INTO orders (id, user_id, amount) VALUES
        (1, 1, 100.50),
        (2, 1, 200.00),
        (3, 2, 150.75);
    \`);

    return db;
  }

  function truncateRows(rows, maxKb) {
    const maxBytes = maxKb * 1024;
    let totalBytes = 0;
    const result = [];
    
    for (const row of rows) {
      const rowStr = JSON.stringify(row);
      totalBytes += new Blob([rowStr]).size;
      if (totalBytes > maxBytes) {
        result.push(['... (truncated, max ' + maxKb + 'KB)']);
        break;
      }
      result.push(row);
    }
    
    return result;
  }

  function validateQuery(query) {
    const upperQuery = query.toUpperCase().trim();
    
    // Block dangerous operations
    const dangerous = ['DROP', 'DELETE', 'ALTER', 'TRUNCATE', 'CREATE TABLE', 'CREATE INDEX'];
    for (const keyword of dangerous) {
      if (upperQuery.includes(keyword)) {
        return { valid: false, reason: 'Dangerous operation not allowed: ' + keyword };
      }
    }
    
    // Block DELETE without WHERE (too dangerous)
    if (upperQuery.includes('DELETE FROM') && !upperQuery.includes('WHERE')) {
      return { valid: false, reason: 'DELETE without WHERE is not allowed' };
    }
    
    return { valid: true };
  }

  self.onmessage = async (e) => {
    const { query, timeoutMs, maxOutputKb, maxRows } = e.data;

    const timeoutId = setTimeout(() => {
      self.postMessage({
        success: false,
        error: { code: 'timeout', message: 'Query exceeded ' + timeoutMs + 'ms limit' }
      });
      self.close();
    }, timeoutMs);

    try {
      const validation = validateQuery(query);
      if (!validation.valid) {
        clearTimeout(timeoutId);
        self.postMessage({
          success: false,
          error: { code: 'validation_error', message: validation.reason }
        });
        return;
      }
      
      const database = await initDatabase();
      
      // Execute query
      const result = database.exec(query);
      
      clearTimeout(timeoutId);
      
      if (!result || result.length === 0) {
        self.postMessage({
          success: true,
          rows: [],
          columns: [],
          rowCount: 0
        });
        return;
      }
      
      const firstResult = result[0];
      let rows = firstResult.values || [];
      const columns = firstResult.columns || [];
      
      // Apply row limit
      if (maxRows && rows.length > maxRows) {
        rows = rows.slice(0, maxRows);
      }
      
      // Truncate if too large
      const rowsStr = JSON.stringify(rows);
      const rowsKb = new Blob([rowsStr]).size / 1024;
      if (rowsKb > maxOutputKb) {
        rows = truncateRows(rows, maxOutputKb);
      }
      
      self.postMessage({
        success: true,
        rows: rows,
        columns: columns,
        rowCount: firstResult.values ? firstResult.values.length : 0
      });
    } catch (err) {
      clearTimeout(timeoutId);
      const error = err instanceof Error ? err : new Error(String(err));
      const errorMsg = error.message || String(err);
      
      let errorCode = 'query_error';
      if (errorMsg.includes('syntax error') || errorMsg.includes('SQLITE_ERROR')) {
        errorCode = 'syntax_error';
      }
      
      self.postMessage({
        success: false,
        error: {
          code: errorCode,
          message: errorMsg
        }
      });
    }
  };
`;

export async function runSql(
  query: string,
  contract: ToolContract
): Promise<SqlRunResult> {
  // Validate input size
  const inputKb = new Blob([query]).size / 1024;
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
    const blob = new Blob([sqlWorkerCode], { type: "application/javascript" });
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
            rows: response.rows || [],
            columns: response.columns || [],
            rowCount: response.rowCount || 0,
          },
        });
      } else {
        resolve({
          success: false,
          error: response.error || {
            code: "unknown_error",
            message: "Query execution failed",
          },
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
          message: err.message || "Worker execution failed. sql.js may not be loading correctly.",
        },
      });
    };

    worker.postMessage({
      query,
      timeoutMs: contract.limits.cpuMs,
      maxOutputKb: contract.limits.outputKb,
      maxRows: 1000, // Limit rows returned
    });
  });
}
