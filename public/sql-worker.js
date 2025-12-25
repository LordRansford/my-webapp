// SQL Worker - Loaded as a static file to avoid blob URL issues
// This file is served from /sql-worker.js

let SQL = null;
let db = null;
let loading = false;
let loadPromise = null;

async function loadSqlJs() {
  if (SQL) return SQL;
  if (loading && loadPromise) return loadPromise;
  
  loading = true;
  loadPromise = (async function() {
    try {
      importScripts('https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js');
      
      SQL = await initSqlJs({
        locateFile: function(file) { 
          return 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/' + file; 
        }
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

  db.run(`
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
  `);

  return db;
}

function validateQuery(query) {
  const upperQuery = query.toUpperCase().trim();
  
  const dangerous = ['DROP', 'DELETE', 'ALTER', 'TRUNCATE', 'CREATE TABLE', 'CREATE INDEX'];
  for (var i = 0; i < dangerous.length; i++) {
    if (upperQuery.indexOf(dangerous[i]) !== -1) {
      return { valid: false, reason: 'Dangerous operation not allowed: ' + dangerous[i] };
    }
  }
  
  if (upperQuery.indexOf('DELETE FROM') !== -1 && upperQuery.indexOf('WHERE') === -1) {
    return { valid: false, reason: 'DELETE without WHERE is not allowed' };
  }
  
  return { valid: true };
}

self.onmessage = async function(e) {
  const { query, timeoutMs, maxOutputKb, maxRows } = e.data;

  const timeoutId = setTimeout(function() {
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
    var rows = firstResult.values || [];
    const columns = firstResult.columns || [];
    
    if (maxRows && rows.length > maxRows) {
      rows = rows.slice(0, maxRows);
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
    
    var errorCode = 'query_error';
    if (errorMsg.indexOf('syntax error') !== -1 || errorMsg.indexOf('SQLITE_ERROR') !== -1) {
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

