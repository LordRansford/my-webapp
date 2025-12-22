"use client"

import { useState } from "react"
import { useToolRunner } from "@/hooks/useToolRunner"
import { safeTrim } from "@/lib/tooling/validation"
import { postJson } from "@/lib/tooling/http"
import ComputeMeterPanel from "@/components/compute/ComputeMeterPanel"
import RunCostPreview from "@/components/compute/RunCostPreview"

export default function EmailHeaderPhishingLab() {
  const [headersText, setHeadersText] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const runner = useToolRunner({ minIntervalMs: 900, toolId: "email-header-phishing-lab" })
  const toolId = "email-header-phishing-lab"

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setResult(null)
    runner.resetError()

    const cleaned = safeTrim(headersText, 12000)
    if (!cleaned) {
      setError("Please paste raw email headers.")
      return
    }

    const meta = { inputBytes: cleaned.length, steps: 1, expectedWallMs: 1200 }
    const pre = runner.prepare(meta)
    if (pre.estimate.creditShortfall) {
      setConfirmOpen(true)
      return
    }

    const data = await runner.run(async (signal) => {
      const res = await postJson("/api/dashboards/email-headers", { headers: cleaned }, { signal })
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
                const cleaned = safeTrim(headersText, 12000)
                if (!cleaned) return
                const meta = { inputBytes: cleaned.length, steps: 1, expectedWallMs: 1200 }
                const data = await runner.run(async (signal) => {
                  const res = await postJson("/api/dashboards/email-headers", { headers: cleaned }, { signal })
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
          maxLength={12000}
          aria-invalid={Boolean(error) || Boolean(runner.errorMessage)}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Do not paste sensitive message content. Headers are usually safe
            because they contain routing data, not the body.
          </p>
          <button
            type="submit"
            disabled={runner.loading}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {runner.loading ? "Analysing..." : "Analyse headers"}
          </button>
        </div>
      </form>

      {error || runner.errorMessage ? (
        <p className="text-sm text-rose-600" role="alert" aria-live="polite">
          {error || runner.errorMessage}
        </p>
      ) : null}

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
