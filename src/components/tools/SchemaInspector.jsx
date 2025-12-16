"use client";

import { useMemo, useState } from "react";

const sample = {
  schema: "CIM minimal example",
  entities: [
    { name: "Asset", fields: [{ name: "AssetID", type: "string" }, { name: "Name", type: "string" }] },
    {
      name: "Incident",
      fields: [
        { name: "IncidentID", type: "string" },
        { name: "Severity", type: "enum" },
        { name: "DetectedAt", type: "datetime" },
      ],
    },
  ],
  relationships: [{ from: "Incident", to: "Asset", type: "impacts" }],
};

export default function SchemaInspector() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sample, null, 2));

  const parsed = useMemo(() => {
    try {
      const data = JSON.parse(jsonInput);
      return { error: "", data };
    } catch (err) {
      return { error: err.message, data: null };
    }
  }, [jsonInput]);

  return (
    <div className="stack" style={{ gap: "0.6rem" }}>
      <p className="muted">
        Paste a JSON schema (CIM or similar) and see entities, fields, and relationships. Helps reason about data models quickly.
      </p>
      <label className="control">
        <span>Schema JSON</span>
        <textarea rows={8} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
      </label>

      {parsed.error ? (
        <p className="status status--warn">Parse error: {parsed.error}</p>
      ) : (
        parsed.data && (
          <div className="rounded-lg border px-3 py-3 bg-gray-50">
            <p className="eyebrow">Entities</p>
            <ul className="stack" style={{ margin: 0 }}>
              {(parsed.data.entities || []).map((ent) => (
                <li key={ent.name} className="card" style={{ padding: "0.6rem" }}>
                  <div className="font-semibold text-gray-900">{ent.name}</div>
                  <div className="text-xs text-gray-700">
                    Fields: {(ent.fields || []).map((f) => `${f.name}:${f.type}`).join(", ")}
                  </div>
                </li>
              ))}
            </ul>
            <p className="eyebrow" style={{ marginTop: "0.75rem" }}>
              Relationships
            </p>
            <ul className="stack" style={{ margin: 0 }}>
              {(parsed.data.relationships || []).map((r, idx) => (
                <li key={idx} className="text-sm text-gray-800">
                  {`${r.from} -[${r.type}]-> ${r.to}`}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
