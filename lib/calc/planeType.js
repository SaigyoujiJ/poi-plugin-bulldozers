export const LARGE_LAND_AIRCRAFT_IDS = [395, 396]

const SLOT_COUNTS = {
  local_fighters: 18,
  land_recon: 4,
  carrier_fighters: 18,
  carrier_torpedo_bombers: 18,
  carrier_dive_bombers: 18,
  jet_aircraft: 18,
  rotary_asw: 18,
  recon_flying_boats: 4,
}

const FIGHTER_CATEGORY_KEYS = new Set([
  'local_fighters',
  'carrier_fighters',
])

export function getSlotCount(aircraft, categoryKey) {
  if (categoryKey === 'land_attackers') {
    return LARGE_LAND_AIRCRAFT_IDS.includes(aircraft.id) ? 9 : 18
  }
  if (categoryKey === 'seaplanes') {
    if ((aircraft.torpedo != null && aircraft.torpedo > 0) ||
        (aircraft.bombing != null && aircraft.bombing > 0)) {
      return 4
    }
    return 18
  }
  return SLOT_COUNTS[categoryKey] ?? 18
}

export function isFighterType(aircraft, categoryKey) {
  if (FIGHTER_CATEGORY_KEYS.has(categoryKey)) return true
  if (categoryKey === 'seaplanes') {
    if ((aircraft.torpedo != null && aircraft.torpedo > 0) ||
        (aircraft.bombing != null && aircraft.bombing > 0)) {
      return false
    }
    return true
  }
  return false
}

export function isSeaplaneBomber(aircraft, categoryKey) {
  if (categoryKey !== 'seaplanes') return false
  return (aircraft.torpedo != null && aircraft.torpedo > 0) ||
         (aircraft.bombing != null && aircraft.bombing > 0)
}

export function isReconType(categoryKey) {
  return categoryKey === 'land_recon' || categoryKey === 'recon_flying_boats'
}