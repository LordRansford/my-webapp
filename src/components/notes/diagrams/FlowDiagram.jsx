'use client'

import { DiagramFrame } from './DiagramFrame'

export function FlowDiagram({ title, steps = [], accent = '#2563eb', reducedMotion = false, highlight = -1 }) {
  return (
    <DiagramFrame title={title} ariaLabel={title} reducedMotion={reducedMotion}>
      <svg viewBox={`0 0 ${steps.length * 140} 140`} role="img" aria-label={title} className="w-full h-auto">
        {steps.map((step, idx) => {
          const x = 40 + idx * 140
          const active = idx === highlight
          return (
            <g key={idx} data-step={idx} className="transition">
              <rect
                x={x - 30}
                y={40}
                width="120"
                height="60"
                rx="12"
                fill={active ? '#e0e7ff' : '#f8fafc'}
                stroke={active ? accent : '#cbd5e1'}
                strokeWidth={active ? 2 : 1}
              />
              <text x={x + 30} y={75} textAnchor="middle" className={`text-[12px] ${active ? 'fill-gray-900 font-semibold' : 'fill-gray-800'}`}>
                {step}
              </text>
              {idx < steps.length - 1 ? (
                <g>
                  <line
                    x1={x + 60}
                    y1={70}
                    x2={x + 90}
                    y2={70}
                    stroke={accent}
                    strokeWidth="3"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              ) : null}
            </g>
          )
        })}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={accent} />
          </marker>
        </defs>
      </svg>
    </DiagramFrame>
  )
}
