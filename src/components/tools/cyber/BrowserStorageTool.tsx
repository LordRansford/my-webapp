"use client";

import React, { useEffect, useState } from "react";
import { HardDrive } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type StorageItem = {
  key: string;
  valuePreview: string;
  length: number;
};

function summariseStorage(store: Storage | null): StorageItem[] {
  if (!store) return [];
  const items: StorageItem[] = [];
  for (let i = 0; i < store.length; i += 1) {
    const key = store.key(i) ?? "";
    const value = store.getItem(key) ?? "";
    items.push({
      key,
      valuePreview: value.length > 80 ? value.slice(0, 77) + "..." : value || "(empty)",
      length: value.length,
    });
  }
  return items;
}

export function BrowserStorageTool() {
  const [cookies, setCookies] = useState<string[]>([]);
  const [localItems, setLocalItems] = useState<StorageItem[]>([]);
  const [sessionItems, setSessionItems] = useState<StorageItem[]>([]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const parts = document.cookie.split(";").map((c) => c.trim());
      setCookies(parts.filter(Boolean));
    }
    if (typeof window !== "undefined") {
      setLocalItems(summariseStorage(window.localStorage));
      setSessionItems(summariseStorage(window.sessionStorage));
    }
  }, []);

  return (
    <CyberToolCard
      id="browser-storage-title"
      title="Browser storage viewer"
      icon={<HardDrive className="h-4 w-4" aria-hidden="true" />}
      description="See what this site stores in your browser cookies, localStorage and sessionStorage so you can reason about privacy and security."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Cookies</p>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {cookies.length === 0 && <p className="text-[11px] text-slate-500">No cookies detected for this site or cookies are disabled.</p>}
            {cookies.map((c, idx) => (
              <p
                key={idx}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 break-all"
              >
                {c}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">localStorage entries</p>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {localItems.length === 0 && <p className="text-[11px] text-slate-500">No localStorage entries found for this site.</p>}
            {localItems.map((item) => (
              <div
                key={item.key}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 space-y-1"
              >
                <p className="font-semibold text-slate-900 break-all">{item.key}</p>
                <p className="text-slate-600 break-all">
                  {item.valuePreview} <span className="text-slate-500">({item.length} characters)</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">sessionStorage entries</p>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {sessionItems.length === 0 && <p className="text-[11px] text-slate-500">No sessionStorage entries found for this site.</p>}
            {sessionItems.map((item) => (
              <div
                key={item.key}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 space-y-1"
              >
                <p className="font-semibold text-slate-900 break-all">{item.key}</p>
                <p className="text-slate-600 break-all">
                  {item.valuePreview} <span className="text-slate-500">({item.length} characters)</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
