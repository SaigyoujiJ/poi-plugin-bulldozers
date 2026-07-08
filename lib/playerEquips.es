import { lookupAircraft, getCategoryList } from './calc/aircraftData'

/**
 * List player equipment from poi global state (state.info.equips)
 * as flat per-instance items, grouped by category, filtered to aircraft
 * present in plugin static data.
 *
 * @param {Object} equips - state.info.equips, keyed by instance api_id
 * @returns {Array<{categoryKey: string, display: string, aircraft: Array<{aircraftId: number, name: string, stars: number, proficiency: number}>}>}
 */
export function aggregatePlayerEquips(equips) {
  if (!equips) return []

  // Single pass: categorize each equip instance by categoryKey
  const catData = new Map() // categoryKey -> Array

  for (const equip of Object.values(equips)) {
    if (!equip || !equip.api_slotitem_id) continue
    const planeInfo = lookupAircraft(equip.api_slotitem_id)
    if (!planeInfo) continue

    const { aircraft, categoryKey } = planeInfo
    let list = catData.get(categoryKey)
    if (!list) {
      list = []
      catData.set(categoryKey, list)
    }

    list.push({
      aircraftId: aircraft.id,
      name: aircraft.name,
      stars: equip.api_level ?? 0,
      proficiency: equip.api_alv ?? 0,
    })
  }

  // Build result in category order from getCategoryList()
  const categories = getCategoryList()
  const result = []
  for (const cat of categories) {
    const list = catData.get(cat.key)
    if (!list || list.length === 0) continue

    list.sort((a, b) => a.aircraftId - b.aircraftId || a.stars - b.stars || a.proficiency - b.proficiency)
    result.push({
      categoryKey: cat.key,
      display: cat.display,
      aircraft: list,
    })
  }

  return result
}
