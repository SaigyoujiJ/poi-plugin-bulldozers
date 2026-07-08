import { lookupAircraft, getCategoryList } from './calc/aircraftData'

/**
 * Aggregate player equipment from poi global state (state.info.equips)
 * into category-grouped lists, filtered to aircraft present in plugin static data.
 *
 * @param {Object} equips - state.info.equips, keyed by instance api_id
 * @returns {Array<{categoryKey: string, display: string, aircraft: Array<{aircraftId: number, name: string, count: number}>}>}
 */
export function aggregatePlayerEquips(equips) {
  if (!equips) return []

  // Single pass: categorize each equip by categoryKey
  const catData = new Map() // categoryKey -> Map<aircraftId, { aircraftId, name, count }>

  for (const equip of Object.values(equips)) {
    if (!equip || !equip.api_slotitem_id) continue
    const planeInfo = lookupAircraft(equip.api_slotitem_id)
    if (!planeInfo) continue

    const { aircraft, categoryKey } = planeInfo
    const stars = equip.api_level ?? 0
    const prof = equip.api_alv ?? 0
    const key = `${aircraft.id}|${stars}|${prof}`

    let acMap = catData.get(categoryKey)
    if (!acMap) {
      acMap = new Map()
      catData.set(categoryKey, acMap)
    }

    const existing = acMap.get(key)
    if (existing) {
      existing.count += 1
    } else {
      acMap.set(key, {
        aircraftId: aircraft.id,
        name: aircraft.name,
        stars,
        proficiency: prof,
        count: 1,
      })
    }
  }

  // Build result in category order from getCategoryList()
  const categories = getCategoryList()
  const result = []
  for (const cat of categories) {
    const acMap = catData.get(cat.key)
    if (!acMap || acMap.size === 0) continue

    const aircraft = Array.from(acMap.values())
    aircraft.sort((a, b) => a.aircraftId - b.aircraftId)
    result.push({
      categoryKey: cat.key,
      display: cat.display,
      aircraft,
    })
  }

  return result
}
