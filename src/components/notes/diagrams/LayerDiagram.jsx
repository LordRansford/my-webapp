'use client'

import { DiagramFrame } from './DiagramFrame'

export function LayerDiagram({
  title,
  layers = [],
  accent = '#2563eb',
  showMapping = false,
  reducedMotion = false,
  highlight = -1,
}) {
  const height = layers.length * 40 + 20
  return (
    <DiagramFrame title={title} ariaLabel={title} reducedMotion={reducedMotion}>
      <svg viewBox={`0 0 300 ${height}`} className="w-full h-auto" role="img" aria-label={title}>
        {layers.map((layer, idx) => {
          const y = 10 + idx * 40
          const active = idx === highlight
          return (
            <g key={layer.label} data-step={idx}>
              <rect
                x="20"
                y={y}
                width="160"
                height="32"
                rx="8"
                fill={active ? '#e0e7ff' : '#f8fafc'}
                stroke={active ? accent : '#cbd5e1'}
                strokeWidth={active ? 2 : 1}
              />
              <text x="100" y={y + 20} textAnchor="middle" className={`text-[12px] ${active ? 'fill-gray-900 font-semibold' : 'fill-gray-800'}`}>
                {layer.label}
              </text>
              {showMapping && layer.mapTo ? (
                <>
                  <rect x="200" y={y} width="80" height="32" rx="8" fill="#eef2ff" stroke={accent} />
                  <text x="240" y={y + 20} textAnchor="middle" className="text-[11px] fill-gray-800">
                    {layer.mapTo}
                  </text>
                  <line
                    x1="180"
                    y1={y + 16}
                    x2="200"
                    y2={y + 16}
                    stroke={accent}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead-layer)"
                  />
                </>
              ) : null}
            </g>
          )
        })}
        <defs>
          <marker id="arrowhead-layer" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={accent} />
          </marker>
        </defs>
      </svg>
    </DiagramFrame>
  )
}
