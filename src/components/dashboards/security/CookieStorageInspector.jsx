"use client";

import { useEffect, useState } from "react";

export default function CookieStorageInspector() {
  const [hostInfo, setHostInfo] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadStorage = () => {
      if (typeof window === "undefined") return;

      const cookies = document.cookie
        ? document.cookie.split(";").map((item) => {
            const [name, ...rest] = item.split("=");
            return {
              name: name.trim(),
              value: rest.join("=").trim(),
            };
          })
        : [];

      const localEntries = [];
      try {
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            if (value) {
              localEntries.push({ key, value: String(value) });
            }
          }
        }
      } catch (err) {
        console.error("Error reading localStorage:", err);
      }

      const sessionEntries = [];
      try {
        for (let i = 0; i < sessionStorage.length; i += 1) {
          const key = sessionStorage.key(i);
          if (key) {
            const value = sessionStorage.getItem(key);
            if (value) {
              sessionEntries.push({ key, value: String(value) });
            }
          }
        }
      } catch (err) {
        console.error("Error reading sessionStorage:", err);
      }

      setHostInfo({
        cookies,
        localEntries,
        sessionEntries,
      });
    };

    loadStorage();

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4 text-xs text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm text-slate-600">Loading cookie and storage information...</p>
        </div>
      </div>
    );
  }

  if (!hostInfo) {
    return (
      <div className="space-y-4 text-xs text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm text-slate-600">Loading cookie and storage information for this site...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs text-slate-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-600">
          This inspector shows cookies and storage for <strong>{typeof window !== "undefined" ? window.location.hostname : "this site"}</strong>
        </p>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              const cookies = document.cookie
                ? document.cookie.split(";").map((item) => {
                    const [name, ...rest] = item.split("=");
                    return {
                      name: name.trim(),
                      value: rest.join("=").trim(),
                    };
                  })
                : [];

              const localEntries = [];
              for (let i = 0; i < localStorage.length; i += 1) {
                const key = localStorage.key(i);
                if (key) {
                  const value = localStorage.getItem(key);
                  if (value) {
                    localEntries.push({ key, value: String(value) });
                  }
                }
              }

              const sessionEntries = [];
              for (let i = 0; i < sessionStorage.length; i += 1) {
                const key = sessionStorage.key(i);
                if (key) {
                  const value = sessionStorage.getItem(key);
                  if (value) {
                    sessionEntries.push({ key, value: String(value) });
                  }
                }
              }

              setHostInfo({
                cookies,
                localEntries,
                sessionEntries,
              });
            }
          }}
          className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Cookies</h3>
        {hostInfo.cookies.length === 0 ? (
          <p className="mt-1 text-slate-600">No cookies are set for this site.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {hostInfo.cookies.map((cookie) => (
              <li key={cookie.name} className="rounded-lg bg-white p-2 shadow-sm">
                <p className="font-mono break-all text-xs">
                  <span className="font-semibold">{cookie.name}</span> = {cookie.value || "<empty>"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  This view cannot see flags such as HttpOnly or Secure, but you can treat long names that look random as likely technical cookies.
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Local storage</h3>
        {hostInfo.localEntries.length === 0 ? (
          <p className="mt-1 text-slate-600">No local storage keys are set for this site.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {hostInfo.localEntries.map((entry) => (
              <li key={entry.key} className="rounded-lg bg-white p-2 shadow-sm">
                <p className="font-mono break-all text-xs font-semibold text-slate-900">{entry.key}</p>
                <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-100">
                  <p className="break-all text-sm text-slate-600 font-mono whitespace-pre-wrap">{entry.value}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Session storage</h3>
        {hostInfo.sessionEntries.length === 0 ? (
          <p className="mt-1 text-slate-600">No session storage keys are set for this site.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {hostInfo.sessionEntries.map((entry) => (
              <li key={entry.key} className="rounded-lg bg-white p-2 shadow-sm">
                <p className="font-mono break-all text-xs font-semibold text-slate-900">{entry.key}</p>
                <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-100">
                  <p className="break-all text-sm text-slate-600 font-mono whitespace-pre-wrap">{entry.value}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-sm text-slate-500">
        This tool never sends cookie or storage contents to the server. Everything happens in your browser. It is here to help you understand what this site remembers about you while you browse.
      </p>
    </div>
  );
}
