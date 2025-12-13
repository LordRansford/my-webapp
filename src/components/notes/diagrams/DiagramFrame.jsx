'use client'

import { useEffect, useRef } from 'react'

export function DiagramFrame({ title, children, ariaLabel, highlightStep, reducedMotion = false }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || reducedMotion) return
    if (highlightStep != null) {
      const el = ref.current.querySelector(`[data-step="${highlightStep}"]`)
      if (el) {
        el.classList.add('ring-2', 'ring-blue-400')
        return () => el.classList.remove('ring-2', 'ring-blue-400')
      }
    }
  }, [highlightStep, reducedMotion])

  return (
    <figure
      ref={ref}
      className="my-4 rounded-2xl border bg-white p-3 shadow-sm"
      aria-label={ariaLabel || title}
    >
      {title ? <figcaption className="text-sm font-semibold text-gray-900 mb-2">{title}</figcaption> : null}
      <div className="relative">{children}</div>
    </figure>
  )
}
