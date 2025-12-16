"use client";

import React, { useState } from "react";
import { Plus, Trash2, Shield, AlertTriangle } from "lucide-react";

const PERMISSIONS = ["None", "Read", "Write", "Admin"];

export default function AccessControlMatrixDashboard() {
  const [roles, setRoles] = useState(["Admin", "User", "Guest"]);
  const [resources, setResources] = useState(["Customer DB", "Payment API", "Admin Panel"]);
  const [matrix, setMatrix] = useState({
    "Admin-Customer DB": "Admin",
    "Admin-Payment API": "Admin",
    "Admin-Admin Panel": "Admin",
    "User-Customer DB": "Read",
    "User-Payment API": "Write",
    "User-Admin Panel": "None",
    "Guest-Customer DB": "None",
    "Guest-Payment API": "None",
    "Guest-Admin Panel": "None",
  });

  const updatePermission = (role, resource, permission) => {
    setMatrix({ ...matrix, [`${role}-${resource}`]: permission });
  };

  const addRole = () => {
    setRoles([...roles, `Role ${roles.length + 1}`]);
  };

  const addResource = () => {
    setResources([...resources, `Resource ${resources.length + 1}`]);
  };

  const getRiskyEntries = () => {
    const risky = [];
    roles.forEach((role) => {
      resources.forEach((resource) => {
        const perm = matrix[`${role}-${resource}`] || "None";
        if (perm === "Admin" && resource.toLowerCase().includes("sensitive")) {
          risky.push({ role, resource, permission: perm });
        }
      });
    });
    return risky;
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 text-slate-900 shadow-md ring-1 ring-slate-200 md:flex-row md:p-5">
      {/* Left: matrix */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Access control matrix
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            Map roles to resources and set permissions. The matrix shows where access might be too
            broad.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={addRole}
                className="rounded bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                <Plus size={12} className="inline" /> Role
              </button>
              <button
                onClick={addResource}
                className="rounded bg-purple-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <Plus size={12} className="inline" /> Resource
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-200 bg-slate-100 p-2 text-left text-slate-700"></th>
                  {resources.map((resource) => (
                    <th
                      key={resource}
                      className="border border-slate-200 bg-slate-100 p-2 text-left text-slate-700"
                    >
                      {resource}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role}>
                    <td className="border border-slate-200 bg-slate-100 p-2 font-medium text-slate-800">
                      {role}
                    </td>
                    {resources.map((resource) => {
                      const key = `${role}-${resource}`;
                      const perm = matrix[key] || "None";
                      return (
                        <td key={resource} className="border border-slate-200 bg-white p-2">
                          <select
                            value={perm}
                            onChange={(e) => updatePermission(role, resource, e.target.value)}
                            className={`w-full rounded border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300`}
                          >
                            {PERMISSIONS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: analysis */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Shield size={18} className="text-sky-500" />
            <h4 className="text-sm font-semibold text-slate-900">Permission summary</h4>
          </div>
          <div className="space-y-2 text-sm">
            {roles.map((role) => {
              const adminCount = resources.filter(
                (r) => (matrix[`${role}-${r}`] || "None") === "Admin"
              ).length;
              return (
                <div key={role} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <div className="flex justify-between">
                    <span className="text-slate-800">{role}</span>
                    <span className="font-semibold text-slate-900">
                      {adminCount} admin permission{adminCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {getRiskyEntries().length > 0 && (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3 ring-1 ring-orange-100 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-600" />
              <h4 className="text-sm font-semibold text-orange-800">Potential risks</h4>
            </div>
            <div className="space-y-1 text-sm text-orange-900">
              {getRiskyEntries().map((entry, idx) => (
                <div key={idx}>
                  • <strong>{entry.role}</strong> has <strong>{entry.permission}</strong> on{" "}
                  <strong>{entry.resource}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

