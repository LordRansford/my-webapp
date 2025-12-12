"use client";

import { useMemo, useState } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("user=(\\w+)");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(
    `time=09:14 user=alex action=login\n` +
      `time=09:15 user=sam action=download file=report.pdf\n` +
      `time=09:16 user=alex action=logout`
  );

  const matches = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const found = [];
      let m;
      while ((m = re.exec(text)) !== null) {
        found.push({ match: m[0], groups: m.slice(1), index: m.index });
        if (!re.global) break;
      }
      return { error: "", data: found };
    } catch (err) {
      return { error: err.message, data: [] };
    }
  }, [pattern, flags, text]);

  return (
    <div className="stack" style={{ gap: "0.6rem" }}>
      <p className="muted">Test a regex against sample logs. Useful for quick triage and pattern learning.</p>

      <div className="control-row" style={{ alignItems: "flex-end" }}>
        <label className="control">
          <span>Pattern</span>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </label>
        <label className="control" style={{ maxWidth: "120px" }}>
          <span>Flags</span>
          <input value={flags} onChange={(e) => setFlags(e.target.value)} />
        </label>
      </div>

      <label className="control">
        <span>Text</span>
        <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} />
      </label>

      {matches.error ? (
        <p className="status status--warn">Error: {matches.error}</p>
      ) : matches.data.length === 0 ? (
        <p className="muted">No matches yet. Try adjusting the pattern.</p>
      ) : (
        <div className="rounded-lg border px-3 py-3 bg-gray-50">
          <p className="eyebrow">Matches ({matches.data.length})</p>
          <ul className="stack" style={{ margin: 0 }}>
            {matches.data.map((m, idx) => (
              <li key={idx} className="card" style={{ padding: "0.6rem" }}>
                <div className="font-mono text-sm text-gray-900">Match: {m.match}</div>
                {m.groups.length > 0 && (
                  <div className="text-xs text-gray-700">Groups: {m.groups.join(", ")}</div>
                )}
                <div className="text-xs text-gray-500">Index: {m.index}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
