'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

function safe_json_parse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function encode_state(obj) {
  const json = JSON.stringify(obj)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

function decode_state(b64) {
  const binary = atob(b64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  const json = new TextDecoder().decode(bytes)
  return safe_json_parse(json, null)
}

export function use_tool_state({ tool_id, initial_state }) {
  const [state, set_state] = useState(initial_state)
  const [is_ready, set_is_ready] = useState(false)
  const initial_ref = useRef(initial_state)

  const url_key = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get(`s_${tool_id}`)
  }, [tool_id])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const from_url = url_key ? decode_state(url_key) : null
    if (from_url) {
      set_state(from_url)
      set_is_ready(true)
      return
    }
    const saved = window.localStorage.getItem(`rn_tool_${tool_id}`)
    if (saved) {
      set_state(safe_json_parse(saved, initial_ref.current))
      set_is_ready(true)
      return
    }
    set_is_ready(true)
  }, [tool_id, url_key])

  useEffect(() => {
    if (!is_ready) return
    if (typeof window === 'undefined') return
    window.localStorage.setItem(`rn_tool_${tool_id}`, JSON.stringify(state))
  }, [state, tool_id, is_ready])

  function reset() {
    set_state(initial_ref.current)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`rn_tool_${tool_id}`)
    }
  }

  function copy_share_link() {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    params.set(`s_${tool_id}`, encode_state(state))
    const url = `${window.location.pathname}?${params.toString()}`
    navigator.clipboard.writeText(`${window.location.origin}${url}`)
  }

  function export_json() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application_json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tool_id}_state.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function import_json(file) {
    const text = await file.text()
    const parsed = safe_json_parse(text, null)
    if (parsed) set_state(parsed)
  }

  return {
    state,
    set_state,
    reset,
    copy_share_link,
    export_json,
    import_json,
    is_ready,
  }
}
