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
// availableEquipCategories 传入当前库存后，只保留仍存在且仍对应同一飞机的实例，
// 避免过期或错配的 equipId 把库存项目错误标记为已分配。
// excludeSlot 用于排除正在编辑的格子，使该格已选的实例仍可选中。
export function selectUsedEquipIds(preset, excludeSlot, availableEquipCategories) {
  const used = new Set()
  if (!preset || !preset.squadrons) return used

  let availableEquipAircraft = null
  if (Array.isArray(availableEquipCategories)) {
    availableEquipAircraft = new Map()
    availableEquipCategories.forEach((category) => {
      ;(category.aircraft || []).forEach((aircraft) => {
        if (aircraft.equipId != null) {
          availableEquipAircraft.set(aircraft.equipId, aircraft.aircraftId)
        }
      })
    })
  }

  preset.squadrons.forEach((squadron, squadronIndex) => {
    squadron.slots.forEach((slot, slotIndex) => {
      if (slot.equipId == null) return
      if (excludeSlot && excludeSlot.squadronIndex === squadronIndex && excludeSlot.slotIndex === slotIndex) return
      if (availableEquipAircraft && availableEquipAircraft.get(slot.equipId) !== slot.aircraftId) return
      used.add(slot.equipId)
    })
  })
  return used
}

export function selectSquadronResults(squadron, squadrons) {
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
