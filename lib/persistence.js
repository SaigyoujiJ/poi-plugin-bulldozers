const STORAGE_KEY = 'poi-plugin-bulldozers.state'

let debounceTimer = null

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return undefined
    return JSON.parse(raw)
  } catch (e) {
    console.warn('[poi-plugin-bulldozers] Failed to load state from localStorage:', e)
    return undefined
  }
}

export function saveState(state) {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    try {
      const serialized = JSON.stringify(state)
      localStorage.setItem(STORAGE_KEY, serialized)
    } catch (e) {
      console.warn('[poi-plugin-bulldozers] Failed to save state to localStorage:', e)
    }
    debounceTimer = null
  }, 300)
}