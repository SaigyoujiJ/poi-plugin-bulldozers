import { getSlotCount, isFighterType, isSeaplaneBomber } from './planeType'
import { getProficiencyData, getInternalProficiencyBonus, getProficiencyAirBonus } from './proficiency'

function calcSlotSortiePower(aircraft, categoryKey, slotCount, proficiencyLevel, stars) {
  const aa = aircraft.aa_sortie ?? aircraft.aa ?? 0
  const slotPower = Math.floor(aa * Math.sqrt(slotCount))
  const internal = getProficiencyData(proficiencyLevel)
  const internalBonus = internal ? getInternalProficiencyBonus(internal.internalMax) : 0
  const fighter = isFighterType(aircraft, categoryKey)
  const seaplaneBomber = isSeaplaneBomber(aircraft, categoryKey)
  const profBonus = getProficiencyAirBonus(proficiencyLevel, fighter, seaplaneBomber)
  const upgradeBonus = fighter ? Math.floor(stars * 0.2) : 0
  return slotPower + internalBonus + profBonus + upgradeBonus
}

function calcSlotDefensePower(aircraft, categoryKey, slotCount, proficiencyLevel, stars) {
  const aa = aircraft.aa_air_defense ?? aircraft.aa ?? 0
  const slotPower = Math.floor(aa * Math.sqrt(slotCount))
  const internal = getProficiencyData(proficiencyLevel)
  const internalBonus = internal ? getInternalProficiencyBonus(internal.internalMax) : 0
  const fighter = isFighterType(aircraft, categoryKey)
  const seaplaneBomber = isSeaplaneBomber(aircraft, categoryKey)
  const profBonus = getProficiencyAirBonus(proficiencyLevel, fighter, seaplaneBomber)
  const upgradeBonus = fighter ? Math.floor(stars * 0.2) : 0
  return slotPower + internalBonus + profBonus + upgradeBonus
}

function calcSlotHeavyBomberDefense(aircraft, slotCount, proficiencyLevel) {
  const bombing = aircraft.bombing ?? 0
  if (bombing <= 0) return 0
  const basePower = Math.floor(bombing * Math.sqrt(slotCount))
  const internalBonus = Math.floor(Math.sqrt(getProficiencyData(proficiencyLevel).internalMax / 10))
  return basePower + internalBonus
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
  return total
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
  return total
}

export function calcHeavyBomberDefensePower(slots, aircraftData) {
  let total = 0
  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft, categoryKey } = aircraftData.lookup(slot.aircraftId)
    if (categoryKey !== 'land_attackers') continue
    if ((aircraft.bombing ?? 0) <= 0) continue
    const slotCount = getSlotCount(aircraft, categoryKey)
    const level = slot.proficiency ?? 0
    total += calcSlotHeavyBomberDefense(aircraft, slotCount, level)
  }
  return total
}