import { calcSortieAirPower, calcDefenseAirPower, calcLandAttackerStrikePower, calcHighAltitudeDefensePower } from '../lib/calc/airPower'
import { calcCombatRadius } from '../lib/calc/radius'
import { aircraftLookup } from '../lib/calc/aircraftData'
import { aggregatePlayerEquips } from '../lib/playerEquips'

export function selectActivePreset(state) {
  const preset = state.presets[state.activePresetId]
  return preset ?? null
}

export function selectSquadrons(state) {
  const preset = selectActivePreset(state)
  return preset ? preset.squadrons : []
}

export function selectPlayerEquipCategories(state) {
  return aggregatePlayerEquips(state.info?.equips)
}

// 当前预设中已被格子占用的装备实例 id 集合（跨 3 个航空队）。
// excludeSlot 用于排除正在编辑的格子，使该格已选的实例仍可选中。
export function selectUsedEquipIds(preset, excludeSlot) {
  const used = new Set()
  if (!preset || !preset.squadrons) return used
  preset.squadrons.forEach((squadron, squadronIndex) => {
    squadron.slots.forEach((slot, slotIndex) => {
      if (slot.equipId == null) return
      if (excludeSlot && excludeSlot.squadronIndex === squadronIndex && excludeSlot.slotIndex === slotIndex) return
      used.add(slot.equipId)
    })
  })
  return used
}

export function selectSquadronResults(squadron, squadrons = [squadron]) {
  if (!squadron) return { sortie: 0, defense: 0, landAttackerStrike: 0, heavyBomberDefense: 0, radius: 0 }
  const { slots } = squadron
  return {
    sortie: calcSortieAirPower(slots, aircraftLookup),
    defense: calcDefenseAirPower(slots, aircraftLookup),
    landAttackerStrike: calcLandAttackerStrikePower(slots, aircraftLookup),
    heavyBomberDefense: calcHighAltitudeDefensePower(squadrons, aircraftLookup),
    radius: calcCombatRadius(slots, aircraftLookup),
  }
}
