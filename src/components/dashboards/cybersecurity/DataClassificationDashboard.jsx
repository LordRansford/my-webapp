"use client";

import React, { useState } from "react";
import { Plus, Trash2, FileText } from "lucide-react";

const CLASSIFICATIONS = [
  { id: "public", label: "Public", color: "green", rules: "Can be shared openly" },
  { id: "internal", label: "Internal", color: "blue", rules: "Employees only, no external sharing" },
  { id: "confidential", label: "Confidential", color: "orange", rules: "Restricted access, encryption required" },
  { id: "secret", label: "Secret", color: "red", rules: "Highest protection, minimal access" },
];

export default function DataClassificationDashboard() {
  const [items, setItems] = useState([
    { id: 1, name: "Public website content", classification: "public" },
    { id: 2, name: "Customer email addresses", classification: "confidential" },
    { id: 3, name: "Employee handbook", classification: "internal" },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", classification: "internal" }]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getClassification = (id) => CLASSIFICATIONS.find((c) => c.id === id) || CLASSIFICATIONS[1];

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 text-slate-900 shadow-md ring-1 ring-slate-200 md:flex-row md:p-5">
      {/* Left: items */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Data classification board
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            Place example data items into classification labels. This helps practise consistent
            classification.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-800">Data items</label>
            <button
              onClick={addItem}
              className="rounded bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <Plus size={12} className="inline" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item) => {
              const cls = getClassification(item.classification);
              return (
                <div key={item.id} className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Data item name..."
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
                  />
                  <select
                    value={item.classification}
                    onChange={(e) => updateItem(item.id, "classification", e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
                  >
                    {CLASSIFICATIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded p-1 text-slate-500 transition hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: classification view */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <FileText size={18} className="text-sky-500" />
            <h4 className="text-sm font-semibold text-slate-900">Classification board</h4>
          </div>
          <div className="space-y-3">
            {CLASSIFICATIONS.map((cls) => {
              const clsItems = items.filter((i) => i.classification === cls.id);
              return (
                <div
                  key={cls.id}
                  className={`rounded-lg border p-3 ${
                    cls.color === "green"
                      ? "border-green-200 bg-green-50"
                      : cls.color === "blue"
                      ? "border-blue-200 bg-blue-50"
                      : cls.color === "orange"
                      ? "border-orange-200 bg-orange-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{cls.label}</span>
                    <span className="text-xs font-medium text-slate-800">
                      {clsItems.length} item{clsItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mb-2 text-sm text-slate-800">{cls.rules}</div>
                  <div className="space-y-1">
                    {clsItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 shadow-sm"
                      >
                        {item.name || "Unnamed"}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

