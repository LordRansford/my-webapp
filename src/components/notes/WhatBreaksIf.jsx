'use client'

export function WhatBreaksIf({ items, enabled, on_toggle }) {
  return (
    <div className="mt-3 rounded-xl border bg-white p-3">
      <div className="text-xs font-semibold text-gray-900">What breaks if</div>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <label key={item.key} className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(enabled[item.key])}
              onChange={(e) => on_toggle(item.key, e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-gray-900">{item.label}</span>
              <span className="block text-xs text-gray-600">{item.help}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
