"use client";

import { useMemo, useState } from "react";

const DEFAULT_ASSETS = [
  { id: "asset1", name: "Customer data", value: "high" },
  { id: "asset2", name: "Payment API", value: "high" },
  { id: "asset3", name: "Support inbox", value: "medium" },
];

const DEFAULT_ATTACKERS = [
  { id: "att1", name: "External attacker" },
  { id: "att2", name: "Insider" },
  { id: "att3", name: "Bot/scanner" },
];

const DEFAULT_ENTRIES = [
  { id: "entry1", name: "Web portal" },
  { id: "entry2", name: "API" },
  { id: "entry3", name: "Support inbox" },
];

export default function ThreatScenarioMapper() {
  const [assets, setAssets] = useState(DEFAULT_ASSETS);
  const [attackers, setAttackers] = useState(DEFAULT_ATTACKERS);
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [selectedAttacker, setSelectedAttacker] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [links, setLinks] = useState({ attToEntry: [], entryToAsset: [] });
  const [summary, setSummary] = useState("");

  const addAsset = () => {
    if (assets.length >= 5) return;
    setAssets([...assets, { id: `asset-${Date.now()}`, name: "New asset", value: "low" }]);
  };
  const addAttacker = () => {
    if (attackers.length >= 4) return;
    setAttackers([...attackers, { id: `att-${Date.now()}`, name: "New attacker" }]);
  };
  const addEntry = () => {
    if (entries.length >= 5) return;
    setEntries([...entries, { id: `entry-${Date.now()}`, name: "New entry point" }]);
  };

  const toggleLink = (from, to, type) => {
    setLinks((prev) => {
      const list = type === "attToEntry" ? prev.attToEntry : prev.entryToAsset;
      const exists = list.find((l) => l.from === from && l.to === to);
      const updated = exists ? list.filter((l) => !(l.from === from && l.to === to)) : [...list, { from, to }];
      return type === "attToEntry" ? { ...prev, attToEntry: updated } : { ...prev, entryToAsset: updated };
    });
  };

  useMemo(() => {
    const entryCounts = {};
    links.entryToAsset.forEach((l) => {
      entryCounts[l.to] = (entryCounts[l.to] || 0) + 1;
    });
    const topAssetId = Object.entries(entryCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topAsset = assets.find((a) => a.id === topAssetId) || assets[0];
    const pathsToTop = links.attToEntry
      .filter((l) => links.entryToAsset.some((ea) => ea.from === l.to && ea.to === topAsset?.id))
      .map((l) => l.from);
    const attackerCounts = pathsToTop.reduce((acc, id) => ({ ...acc, [id]: (acc[id] || 0) + 1 }), {});
    const topAttackerId = Object.entries(attackerCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topAttacker = attackers.find((a) => a.id === topAttackerId) || attackers[0];
    if (topAsset && topAttacker) {
      setSummary(
        `${topAsset.name} (value: ${topAsset.value}) has the most connected entry points. ${topAttacker.name} has the most paths to it.`
      );
    } else {
      setSummary("Add links to see which attacker can most easily reach which asset.");
    }
  }, [assets, attackers, links]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="grid gap-3 md:grid-cols-3">
        <Column
          title="Assets"
          items={assets}
          onAdd={addAsset}
          selected={null}
          onSelect={() => {}}
          type="asset"
        />
        <Column
          title="Entry points"
          items={entries}
          onAdd={addEntry}
          selected={selectedEntry}
          onSelect={setSelectedEntry}
          type="entry"
        />
        <Column
          title="Attacker types"
          items={attackers}
          onAdd={addAttacker}
          selected={selectedAttacker}
          onSelect={setSelectedAttacker}
          type="attacker"
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Link attackers to entry points</h5>
          <LinkGrid
            rows={attackers}
            cols={entries}
            links={links.attToEntry}
            onToggle={(from, to) => toggleLink(from, to, "attToEntry")}
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Link entry points to assets</h5>
          <LinkGrid
            rows={entries}
            cols={assets}
            links={links.entryToAsset}
            onToggle={(from, to) => toggleLink(from, to, "entryToAsset")}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm">
        {summary}
      </div>
    </div>
  );
}

function Column({ title, items, onAdd, selected, onSelect, type }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <button
          onClick={onAdd}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect && onSelect(item.id)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
              selected === item.id ? "border-sky-300 bg-sky-50 text-slate-900" : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            <div className="font-semibold">{item.name}</div>
            {item.value ? <div className="text-xs text-slate-700">Value: {item.value}</div> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function LinkGrid({ rows, cols, links, onToggle }) {
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-2 text-left text-slate-700">From \\ To</th>
            {cols.map((c) => (
              <th key={c.id} className="p-2 text-left text-slate-700">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-slate-200">
              <td className="p-2 font-semibold text-slate-800">{r.name}</td>
              {cols.map((c) => {
                const active = links.some((l) => l.from === r.id && l.to === c.id);
                return (
                  <td key={c.id} className="p-2">
                    <button
                      onClick={() => onToggle(r.id, c.id)}
                      className={`h-6 w-6 rounded-full border ${
                        active ? "border-emerald-300 bg-emerald-100" : "border-slate-300 bg-white"
                      } focus:outline-none focus:ring-2 focus:ring-sky-300`}
                      aria-label="Toggle link"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
