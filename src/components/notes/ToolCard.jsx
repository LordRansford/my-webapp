"use client";

import { useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

export function ToolCard({
  title,
  description,
  tool_id,
  default_open = false,
  modes = ['guided', 'explore', 'stress'],
  mode,
  on_mode_change,
  actions,
  children,
  lazy = false,
}) {
  const [open, set_open] = useState(default_open)
  const [mounted, set_mounted] = useState(default_open)

  useEffect(() => {
    if (open && !mounted) set_mounted(true)
  }, [open, mounted])

  const show_modes = useMemo(() => Boolean(on_mode_change) && modes && modes.length > 0, [modes, on_mode_change])

  const content_ready = !lazy || mounted

  return (
    <section className="my-6 rounded-2xl border bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          {description ? <p className="mt-1 text-xs text-gray-600">{description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {show_modes ? (
            <div className="hidden sm:flex rounded-full border bg-gray-50 p-1">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => on_mode_change(m)}
                  className={`px-3 py-1 text-xs rounded-full transition ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                  aria-label={`Mode ${m}`}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : null}
          <button
            onClick={() => set_open((v) => !v)}
            className="rounded-full border px-3 py-1 text-xs text-gray-700 hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-300"
            aria-expanded={open}
          >
            {open ? 'Hide' : 'Open'}
          </button>
        </div>
      </header>

      {open ? (
        <div className="px-4 pb-4">
          {actions ? <div className="mb-3 flex flex-wrap gap-2">{actions}</div> : null}
          <div className="rounded-xl bg-gray-50 p-3">
            {content_ready ? (
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            ) : (
              <p className="text-sm text-gray-600">Loading tool.</p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default ToolCard
