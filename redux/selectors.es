import { calcSortieAirPower, calcDefenseAirPower, calcHeavyBomberDefensePower } from '../lib/calc/airPower'
import { calcCombatRadius } from '../lib/calc/radius'
import { aircraftLookup } from '../lib/calc/aircraftData'

export function selectActivePreset(state) {
  const preset = state.presets[state.activePresetId]
  return preset ?? null
}

export function selectSquadrons(state) {
  const preset = selectActivePreset(state)
  return preset ? preset.squadrons : []
}

export function selectSquadronResults(squadron) {
  if (!squadron) return { sortie: 0, defense: 0, heavyBomberDefense: 0, radius: 0 }
  const { slots } = squadron
  return {
    sortie: calcSortieAirPower(slots, aircraftLookup),
    defense: calcDefenseAirPower(slots, aircraftLookup),
    heavyBomberDefense: calcHeavyBomberDefensePower(slots, aircraftLookup),
    radius: calcCombatRadius(slots, aircraftLookup),
  }
}