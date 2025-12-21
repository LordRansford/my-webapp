'use client'

import { DiagramFrame } from './DiagramFrame'

export function BoundaryDiagram({
  title,
  inside = [],
  outside = [],
  boundaryLabel = 'Trust boundary',
  accent = '#2563eb',
  reducedMotion = false,
}) {
  return (
    <DiagramFrame title={title} ariaLabel={title} reducedMotion={reducedMotion}>
      <svg viewBox="0 0 360 200" className="w-full h-auto" role="img" aria-label={title}>
        <rect x="20" y="20" width="320" height="160" rx="16" fill="#f8fafc" stroke="#cbd5e1" />
        <line x1="180" y1="20" x2="180" y2="180" stroke={accent} strokeWidth="3" strokeDasharray="6 4" />
        <text x="180" y="15" textAnchor="middle" className="text-sm fill-gray-700">
          {boundaryLabel}
        </text>
        {inside.map((item, idx) => (
          <g key={idx} data-step={idx}>
            <rect x="40" y={40 + idx * 40} width="110" height="28" rx="6" fill="#eef2ff" stroke={accent} />
            <text x="95" y={58 + idx * 40} textAnchor="middle" className="text-sm fill-gray-800">
              {item}
            </text>
          </g>
        ))}
        {outside.map((item, idx) => (
          <g key={idx} data-step={`out-${idx}`}>
            <rect x="210" y={40 + idx * 40} width="110" height="28" rx="6" fill="#fff7ed" stroke="#cbd5e1" />
            <text x="265" y={58 + idx * 40} textAnchor="middle" className="text-sm fill-gray-800">
              {item}
            </text>
          </g>
        ))}
      </svg>
    </DiagramFrame>
  )
}
