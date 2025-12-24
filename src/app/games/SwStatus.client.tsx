"use client";

import { useEffect, useState } from "react";

export function useOfflineReady() {
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const has = typeof window !== "undefined" && "serviceWorker" in navigator;
    setSupported(has);
    if (!has) return;

    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        if (cancelled) return;
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { supported, ready };
}

export default function SwStatusPill() {
  const { supported, ready } = useOfflineReady();
  if (!supported) return null;
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ready ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700"}`}>
      {ready ? "Offline ready" : "Preparing offline"}
    </span>
  );
}


