'use client'

import { DiagramFrame } from './DiagramFrame'

export function TimelineDiagram({ title, events = [], accent = '#2563eb', reducedMotion = false }) {
  const width = Math.max(320, events.length * 140)
  return (
    <DiagramFrame title={title} ariaLabel={title} reducedMotion={reducedMotion}>
      <svg viewBox={`0 0 ${width} 120`} className="w-full h-auto" role="img" aria-label={title}>
        <line x1="40" y1="60" x2={width - 40} y2="60" stroke="#cbd5e1" strokeWidth="2" />
        {events.map((ev, idx) => {
          const x = 40 + idx * ((width - 80) / Math.max(1, events.length - 1))
          return (
            <g key={idx} data-step={idx}>
              <circle cx={x} cy="60" r="10" fill="#eef2ff" stroke={accent} strokeWidth="2" />
              <text x={x} y="40" textAnchor="middle" className="text-sm fill-gray-800">
                {ev.label}
              </text>
              <text x={x} y="90" textAnchor="middle" className="text-[10px] fill-gray-600">
                {ev.detail}
              </text>
            </g>
          )
        })}
      </svg>
    </DiagramFrame>
  )
}
