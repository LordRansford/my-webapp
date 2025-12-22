"use client"

import { useState } from "react"
import { useToolRunner } from "@/hooks/useToolRunner"
import { normaliseUrl } from "@/lib/tooling/validation"
import { postJson } from "@/lib/tooling/http"
import ComputeEstimatePanel from "@/components/compute/ComputeEstimatePanel"
import ComputeSummaryPanel from "@/components/compute/ComputeSummaryPanel"

export default function ThirdPartyScriptViewer() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const runner = useToolRunner({ minIntervalMs: 900, toolId: "third-party-script-viewer" })
  const toolId = "third-party-script-viewer"

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setResult(null)

    runner.resetError()

    const parsed = normaliseUrl(url)
    if (!parsed.ok) {
      setError(parsed.message)
      return
    }

    const meta = { inputBytes: parsed.url.length, steps: 4, expectedWallMs: 1200 }
    runner.prepare(meta)

    const data = await runner.run(async (signal) => {
      const res = await postJson("/api/dashboards/thirdparty-scripts", { url: parsed.url }, { signal })
      if (!res.ok) throw new Error("Request failed")
      return res.data
    }, meta)

    if (data) setResult(data)
    if (!data && runner.errorMessage) setError(runner.errorMessage)
  }

  return (
    <div className="space-y-4 text-xs text-slate-700">
      <ComputeEstimatePanel estimate={runner.compute.pre || runner.compute.live} />
      <ComputeSummaryPanel toolId={toolId} summary={runner.compute.post} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="scripts-url">
          Page URL
        </label>
        <div className="flex-1 relative" style={{ zIndex: 10 }}>
          <input
            id="scripts-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            style={{
              pointerEvents: "auto",
              position: "relative",
              zIndex: 10,
            }}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            maxLength={2048}
            aria-invalid={Boolean(error) || Boolean(runner.errorMessage)}
          />
        </div>
        <button
          type="submit"
          disabled={runner.loading}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {runner.loading ? "Scanning..." : "Scan scripts"}
        </button>
      </form>

      {(error || runner.errorMessage) && (
        <div 
          className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3"
          style={{
            pointerEvents: "none",
            position: "relative",
            zIndex: 1,
            marginTop: "0.5rem",
          }}
          role="alert"
        >
          <p className="text-sm text-rose-700 font-medium" aria-live="polite">
            {error || runner.errorMessage}
          </p>
        </div>
      )}

      {!result && !runner.loading && !(error || runner.errorMessage) && (
        <p className="text-sm text-slate-500">
          The backend fetches only the HTML and script tags for the page. It does not execute scripts. Results are for education, not a full supply chain audit.
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
            <p className="mt-1 text-sm text-slate-700">
              {result.summary || "No summary provided by API."}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Scripts</h3>
            {result.scripts?.length ? (
              <ul className="mt-2 space-y-2">
                {result.scripts.map((script) => (
                  <li
                    key={script.src}
                    className="rounded-xl bg-white p-2 shadow-sm"
                  >
                    <p className="font-mono break-all text-sm">
                      {script.src || "<inline script>"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Origin type:{" "}
                      <span className="font-semibold">
                        {script.thirdParty ? "Third party" : "First party"}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      SRI present:{" "}
                      <span className="font-semibold">
                        {script.hasIntegrity ? "Yes" : "No"}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-600">
                No script tags were found for this page.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
