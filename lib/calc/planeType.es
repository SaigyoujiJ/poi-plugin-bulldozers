export const LARGE_LAND_AIRCRAFT_IDS = [395, 396]

// 在基地航空隊中，除侦察机（4）和大型陆攻（9）外，其余一律 18
const SLOT_COUNTS = {
  local_fighters: 18,
  land_recon: 4,
  carrier_fighters: 18,
  carrier_torpedo_bombers: 18,
  carrier_dive_bombers: 18,
  jet_aircraft: 18,
  rotary_asw: 18,
  recon_flying_boats: 4,
  seaplanes: 18,
  land_attackers: 18,
}

// 基础战斗机分类；jet/rotary 需要进一步判断是否有轰炸/雷击
const FIGHTER_CATEGORY_KEYS = new Set([
  'local_fighters',
  'carrier_fighters',
  'jet_aircraft',
  'rotary_asw',
])

function hasStrike(aircraft) {
  return (aircraft.torpedo != null && aircraft.torpedo > 0) ||
         (aircraft.bombing != null && aircraft.bombing > 0)
}

export function getSlotCount(aircraft, categoryKey) {
  if (categoryKey === 'land_attackers') {
    return LARGE_LAND_AIRCRAFT_IDS.includes(aircraft.id) ? 9 : 18
  }
  return SLOT_COUNTS[categoryKey] ?? 18
}

export function isFighterType(aircraft, categoryKey) {
  if (categoryKey === 'seaplanes') {
    // 水战（无雷装/爆装）算战斗机；水爆不算
    return !hasStrike(aircraft)
  }
  if (FIGHTER_CATEGORY_KEYS.has(categoryKey)) {
    // 喷气/联络机里只有真正带对空且无打击装备的才是纯战斗机
    if (categoryKey === 'jet_aircraft') {
      return !hasStrike(aircraft) && aircraft.aa != null && aircraft.aa > 0
    }
    // 联络/对潜机里，只有带对空的（一式战隼系列）才按战斗机算
    if (categoryKey === 'rotary_asw') {
      return aircraft.aa != null && aircraft.aa > 0
    }
    return true
  }
  return false
}

export function isSeaplaneBomber(aircraft, categoryKey) {
  if (categoryKey !== 'seaplanes') return false
  return hasStrike(aircraft)
}

export function isReconType(categoryKey) {
  return categoryKey === 'land_recon' || categoryKey === 'recon_flying_boats'
}

export function isFighterBomber(aircraft, categoryKey) {
  if (categoryKey === 'jet_aircraft') {
    return hasStrike(aircraft) && aircraft.aa != null && aircraft.aa > 0
  }
  if (categoryKey === 'rotary_asw') {
    return aircraft.aa != null && aircraft.aa > 0 && hasStrike(aircraft)
  }
  return false
}

export function getImprovementBonus(aircraft, categoryKey, stars) {
  if (stars <= 0) return 0
  if (categoryKey === 'land_attackers') {
    return 0.5 * Math.sqrt(stars)
  }
  if (isFighterBomber(aircraft, categoryKey)) {
    return 0.25 * stars
  }
  if (isFighterType(aircraft, categoryKey)) {
    return 0.2 * stars
  }
  return 0
}
