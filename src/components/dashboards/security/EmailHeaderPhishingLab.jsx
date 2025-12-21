"use client"

import { useState } from "react"

export default function EmailHeaderPhishingLab() {
  const [headersText, setHeadersText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setResult(null)

    if (!headersText.trim()) {
      setError("Please paste raw email headers.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/dashboards/email-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers: headersText })
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(
        "There was a problem analysing these headers. Please check the format and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 text-xs text-slate-700">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="email-headers"
          className="block text-sm font-medium text-slate-700"
        >
          Paste raw email headers
        </label>
        <textarea
          id="email-headers"
          rows={6}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          placeholder={`Received: from mail.example.com ...
From: "Example" <info@example.com>
Return-Path: <bounce@another-domain.com>
...`}
          value={headersText}
          onChange={(event) => setHeadersText(event.target.value)}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Do not paste sensitive message content. Headers are usually safe
            because they contain routing data, not the body.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Analysing..." : "Analyse headers"}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-sm text-rose-600" aria-live="polite">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Hop timeline
            </h3>
            <ol className="mt-2 space-y-2">
              {result.hops?.map((hop, index) => (
                <li
                  key={index}
                  className="flex gap-2 rounded-xl bg-white p-2 shadow-sm"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-medium text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-mono break-all text-sm">
                      {hop.server}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {hop.info}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <h3 className="text-sm font-semibold text-slate-900">SPF</h3>
              <p className="mt-1 text-sm text-slate-600">
                Result:{" "}
                <span className="font-semibold">
                  {result.spf?.result || "Unknown"}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Detail: {result.spf?.detail || "Not provided."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <h3 className="text-sm font-semibold text-slate-900">DKIM</h3>
              <p className="mt-1 text-sm text-slate-600">
                Result:{" "}
                <span className="font-semibold">
                  {result.dkim?.result || "Unknown"}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Detail: {result.dkim?.detail || "Not provided."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <h3 className="text-sm font-semibold text-slate-900">DMARC</h3>
              <p className="mt-1 text-sm text-slate-600">
                Result:{" "}
                <span className="font-semibold">
                  {result.dmarc?.result || "Unknown"}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Policy: {result.dmarc?.policy || "Not visible in headers."}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Alignment and risk
            </h3>
            <p className="mt-1 text-sm text-slate-700">
              From:{" "}
              <span className="font-mono break-all">
                {result.fromAddress || "Unknown"}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Return Path:{" "}
              <span className="font-mono break-all">
                {result.returnPath || "Unknown"}
              </span>
            </p>
            {result.summary && (
              <p className="mt-2 text-sm text-slate-700">
                {result.summary}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
