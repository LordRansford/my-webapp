"use client"

import { useState } from "react"

export default function PhishingLinkExplainer() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setResult(null)

    if (!url.trim()) {
      setError("Please paste a URL.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/dashboards/phishing-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() })
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(
        "There was a problem analysing this URL. Please check the format and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 text-xs text-slate-700">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="phishing-url">
          Suspicious URL
        </label>
        <input
          id="phishing-url"
          type="text"
          placeholder="https://example.com.security-login.net/path"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Analysing..." : "Analyse link"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-rose-600" aria-live="polite">
          {error}
        </p>
      )}

      {!result && !loading && !error && (
        <p className="text-[11px] text-slate-500">
          This tool does not visit the URL. It only parses the text and looks for patterns that are common in phishing links.
        </p>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Domain and host
            </h3>
            <p className="mt-1 text-[11px] text-slate-700">
              Original host:{" "}
              <span className="font-mono break-all">{result.host}</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-700">
              Normalised host:{" "}
              <span className="font-mono break-all">
                {result.normalisedHost || result.host}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-slate-700">
              Uses IP address:{" "}
              <span className="font-semibold">
                {result.usesIp ? "Yes" : "No"}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-slate-700">
              Top level domain:{" "}
              <span className="font-mono">{result.tld}</span>
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Path and query
            </h3>
            <p className="mt-1 text-[11px] text-slate-700">
              Path:{" "}
              <span className="font-mono break-all">
                {result.path || "/"}
              </span>
            </p>
            {result.keywords?.length > 0 && (
              <p className="mt-2 text-[11px] text-slate-700">
                Keywords detected:{" "}
                <span className="font-mono">
                  {result.keywords.join(", ")}
                </span>
              </p>
            )}
          </section>

          <section className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Assessment
            </h3>
            {result.flags?.length > 0 ? (
              <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
                {result.flags.map((flag, index) => (
                  <li key={index}>• {flag}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[11px] text-slate-700">
                No obvious phishing patterns were detected from the URL text alone.
              </p>
            )}
            {result.summary && (
              <p className="mt-2 text-[11px] text-slate-700">
                {result.summary}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
