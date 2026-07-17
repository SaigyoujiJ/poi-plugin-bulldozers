import { buildAircraftData, CATEGORY_DISPLAY, CATEGORY_GROUPS, CATEGORY_STATS } from './poiData'

let cachedEquips = null
let cachedData = null

function getData() {
  const $equips = (typeof window !== 'undefined' && window.getStore)
    ? window.getStore('const.$equips')
    : null
  if ($equips === cachedEquips) return cachedData
  cachedData = buildAircraftData($equips || {})
  cachedEquips = $equips
  return cachedData
}

export function lookupAircraft(id) {
  return getData().lookupMap.get(id) ?? null
}

export const aircraftLookup = {
  lookup: lookupAircraft,
}

export function getCategoryList() {
  return getData().categoryList
}

export function getCategoryData() {
  return getData().categoryData
}

export function getIndexData() {
  return CATEGORY_DISPLAY
}

export function getCategoryGroups() {
  return CATEGORY_GROUPS
}

// 选机列表参数行的字段配置（值为 null/0 的字段由视图层隐藏）
export function getCategoryStats(categoryKey) {
  return CATEGORY_STATS[categoryKey] ?? ['aa', 'radius']
}

// Equipment type-icon id (api_type[3]) for SlotitemIcon, straight from master data
export function getSlotitemIconId(aircraftId) {
  try {
    const $equips = (typeof window !== 'undefined' && window.getStore)
      ? window.getStore('const.$equips')
      : null
    return $equips?.[aircraftId]?.api_type?.[3] ?? null
  } catch {
    return null
  }
}
