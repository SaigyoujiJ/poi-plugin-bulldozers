export const LARGE_LAND_AIRCRAFT_IDS = [395, 396]

// 在基地航空隊中，除侦察机（4）和大型陆攻（9）外，其余一律 18
const SLOT_COUNTS = {
  local_fighters: 18,
  land_recon: 4,
  carrier_fighters: 18,
  carrier_torpedo_bombers: 18,
  carrier_dive_bombers: 18,
  carrier_recon: 4,
  jet_aircraft: 18,
  seaplane_recon: 4,
  seaplane_bombers: 18,
  seaplane_fighters: 18,
  rotary_asw: 18,
  flying_boats: 4,
}

// 基础战斗机分类；jet/rotary 需要进一步判断是否有轰炸/雷击
const FIGHTER_CATEGORY_KEYS = new Set([
  'local_fighters',
  'carrier_fighters',
  'seaplane_fighters',
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
  if (FIGHTER_CATEGORY_KEYS.has(categoryKey)) {
    // 喷气式机里只有真正带对空且无打击装备的才是纯战斗机
    if (categoryKey === 'jet_aircraft') {
      return !hasStrike(aircraft) && aircraft.aa != null && aircraft.aa > 0
    }
    // 旋翼/哨戒机里，只有带对空的（一式戦 隼系列）才按战斗机算
    // 注：带对空且有雷装/爆装的 一式戦 隼系列同时命中 isFighterType 与 isFighterBomber，
    // 这是游戏机制——熟练度按战斗机显示，改修加成按战斗轰炸机计算
    if (categoryKey === 'rotary_asw') {
      return aircraft.aa != null && aircraft.aa > 0
    }
    return true
  }
  return false
}

// 水爆（type2=11）按分类直接判定，享受水爆熟练度加成
export function isSeaplaneBomber(aircraft, categoryKey) {
  return categoryKey === 'seaplane_bombers'
}

export function isReconType(categoryKey) {
  return categoryKey === 'land_recon' ||
         categoryKey === 'carrier_recon' ||
         categoryKey === 'seaplane_recon' ||
         categoryKey === 'flying_boats'
}

export function isFighterBomber(aircraft, categoryKey) {
  if (categoryKey === 'jet_aircraft') {
    return hasStrike(aircraft) && aircraft.aa != null && aircraft.aa > 0
  }
  // 旋翼/哨戒机中带对空且有打击装备的 一式戦 隼系列按战斗轰炸机处理
  if (categoryKey === 'rotary_asw') {
    return aircraft.aa != null && aircraft.aa > 0 && hasStrike(aircraft)
  }
  return false
}

/**
 * 计算基地航空隊飞机按机种分类的改修对空加成。
 * 该加成用于 LBAS 制空值计算。
 */
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
