'use client'

export function ToolStateActions({ onReset, onCopy, onExport, onImport }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      {onReset ? (
        <button
          onClick={onReset}
          className="rounded-full border px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Reset
        </button>
      ) : null}
      {onCopy ? (
        <button
          onClick={onCopy}
          className="rounded-full border px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Copy link
        </button>
      ) : null}
      {onExport ? (
        <button
          onClick={onExport}
          className="rounded-full border px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Export
        </button>
      ) : null}
      {onImport ? (
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-gray-700 hover:bg-gray-100 focus-within:ring focus-within:ring-blue-200">
          <span>Import</span>
          <input
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImport(file)
              e.target.value = ''
            }}
            className="hidden"
          />
        </label>
      ) : null}
    </div>
  )
}

export default ToolStateActions
