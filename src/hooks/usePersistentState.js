import { useEffect, useRef, useState } from 'react'

const PREFIX = 'aura-atelier:'

/**
 * State mirrored into localStorage, so a bag survives a reload or a tab
 * restore — the thing shoppers most expect and most often lose.
 *
 * Storage is treated as untrusted: it can be unavailable (private mode,
 * blocked cookies), full, or hold data written by an older version of the app.
 * `validate` gets the chance to reject anything that no longer fits, and any
 * failure falls back to the initial value rather than taking the page down.
 */
export function usePersistentState(key, initialValue, validate) {
  const storageKey = PREFIX + key

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw == null) return initialValue
      const parsed = JSON.parse(raw)
      if (validate && !validate(parsed)) return initialValue
      return parsed
    } catch {
      return initialValue
    }
  })

  // Skip the write on first render — it would only rewrite what we just read.
  const hydrated = useRef(false)
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true
      return
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // Quota exceeded or storage disabled — the app still works in memory.
    }
  }, [storageKey, value])

  return [value, setValue]
}
