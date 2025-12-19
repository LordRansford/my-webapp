"use client";

import { useMemo, useState } from "react";

const sourceFields = ["first_name", "last_name", "email_address"];
const targetFields = ["givenName", "familyName", "email"];

export default function SchemaMappingLabTool() {
  const [mappings, setMappings] = useState({
    first_name: "givenName",
    last_name: "familyName",
    email_address: "email",
  });

  const warnings = useMemo(() => {
    const values = Object.values(mappings);
    const duplicates = values.filter((v, i) => values.indexOf(v) !== i);
    const missing = Object.keys(mappings).filter((key) => !mappings[key]);
    const list = [];
    if (duplicates.length > 0) list.push("Multiple source fields map to the same target.");
    if (missing.length > 0) list.push("Some fields are not mapped.");
    return list;
  }, [mappings]);

  const setMap = (source, target) => {
    setMappings((prev) => ({ ...prev, [source]: target }));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Map fields between two systems. Mismatches cause failed transfers or missing meaning.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {sourceFields.map((field) => (
          <div key={field} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{field}</p>
            <select
              value={mappings[field]}
              onChange={(e) => setMap(field, e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-sky-200"
            >
              <option value="">Unmapped</option>
              {targetFields.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-600">Align names and meaning.</p>
          </div>
        ))}
      </div>
      {warnings.length === 0 ? (
        <p className="text-xs font-semibold text-emerald-700">Mappings look consistent.</p>
      ) : (
        <ul className="list-disc pl-5 text-xs text-amber-700">
          {warnings.map((warn) => (
            <li key={warn}>{warn}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
