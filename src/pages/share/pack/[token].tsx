import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

type PackMeta = {
  packId: string;
  title: string;
  projectId?: string | null;
  createdAt: string;
  expiresAt: string;
  bytes?: number;
  kind?: string;
};

export default function SharePackPage() {
  const router = useRouter();
  const token = typeof router.query?.token === "string" ? router.query.token : "";

  const [meta, setMeta] = useState<PackMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!token) return;
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(`/api/share/packs/${encodeURIComponent(token)}/meta`);
        const data = await res.json().catch(() => null);
        if (!alive) return;
        if (!res.ok || !data?.ok) {
          setError(String(data?.error || "This share link is not valid."));
          setMeta(null);
          return;
        }
        setMeta(data.meta as PackMeta);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load pack.");
      } finally {
        if (!alive) return;
        setBusy(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <Layout title={meta?.title ? `Shared pack: ${meta.title}` : "Shared pack"} description="Download a shared AI Studio project pack.">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        <div>
          <p className="eyebrow">Share</p>
          <h1 className="text-3xl font-semibold text-slate-900">{meta?.title || "AI Studio pack"}</h1>
          <p className="mt-2 text-sm text-slate-700">
            This link lets you download a ZIP export pack. If the link has expired, the download will stop working.
          </p>
        </div>

        {busy ? <p className="text-sm text-slate-600">Loading…</p> : null}

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">
            {error}
          </div>
        ) : null}

        {meta ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="grid gap-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Created:</span> {new Date(meta.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Expires:</span> {new Date(meta.expiresAt).toLocaleString()}
              </p>
              {typeof meta.bytes === "number" ? (
                <p>
                  <span className="font-semibold text-slate-900">Size:</span> {Math.max(1, Math.round(meta.bytes / 1024))} KB
                </p>
              ) : null}
            </div>

            <a
              className="button primary"
              href={`/api/share/packs/${encodeURIComponent(token)}`}
              rel="nofollow"
            >
              Download ZIP pack
            </a>

            <p className="text-xs text-slate-600">
              Tip: You can import the project JSON inside the ZIP via <code>/ai-studio/projects</code> → <strong>Import project JSON</strong>.
            </p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

