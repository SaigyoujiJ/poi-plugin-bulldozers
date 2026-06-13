import { getSlotCount, isFighterType, isSeaplaneBomber, getImprovementBonus } from './planeType'
import { getProficiencyData, getProficiencyAirBonus } from './proficiency'

function calcSlotSortieBasePower(aircraft, categoryKey, slotCount, stars) {
  // LBAS 出击制空公式使用原始对空值 `aa`，配合 `interception`/`anti_bomb` 计算，
  // 而不是使用 wiki 上预计算好的 `aa_sortie` / `aa_air_defense` 列。
  const aa = aircraft.aa ?? 0
  const intercept = aircraft.interception ?? 0
  const improvement = getImprovementBonus(aircraft, categoryKey, stars)
  const base = aa + improvement + 1.5 * intercept
  return base * Math.sqrt(slotCount)
}

function calcSlotProficiencyBonus(aircraft, categoryKey, proficiencyLevel) {
  const data = getProficiencyData(proficiencyLevel)
  if (!data) return { internal: 0, display: 0 }
  const internal = Math.sqrt(data.internalMax / 10)
  const fighter = isFighterType(aircraft, categoryKey)
  const seaplaneBomber = isSeaplaneBomber(aircraft, categoryKey)
  const display = getProficiencyAirBonus(proficiencyLevel, fighter, seaplaneBomber)
  return { internal, display }
}

function calcSlotSortiePower(aircraft, categoryKey, slotCount, proficiencyLevel, stars) {
  const base = calcSlotSortieBasePower(aircraft, categoryKey, slotCount, stars)
  const { internal, display } = calcSlotProficiencyBonus(aircraft, categoryKey, proficiencyLevel)
  return Math.floor(base + internal) + display
}

function calcSlotDefenseBasePower(aircraft, categoryKey, slotCount, stars) {
  const aa = aircraft.aa ?? 0
  const intercept = aircraft.interception ?? 0
  const antiBomb = aircraft.anti_bomb ?? 0
  const improvement = getImprovementBonus(aircraft, categoryKey, stars)
  const base = aa + improvement + intercept + 2 * antiBomb
  return base * Math.sqrt(slotCount)
}

function calcSlotDefensePower(aircraft, categoryKey, slotCount, proficiencyLevel, stars) {
  const base = calcSlotDefenseBasePower(aircraft, categoryKey, slotCount, stars)
  const { internal, display } = calcSlotProficiencyBonus(aircraft, categoryKey, proficiencyLevel)
  return Math.floor(base + internal) + display
}

// 简化的“陆攻开幕威力”估计，仅使用 爆装 × sqrt(搭载数) + 熟练度内部加成。
// 这不建模完整的 LBAS 开幕伤害公式（还涉及雷装、+25 基础值、侦察机倍率等）。
function calcSlotLandAttackerStrike(aircraft, slotCount, proficiencyLevel) {
  const bombing = aircraft.bombing ?? 0
  if (bombing <= 0) return 0
  const data = getProficiencyData(proficiencyLevel)
  const internal = data ? Math.sqrt(data.internalMax / 10) : 0
  const base = bombing * Math.sqrt(slotCount)
  return Math.floor(base + internal)
}

// 大型飛行艇 ID：二式大艇 (138)、PBY-5A Catalina (178)
const FLYING_BOAT_IDS = new Set([138, 178])

// 艦偵 ID：彩雲 (54)、二式艦上偵察機 (61)、試製景雲(艦偵型) (151)、
// 彩雲(東カロリン空) (212)、彩雲(偵四) (273)
// recon_flying_boats.json 中除此集合与 FLYING_BOAT_IDS 之外的条目均为水偵。
const CARRIER_RECON_IDS = new Set([54, 61, 151, 212, 273])

function getSortieReconMultiplier(slots, aircraftData) {
  let multiplier = 1
  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft, categoryKey } = aircraftData.lookup(slot.aircraftId)
    if (categoryKey !== 'land_recon') continue
    const los = aircraft.los ?? 0
    if (los >= 9) {
      multiplier = Math.max(multiplier, 1.18)
    } else if (los >= 8) {
      multiplier = Math.max(multiplier, 1.15)
    }
  }
  return multiplier
}

function getDefenseReconMultiplier(slots, aircraftData) {
  let multiplier = 1
  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft, categoryKey } = aircraftData.lookup(slot.aircraftId)
    const los = aircraft.los ?? 0
    if (categoryKey === 'recon_flying_boats' && !CARRIER_RECON_IDS.has(aircraft.id)) {
      // 水偵 / 大型飛行艇
      if (los >= 9) multiplier = Math.max(multiplier, 1.16)
      else if (los >= 8) multiplier = Math.max(multiplier, 1.13)
      else multiplier = Math.max(multiplier, 1.10)
    } else if (categoryKey === 'recon_flying_boats') {
      // 艦偵（彩雲、二式艦偵、試製景雲等）
      if (los >= 9) multiplier = Math.max(multiplier, 1.30)
      else if (los <= 7) multiplier = Math.max(multiplier, 1.20)
    } else if (categoryKey === 'land_recon') {
      // 陸偵
      if (los >= 9) multiplier = Math.max(multiplier, 1.23)
      else if (los >= 8) multiplier = Math.max(multiplier, 1.18)
    }
  }
  return multiplier
}

export function calcSortieAirPower(slots, aircraftData) {
  let total = 0
  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft, categoryKey } = aircraftData.lookup(slot.aircraftId)
    const slotCount = getSlotCount(aircraft, categoryKey)
    const level = slot.proficiency ?? 0
    const stars = slot.stars ?? 0
    total += calcSlotSortiePower(aircraft, categoryKey, slotCount, level, stars)
  }
  return Math.floor(total * getSortieReconMultiplier(slots, aircraftData))
}

export function calcDefenseAirPower(slots, aircraftData) {
  let total = 0
  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft, categoryKey } = aircraftData.lookup(slot.aircraftId)
    const slotCount = getSlotCount(aircraft, categoryKey)
    const level = slot.proficiency ?? 0
    const stars = slot.stars ?? 0
    total += calcSlotDefensePower(aircraft, categoryKey, slotCount, level, stars)
  }
  return Math.floor(total * getDefenseReconMultiplier(slots, aircraftData))
}

export function calcLandAttackerStrikePower(slots, aircraftData) {
  let total = 0
  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft, categoryKey } = aircraftData.lookup(slot.aircraftId)
    if (categoryKey !== 'land_attackers') continue
    if ((aircraft.bombing ?? 0) <= 0) continue
    const slotCount = getSlotCount(aircraft, categoryKey)
    const level = slot.proficiency ?? 0
    total += calcSlotLandAttackerStrike(aircraft, slotCount, level)
  }
  return total
}
