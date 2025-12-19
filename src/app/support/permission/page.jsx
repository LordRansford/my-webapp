"use client";

import { useState } from "react";
import { setPermissionToken } from "@/lib/entitlements/entitlements";

export default function PermissionRequestPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    template: "",
    useCase: "",
    confirm: false,
  });
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");

  const updateField = (field) => (event) => {
    const value = field === "confirm" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setToken("");
    if (!form.confirm) {
      setStatus("You must confirm you understand the terms.");
      return;
    }
    try {
      const res = await fetch("/api/permission-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setStatus("Request captured. Copy the message below for your records.");
      setToken(data.token);
      setPermissionToken(data.token);
    } catch (error) {
      setStatus(error.message || "Could not submit request. Copy the details and email manually.");
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Permission</p>
        <h1 className="text-3xl font-semibold text-slate-900">Request permission to remove attribution</h1>
        <p className="text-base text-slate-700">
          Commercial exports keep attribution by default. If you need to remove it, submit this request or donate. A token will
          unlock commercial exports without attribution once approved.
        </p>
        <p className="text-sm text-slate-700">
          These resources are educational and planning aids. They are not legal advice and do not replace professional security
          testing. Only use them on systems you are permitted to work on.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <label className="block text-sm font-semibold text-slate-900">
          Your name
          <input
            type="text"
            value={form.name}
            onChange={updateField("name")}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-slate-900">
          Email
          <input
            type="email"
            value={form.email}
            onChange={updateField("email")}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-slate-900">
          Template
          <input
            type="text"
            value={form.template}
            onChange={updateField("template")}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Which template or category?"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-slate-900">
          Intended commercial use
          <textarea
            value={form.useCase}
            onChange={updateField("useCase")}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            rows={4}
            placeholder="Describe the client or project, expected use, and attribution needs."
            required
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-800">
          <input type="checkbox" checked={form.confirm} onChange={updateField("confirm")} />
          <span>
            I understand that these templates are educational, not legal advice, and that permission is required before removing
            attribution for commercial use.
          </span>
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Submit request
        </button>

        {status && <p className="text-sm font-semibold text-slate-800">{status}</p>}
        {token && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            <p className="font-semibold">Permission token</p>
            <p className="break-all text-xs text-slate-700">{token}</p>
            <p className="mt-2 text-xs text-slate-700">
              This token is saved in your browser and stored locally for audit. It unlocks commercial exports without attribution.
            </p>
            <p className="mt-2 text-xs text-slate-700">
              If email is not configured, copy the details above and send them to the site owner manually.
            </p>
          </div>
        )}
      </form>
    </main>
  );
}
