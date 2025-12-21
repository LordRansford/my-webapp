'use client'

import { DiagramFrame } from './DiagramFrame'

export function ComparisonDiagram({ title, left, right, accent = '#2563eb', reducedMotion = false }) {
  return (
    <DiagramFrame title={title} ariaLabel={title} reducedMotion={reducedMotion}>
      <svg viewBox="0 0 360 160" className="w-full h-auto" role="img" aria-label={title}>
        <rect x="30" y="40" width="130" height="80" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
        <rect x="200" y="40" width="130" height="80" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="95" y="65" textAnchor="middle" className="text-sm fill-gray-800">
          {left?.label}
        </text>
        <text x="95" y="95" textAnchor="middle" className="text-sm fill-gray-600">
          {left?.detail}
        </text>
        <text x="265" y="65" textAnchor="middle" className="text-sm fill-gray-800">
          {right?.label}
        </text>
        <text x="265" y="95" textAnchor="middle" className="text-sm fill-gray-600">
          {right?.detail}
        </text>
        <line x1="160" y1="80" x2="200" y2="80" stroke={accent} strokeWidth="2" markerEnd="url(#arrowhead-compare)" />
        <defs>
          <marker id="arrowhead-compare" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={accent} />
          </marker>
        </defs>
      </svg>
    </DiagramFrame>
  )
}
