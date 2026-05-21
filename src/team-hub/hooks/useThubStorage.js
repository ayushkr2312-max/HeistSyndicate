import { useCallback, useMemo, useState } from 'react'
import { DEFAULTS_BY_KEY, saveKey } from '../storage/defaults.js'

export function readThubKey(key) {
  const fallback = DEFAULTS_BY_KEY[key]()
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (parsed == null || typeof parsed !== 'object') return fallback
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback
    }
    return { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}

export function useThubStorage(key) {
  const [data, setData] = useState(() => readThubKey(key))

  const update = useCallback((next) => {
    setData((prev) => {
      const value = typeof next === 'function' ? next(prev) : next
      saveKey(key, value)
      return value
    })
  }, [key])

  return [data, update]
}

export function useThubBundle() {
  return useMemo(() => {
    const out = {}
    for (const key of Object.keys(DEFAULTS_BY_KEY)) {
      out[key] = readThubKey(key)
    }
    return out
  }, [])
}
