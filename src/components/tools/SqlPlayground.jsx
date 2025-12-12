"use client";

import initSqlJs from "sql.js";
import { useEffect, useMemo, useState } from "react";

export default function SqlPlayground() {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState(
    "create table users(id integer primary key, name text);\ninsert into users(name) values ('Alice'), ('Bob');\nselect * from users;"
  );
  const [result, setResult] = useState({ columns: [], values: [], error: "" });

  useEffect(() => {
    initSqlJs({ locateFile: (file) => `https://sql.js.org/dist/${file}` }).then((SQL) => {
      setDb(new SQL.Database());
    });
  }, []);

  function run() {
    if (!db) return;
    try {
      const statements = query.split(";").map((s) => s.trim()).filter(Boolean);
      let last = { columns: [], values: [] };
      statements.forEach((stmt) => {
        const res = db.exec(stmt);
        if (res && res[0]) {
          last = { columns: res[0].columns, values: res[0].values };
        }
      });
      setResult({ ...last, error: "" });
    } catch (err) {
      setResult({ columns: [], values: [], error: err.message });
    }
  }

  const table = useMemo(() => {
    if (!result.columns.length) return null;
    return (
      <table className="thin-table">
        <thead>
          <tr>
            {result.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.values.map((row, idx) => (
            <tr key={idx}>
              {row.map((v, i) => (
                <td key={i}>{String(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [result]);

  return (
    <div className="stack" style={{ gap: "0.6rem" }}>
      <p className="muted">
        SQLite (sql.js) running fully in your browser. Great for learning SQL joins and queries without installing anything.
      </p>
      <label className="control">
        <span>SQL</span>
        <textarea rows={10} value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="control-row">
        <button className="button primary" type="button" onClick={run} disabled={!db}>
          {db ? "Run SQL" : "Loading SQLite..."}
        </button>
        <span className="muted">Statements run in order; last SELECT is shown.</span>
      </div>
      {result.error ? (
        <p className="status status--warn">Error: {result.error}</p>
      ) : (
        table || <p className="muted">Run a query to see results.</p>
      )}
    </div>
  );
}
