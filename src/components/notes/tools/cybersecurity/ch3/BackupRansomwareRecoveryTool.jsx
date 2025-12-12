'use client'

import { useMemo, useState } from "react";

const services = [
  { id: "idp", name: "Identity provider", dependsOn: [] },
  { id: "network", name: "Network segmentation / firewall", dependsOn: [] },
  { id: "core", name: "Core app backend", dependsOn: ["idp", "network"] },
  { id: "db", name: "Primary database", dependsOn: ["idp", "network"] },
  { id: "files", name: "File storage", dependsOn: ["network"] },
  { id: "billing", name: "Billing / payments", dependsOn: ["core", "db"] },
];

export default function BackupRansomwareRecoveryTool() {
  const [order, setOrder] = useState(["network", "idp", "db", "core", "files", "billing"]);
  const [tested, setTested] = useState(false);

  const resolved = useMemo(() => {
    return order.map((id) => services.find((s) => s.id === id)).filter(Boolean);
  }, [order]);

  function move(idx, dir) {
    setOrder((prev) => {
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-700">
        Plan the restore order. Identity and network controls usually come before apps and data so you can restore safely.
      </p>

      <div className="space-y-2">
        {resolved.map((svc, idx) => (
          <div key={svc.id} className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <p className="font-semibold text-gray-900">{idx + 1}. {svc.name}</p>
              <p className="text-xs text-gray-600">
                Depends on: {svc.dependsOn.length ? svc.dependsOn.join(", ") : "None"}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="button ghost text-xs" onClick={() => move(idx, "up")} disabled={idx === 0}>
                Up
              </button>
              <button className="button ghost text-xs" onClick={() => move(idx, "down")} disabled={idx === resolved.length - 1}>
                Down
              </button>
            </div>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs text-gray-700">
        <input type="checkbox" checked={tested} onChange={() => setTested((v) => !v)} />
        We have tested restores recently
      </label>

      <div className="rounded-lg border px-3 py-3 bg-gray-50 leading-6">
        <div className="font-semibold text-gray-800 mb-1">Notes</div>
        <p className="text-gray-700">
          {tested
            ? "Good. Tested backups reduce recovery risk. Document lessons after each test."
            : "Test restores before an incident. Untested backups often fail when needed most."}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Keep backup credentials isolated from production identity. Consider immutable backups to resist tampering.
        </p>
      </div>
    </div>
  );
}
