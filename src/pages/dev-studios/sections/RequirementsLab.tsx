"use client";

import React, { useMemo, useState } from "react";
import { ClipboardList, Users, Layers } from "lucide-react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

type UseCase = { actor: string; goal: string };
type Concept = { name: string; note: string };

const defaultActors = ["Customer", "Support agent", "Admin", "Payment provider", "Email service"];

export default function RequirementsLab() {
  const [problem, setProblem] = useState("Build a small service that lets users browse books and place orders.");
  const [actors, setActors] = useState<string[]>(defaultActors);
  const [actorDraft, setActorDraft] = useState("");
  const [useCases, setUseCases] = useState<UseCase[]>([
    { actor: "Customer", goal: "Browse books and see details" },
    { actor: "Customer", goal: "Place an order and get a confirmation" },
  ]);
  const [useCaseDraft, setUseCaseDraft] = useState<UseCase>({ actor: "Customer", goal: "" });

  const [fr, setFr] = useState<string[]>([
    "Users can browse a catalogue of books.",
    "Users can place an order and receive a confirmation.",
  ]);
  const [nfr, setNfr] = useState<string[]>([
    "Availability: the catalogue remains usable during partial outages.",
    "Security: only authorised users can view order history.",
    "Performance: key pages load quickly on mobile networks.",
  ]);
  const [frDraft, setFrDraft] = useState("");
  const [nfrDraft, setNfrDraft] = useState("");

  const [concepts, setConcepts] = useState<Concept[]>([
    { name: "Book", note: "A sellable item with title, author, price, stock" },
    { name: "Order", note: "A record of purchase intent, status, and totals" },
    { name: "Customer", note: "A user identity and contact details" },
  ]);
  const [conceptDraft, setConceptDraft] = useState<Concept>({ name: "", note: "" });

  const addActor = () => {
    const a = actorDraft.trim();
    if (!a) return;
    if (actors.includes(a)) return;
    setActors((prev) => [...prev, a]);
    setActorDraft("");
  };

  const addUseCase = () => {
    if (!useCaseDraft.goal.trim()) return;
    setUseCases((prev) => [...prev, { actor: useCaseDraft.actor, goal: useCaseDraft.goal.trim() }]);
    setUseCaseDraft((p) => ({ ...p, goal: "" }));
  };

  const addLine = (kind: "fr" | "nfr") => {
    if (kind === "fr") {
      const t = frDraft.trim();
      if (!t) return;
      setFr((prev) => [...prev, t]);
      setFrDraft("");
      return;
    }
    const t = nfrDraft.trim();
    if (!t) return;
    setNfr((prev) => [...prev, t]);
    setNfrDraft("");
  };

  const addConcept = () => {
    const n = conceptDraft.name.trim();
    const note = conceptDraft.note.trim();
    if (!n || !note) return;
    setConcepts((prev) => [...prev, { name: n, note }]);
    setConceptDraft({ name: "", note: "" });
  };

  const mistakes = useMemo(() => {
    const items: string[] = [];
    if (problem.length < 20) items.push("Problem statement is very short. Add context about who, what, and why.");
    if (nfr.length === 0) items.push("No non-functional requirements. Systems fail on reliability and security more often than on features.");
    if (useCases.length === 0) items.push("No use cases. You need at least one happy path to design around.");
    return items.length ? items : ["Looks reasonable. The next step is turning this into boundaries and interfaces."];
  }, [problem, nfr.length, useCases.length]);

  return (
    <section aria-label="Requirements and domain modelling lab" className="space-y-6">
      <SecurityBanner />

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-sky-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Requirements and domain modelling</h2>
        </div>
        <p className="text-sm text-slate-700">
          This lab teaches you how to frame the problem before you touch architecture. If the requirements are fuzzy, the design will be fancy but wrong.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">1. Problem statement</h3>
            <p className="text-sm text-slate-700">
              Keep it short, but concrete. Include who benefits, what success looks like, and one constraint that matters.
            </p>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Actors and use cases</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Actors</p>
                <div className="flex flex-wrap gap-2">
                  {actors.map((a) => (
                    <span key={a} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800 ring-1 ring-slate-200">
                      {a}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={actorDraft}
                    onChange={(e) => setActorDraft(e.target.value)}
                    placeholder="Add actor"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <button
                    type="button"
                    onClick={addActor}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Use cases</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {useCases.slice(0, 8).map((u, idx) => (
                    <li key={`${u.actor}-${idx}`}>
                      <span className="font-semibold">{u.actor}</span>: {u.goal}
                    </li>
                  ))}
                </ul>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    value={useCaseDraft.actor}
                    onChange={(e) => setUseCaseDraft((p) => ({ ...p, actor: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  >
                    {actors.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <input
                    value={useCaseDraft.goal}
                    onChange={(e) => setUseCaseDraft((p) => ({ ...p, goal: e.target.value }))}
                    placeholder="Goal"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <button type="button" onClick={addUseCase} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                  Add use case
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">3. Functional vs non-functional</h3>
            <p className="text-sm text-slate-700">
              Functional requirements are what the system does. Non-functional requirements are how it behaves under stress, attack, and change.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">Functional</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {fr.slice(0, 8).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    value={frDraft}
                    onChange={(e) => setFrDraft(e.target.value)}
                    placeholder="Add functional requirement"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <button type="button" onClick={() => addLine("fr")} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    Add
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">Non-functional</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {nfr.slice(0, 8).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    value={nfrDraft}
                    onChange={(e) => setNfrDraft(e.target.value)}
                    placeholder="Add non-functional requirement"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <button type="button" onClick={() => addLine("nfr")} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">4. Domain concepts</h3>
            </div>
            <p className="text-sm text-slate-700">
              This is not a database schema. It is a shared language. If engineers and stakeholders cannot name things the same way, delivery slows down.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {concepts.slice(0, 8).map((c) => (
                <div key={c.name} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="mt-1 text-sm text-slate-700">{c.note}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                value={conceptDraft.name}
                onChange={(e) => setConceptDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="Concept"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <input
                value={conceptDraft.note}
                onChange={(e) => setConceptDraft((p) => ({ ...p, note: e.target.value }))}
                placeholder="What it means"
                className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <button type="button" onClick={addConcept} className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Add concept
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Common mistakes</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Listing features without defining success or constraints.</li>
              <li>Skipping non-functional requirements until production forces the issue.</li>
              <li>Using technical jargon as a substitute for clarity.</li>
              <li>Making the domain model match the database because it feels tidy.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Readiness hints</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {mistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



