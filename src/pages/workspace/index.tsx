"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Project = { id: string; title: string; topic: string; updatedAt: string };

const LOCAL_KEY = "rn_workspace_projects_v1";
type LocalProject = Project & { localOnly?: boolean };

function readLocalProjects(): LocalProject[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const items = Array.isArray(parsed) ? parsed : [];
    return items
      .map((p: any) => ({
        id: String(p?.id || ""),
        title: String(p?.title || ""),
        topic: String(p?.topic || ""),
        updatedAt: String(p?.updatedAt || new Date().toISOString()),
        localOnly: true,
      }))
      .filter((p: any) => p.id && p.title);
  } catch {
    return [];
  }
}

function writeLocalProjects(projects: LocalProject[]) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(projects));
  } catch {
    // ignore
  }
}

function newLocalId() {
  // readable, unique enough for local-only usage
  return `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function WorkspaceHomePage() {
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("software");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { data: session } = useSession();
  const authed = Boolean(session?.user?.id);
  const [claiming, setClaiming] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return projects;
    return projects.filter((p) => String(p.title || "").toLowerCase().includes(s));
  }, [projects, q]);

  const load = async () => {
    // Anonymous mode: local-only projects (as the UI promises).
    if (!authed) {
      const items = readLocalProjects();
      const s = q.trim().toLowerCase();
      setProjects(s ? items.filter((p) => p.title.toLowerCase().includes(s)) : items);
      return;
    }

    const res = await fetch(`/api/workspace/projects?q=${encodeURIComponent(q.trim())}`);
    const data = await res.json().catch(() => null);
    if (data?.ok) setProjects(data.projects || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async () => {
    setBusy(true);
    setError(null);

    // Anonymous mode: local-only project creation (no DB, no API).
    if (!authed) {
      const t = title.trim().slice(0, 80);
      if (!t) {
        setError("Title is required.");
        setBusy(false);
        return;
      }
      const now = new Date().toISOString();
      const next: LocalProject = { id: newLocalId(), title: t, topic, updatedAt: now, localOnly: true };
      const current = readLocalProjects();
      const merged = [next, ...current].slice(0, 50);
      writeLocalProjects(merged);
      setTitle("");
      await load();
      setBusy(false);
      return;
    }

    const res = await fetch("/api/workspace/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, topic }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setError(String(data?.error || "Could not create project."));
      setBusy(false);
      return;
    }
    setTitle("");
    await load();
    setBusy(false);
  };

  const claim = async () => {
    setClaiming(true);
    setError(null);
    const res = await fetch("/api/workspace/claim", { method: "POST" });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setError(String(data?.error || "Could not claim workspace."));
      setClaiming(false);
      return;
    }
    await load();
    setClaiming(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Workspace</h1>
        <p className="text-slate-700">
          Projects save your runs and notes so you can come back later. If you are not signed in, we store this on this device.
        </p>
        {authed ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>If you used Workspace without signing in, you can claim it now.</span>
            <button
              type="button"
              onClick={claim}
              disabled={claiming}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
            >
              {claiming ? "Claiming..." : "Claim this workspace"}
            </button>
          </div>
        ) : null}
      </header>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</div> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Create a new project</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              placeholder="My code notebook"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-700">Topic</span>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="software">software</option>
              <option value="ai">ai</option>
              <option value="cyber">cyber</option>
              <option value="data">data</option>
              <option value="digitalisation">digitalisation</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={create}
          disabled={busy || !title.trim()}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
        >
          {busy ? "Creating..." : "Create project"}
        </button>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent projects</h2>
          <label className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              placeholder="Search titles"
            />
            <button
              type="button"
              onClick={load}
              className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400"
            >
              Go
            </button>
          </label>
        </div>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-700">
              No projects yet.
            </div>
          ) : (
            filtered.map((p) =>
              p.localOnly ? (
                <div key={p.id} className="block rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{p.title}</p>
                      <p className="text-xs text-slate-600">topic: {p.topic} • stored on this device</p>
                    </div>
                    <p className="text-xs text-slate-600">{new Date(p.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <Link
                  key={p.id}
                  href={`/workspace/${encodeURIComponent(p.id)}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{p.title}</p>
                      <p className="text-xs text-slate-600">topic: {p.topic}</p>
                    </div>
                    <p className="text-xs text-slate-600">{new Date(p.updatedAt).toLocaleString()}</p>
                  </div>
                </Link>
              )
            )
          )}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <Link href="/studios" className="text-sm font-semibold text-slate-700 hover:underline">
          Back to labs
        </Link>
        <Link href="/tools/code-lab" className="text-sm font-semibold text-emerald-700 hover:underline">
          Open Code Lab
        </Link>
      </div>
    </main>
  );
}


