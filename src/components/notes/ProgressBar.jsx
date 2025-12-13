'use client'

import { useEffect, useState } from 'react'

export function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
      setProgress(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed left-0 top-0 z-20 h-1 w-full bg-gray-100">
      <div
        className="h-1 bg-blue-500 transition-[width]"
        style={{ width: `${progress}%` }}
        aria-label="Reading progress"
      />
    </div>
  )
}
