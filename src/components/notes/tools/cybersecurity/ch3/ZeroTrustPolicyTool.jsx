'use client'

import { useMemo, useState } from "react";

const roles = ["Intern", "Analyst", "Admin"];
const resources = ["Admin console", "Customer data", "Logs"];
const levels = ["None", "View", "Edit", "Admin"];

export default function ZeroTrustPolicyTool() {
  const [matrix, setMatrix] = useState(() => {
    const start = {};
    roles.forEach((r) => {
      start[r] = {};
      resources.forEach((res) => {
        start[r][res] = r === "Admin" ? "Admin" : r === "Analyst" ? "View" : "None";
      });
    });
    return start;
  });

  const risks = useMemo(() => {
    const findings = [];
    roles.forEach((r) => {
      resources.forEach((res) => {
        const level = matrix[r][res];
        if (r === "Intern" && level !== "None") findings.push(`${r} has ${level} on ${res}`);
        if (level === "Admin" && r !== "Admin") findings.push(`${r} holds admin on ${res}`);
      });
    });
    return findings;
  }, [matrix]);

  return (
    <div className="space-y-4 text-sm">
      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">Role</th>
              {resources.map((res) => (
                <th key={res} className="px-3 py-2">
                  {res}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role} className="border-t">
                <td className="px-3 py-2 font-medium text-gray-800">{role}</td>
                {resources.map((res) => (
                  <td key={res} className="px-3 py-2">
                    <select
                      className="rounded-md border px-2 py-1 text-xs"
                      value={matrix[role][res]}
                      onChange={(e) =>
                        setMatrix((prev) => ({
                          ...prev,
                          [role]: { ...prev[role], [res]: e.target.value },
                        }))
                      }
                    >
                      {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Reflection</div>
        {risks.length === 0 ? (
          <p className="text-gray-700">Least privilege holds. No low-trust role has high-risk access.</p>
        ) : (
          <ul className="list-disc ml-4 text-gray-700">
            {risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
        <p className="text-gray-700 mt-2">
          Tip: temporary elevation with expiry is safer than permanent admin roles.
        </p>
      </div>
    </div>
  );
}
