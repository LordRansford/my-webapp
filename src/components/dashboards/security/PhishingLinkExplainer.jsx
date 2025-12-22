"use client"

import { useState } from "react"
import { useToolRunner } from "@/hooks/useToolRunner"
import { safeTrim } from "@/lib/tooling/validation"
import { postJson } from "@/lib/tooling/http"
import ComputeMeterPanel from "@/components/compute/ComputeMeterPanel"
import RunCostPreview from "@/components/compute/RunCostPreview"

export default function PhishingLinkExplainer() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const runner = useToolRunner({ minIntervalMs: 800, toolId: "phishing-link-explainer" })
  const toolId = "phishing-link-explainer"

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setResult(null)
    runner.resetError()

    const cleaned = safeTrim(url, 2048)
    if (!cleaned) {
      setError("Please paste a URL.")
      return
    }

    const meta = { inputBytes: cleaned.length, steps: 2, expectedWallMs: 1000 }
    const pre = runner.prepare(meta)
    if (pre.estimate.creditShortfall) {
      setConfirmOpen(true)
      return
    }

    const data = await runner.run(async (signal) => {
      const res = await postJson("/api/dashboards/phishing-link", { url: cleaned }, { signal })
      if (!res.ok) throw new Error("Request failed")
      return res.data
    }, meta)

    if (data) setResult(data)
    if (!data && runner.errorMessage) setError(runner.errorMessage)
  }

  return (
    <div className="space-y-4 text-xs text-slate-700">
      <RunCostPreview estimate={runner.compute.pre} creditsBalance={runner.compute.creditsVisible ? runner.compute.creditsBalance : null} />
      <ComputeMeterPanel toolId={toolId} phase="pre" estimate={runner.compute.pre} inputBytes={runner.compute.lastInputBytes || undefined} />
      {runner.compute.post ? <ComputeMeterPanel toolId={toolId} phase="post" estimate={runner.compute.post} inputBytes={runner.compute.lastInputBytes || undefined} /> : null}

      {confirmOpen ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <p className="text-sm font-semibold text-amber-900">Credit warning</p>
          <p className="mt-1 text-sm text-amber-900">This run may exceed your visible credit balance. You can cancel or continue.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="button"
              onClick={() => {
                setConfirmOpen(false)
                runner.clearCompute()
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button primary"
              onClick={async () => {
                setConfirmOpen(false)
                const cleaned = safeTrim(url, 2048)
                if (!cleaned) return
                const meta = { inputBytes: cleaned.length, steps: 2, expectedWallMs: 1000 }
                const data = await runner.run(async (signal) => {
                  const res = await postJson("/api/dashboards/phishing-link", { url: cleaned }, { signal })
                  if (!res.ok) throw new Error("Request failed")
                  return res.data
                }, meta)
                if (data) setResult(data)
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

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
          maxLength={2048}
          aria-invalid={Boolean(error) || Boolean(runner.errorMessage)}
        />
        <button
          type="submit"
          disabled={runner.loading}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {runner.loading ? "Analysing..." : "Analyse link"}
        </button>
      </form>

      {error || runner.errorMessage ? (
        <p className="text-sm text-rose-600" role="alert" aria-live="polite">
          {error || runner.errorMessage}
        </p>
      ) : null}

      {!result && !runner.loading && !(error || runner.errorMessage) && (
        <p className="text-sm text-slate-500">
          This tool does not visit the URL. It only parses the text and looks for patterns that are common in phishing links.
        </p>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Domain and host
            </h3>
            <p className="mt-1 text-sm text-slate-700">
              Original host:{" "}
              <span className="font-mono break-all">{result.host}</span>
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Normalised host:{" "}
              <span className="font-mono break-all">
                {result.normalisedHost || result.host}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Uses IP address:{" "}
              <span className="font-semibold">
                {result.usesIp ? "Yes" : "No"}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Top level domain:{" "}
              <span className="font-mono">{result.tld}</span>
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Path and query
            </h3>
            <p className="mt-1 text-sm text-slate-700">
              Path:{" "}
              <span className="font-mono break-all">
                {result.path || "/"}
              </span>
            </p>
            {result.keywords?.length > 0 && (
              <p className="mt-2 text-sm text-slate-700">
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
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {result.flags.map((flag, index) => (
                  <li key={index}>• {flag}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-700">
                No obvious phishing patterns were detected from the URL text alone.
              </p>
            )}
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
