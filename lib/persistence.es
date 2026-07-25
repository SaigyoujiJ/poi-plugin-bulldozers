import { lookupAircraft } from './calc/aircraftData'
import { getSlotCount } from './calc/planeType'

const STORAGE_KEY = 'poi-plugin-bulldozers.state'

let debounceTimer = null

// 旧版本 reducer 在缺少游戏数据的环境里把非 18 搭载数的飞机错误写成 18
//（陆侦/舰侦/水侦/飞行艇应为 4，深山系应为 9）。加载时把超出分类上限的
// count 收敛为 null（= 默认搭载数，由视图/计算层按分类推导）。
function sanitizeState(state) {
  if (!state || !state.presets) return state
  for (const preset of Object.values(state.presets)) {
    if (!preset || !preset.squadrons) continue
    for (const squadron of preset.squadrons) {
      if (!squadron || !squadron.slots) continue
      for (const slot of squadron.slots) {
        if (!slot || !slot.aircraftId || slot.count == null) continue
        const planeInfo = lookupAircraft(slot.aircraftId)
        if (!planeInfo) continue
        const maxCount = getSlotCount(planeInfo.aircraft, planeInfo.categoryKey)
        if (slot.count > maxCount) {
          slot.count = null
        }
      }
    }
  }
  return state
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return undefined
    return sanitizeState(JSON.parse(raw))
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