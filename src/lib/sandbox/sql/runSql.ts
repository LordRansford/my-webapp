/**
 * SQL Sandbox Runner (sql.js)
 * 
 * Runs SQL queries in a Web Worker using sql.js (SQLite compiled to WASM).
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

  async function initDatabase() {
    if (db) return db;
    
    if (!SQL) {
      // Load sql.js from CDN (simplified - will need proper CDN loading)
      // For now, return error if sql.js not available
      throw new Error('sql.js must be loaded from CDN. This feature requires additional setup.');
    }

    db = new SQL.Database();

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
      const database = await initDatabase();
      
      // Validate query (basic safety - no DROP, DELETE without WHERE, etc.)
      const upperQuery = query.toUpperCase().trim();
      if (upperQuery.startsWith('DROP') || 
          upperQuery.startsWith('ALTER') ||
          (upperQuery.includes('DELETE') && !upperQuery.includes('WHERE'))) {
        throw new Error('Unsafe query detected. Only SELECT queries and safe INSERT/UPDATE are allowed.');
      }

      const stmt = database.prepare(query);
      const columns = stmt.getColumnNames();
      const rows = [];
      let rowCount = 0;

      while (stmt.step() && rowCount < maxRows) {
        const row = stmt.get();
        rows.push(row);
        rowCount++;
      }

      stmt.free();

      clearTimeout(timeoutId);

      const truncatedRows = truncateRows(rows, maxOutputKb);

      self.postMessage({
        success: true,
        output: {
          rows: truncatedRows,
          columns: columns,
          rowCount: rowCount
        }
      });
    } catch (err) {
      clearTimeout(timeoutId);
      const error = err instanceof Error ? err : new Error(String(err));
      const isSyntaxError = error.message.includes('SQLITE_ERROR') || error.message.includes('syntax');
      
      self.postMessage({
        success: false,
        error: {
          code: isSyntaxError ? 'syntax_error' : 'query_error',
          message: error.message
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

  // Client-side only
  if (typeof window === "undefined") {
    return {
      success: false,
      error: {
        code: "server_side_error",
        message: "SQL sandbox must run in the browser",
      },
    };
  }

  return new Promise((resolve) => {
    // Load sql.js from CDN in worker to avoid bundling issues
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
          message: `Query exceeded ${contract.limits.wallMs}ms limit`,
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
          output: response.output,
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
      query,
      timeoutMs: contract.limits.cpuMs,
      maxOutputKb: contract.limits.outputKb,
      maxRows: 1000, // Limit result rows
    });
  });
}

