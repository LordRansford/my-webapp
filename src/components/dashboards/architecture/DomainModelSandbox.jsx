"use client";

import { useState } from "react";

export function DomainModelSandbox() {
  const [entities, setEntities] = useState([
    {
      id: 1,
      name: "Customer",
      attributes: "Name, Email",
      relationships: "Places Order",
    },
    {
      id: 2,
      name: "Order",
      attributes: "Total, Status",
      relationships: "Contains Product",
    },
  ]);

  function updateEntity(id, patch) {
    setEntities((current) => current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEntity() {
    const nextId = entities.length ? Math.max(...entities.map((e) => e.id)) + 1 : 1;
    setEntities((current) => [...current, { id: nextId, name: "", attributes: "", relationships: "" }]);
  }

  function removeEntity(id) {
    setEntities((current) => current.filter((e) => e.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Use this sandbox to sketch a very lightweight domain model. Focus on the language, not on
        database tables. If you can describe entities and relationships clearly, the code is already
        easier to reason about.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium text-slate-800">Entities</p>
          <button
            type="button"
            onClick={addEntity}
            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
          >
            Add entity
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {entities.map((entity) => (
            <div key={entity.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <input
                  className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm font-semibold"
                  placeholder="Entity name, for example Tariff"
                  value={entity.name}
                  onChange={(e) => updateEntity(entity.id, { name: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeEntity(entity.id)}
                  className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  Remove
                </button>
              </div>

              <label className="mb-2 block text-xs font-medium text-slate-600">
                Key attributes
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                  rows={2}
                  placeholder="Example: Price, Currency, EffectiveFrom, EffectiveTo"
                  value={entity.attributes}
                  onChange={(e) => updateEntity(entity.id, { attributes: e.target.value })}
                />
              </label>

              <label className="block text-xs font-medium text-slate-600">
                Relationships
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-1 text-sm"
                  rows={2}
                  placeholder="Example: Tariff is applied to MeterPoint"
                  value={entity.relationships}
                  onChange={(e) => updateEntity(entity.id, { relationships: e.target.value })}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
        <p className="mb-1 font-medium">What to look for</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>If an entity has many unrelated responsibilities, consider splitting it.</li>
          <li>If two entities share many attributes and relationships, they may represent the same concept with different names.</li>
          <li>Read your entities and relationships aloud. If it sounds natural to a non technical person, you are heading in the right direction.</li>
        </ul>
      </div>
    </div>
  );
}
