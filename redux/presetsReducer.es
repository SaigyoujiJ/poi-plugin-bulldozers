import {
  SWITCH_PRESET,
  SAVE_PRESET,
  DELETE_PRESET,
  RENAME_PRESET,
  SET_SQUADRON_MODE,
  SET_SLOT_AIRCRAFT,
  SET_SLOT_PROFICIENCY,
  SET_SLOT_STARS,
  SET_SLOT_COUNT,
  CLEAR_SLOT,
} from './actions'
import { getSlotCount } from '../lib/calc/planeType'
import { lookupAircraft } from '../lib/calc/aircraftData'

const { __ } = window.i18n['poi-plugin-bulldozers']

export const DEFAULT_PRESET_ID = 'default'

export function createDefaultPreset(id = DEFAULT_PRESET_ID, name = __('Preset.DefaultName').replace('{{number}}', 1)) {
  return {
    id,
    name,
    squadrons: [
      {
        id: 1,
        name: __('Squadron.First'),
        mode: 'sortie',
        slots: [
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
        ],
      },
      {
        id: 2,
        name: __('Squadron.Second'),
        mode: 'sortie',
        slots: [
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
        ],
      },
      {
        id: 3,
        name: __('Squadron.Third'),
        mode: 'sortie',
        slots: [
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
          { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
        ],
      },
    ],
  }
}

function slotReducer(state, action) {
  switch (action.type) {
    case SET_SLOT_AIRCRAFT: {
      const { aircraftId } = action
      if (!aircraftId) {
        return { ...state, aircraftId: null, equipId: null }
      }
      const planeInfo = lookupAircraft(aircraftId)
      const maxCount = planeInfo ? getSlotCount(planeInfo.aircraft, planeInfo.categoryKey) : 18
      return {
        ...state,
        aircraftId,
        count: maxCount,
        stars: action.stars ?? state.stars,
        proficiency: action.proficiency ?? state.proficiency,
        equipId: action.equipId ?? null,
      }
    }
    // 手动改 ★/熟练度后，格子不再等于原实例，解除实例绑定
    case SET_SLOT_PROFICIENCY:
      return { ...state, proficiency: action.proficiency, equipId: null }
    case SET_SLOT_STARS:
      return { ...state, stars: action.stars, equipId: null }
    case SET_SLOT_COUNT:
      return { ...state, count: action.count }
    case CLEAR_SLOT:
      return { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null }
    default:
      return state
  }
}

function squadronReducer(state, action) {
  switch (action.type) {
    case SET_SQUADRON_MODE:
      return { ...state, mode: action.mode }
    case SET_SLOT_AIRCRAFT:
    case SET_SLOT_PROFICIENCY:
    case SET_SLOT_STARS:
    case SET_SLOT_COUNT:
    case CLEAR_SLOT: {
      const { slotIndex } = action
      const newSlots = [...state.slots]
      newSlots[slotIndex] = slotReducer(state.slots[slotIndex], action)
      return { ...state, slots: newSlots }
    }
    default:
      return state
  }
}

const initialState = {
  activePresetId: DEFAULT_PRESET_ID,
  presets: {
    [DEFAULT_PRESET_ID]: createDefaultPreset(),
  },
}

export default function presetsReducer(state = initialState, action) {
  switch (action.type) {
    case SWITCH_PRESET:
      return { ...state, activePresetId: action.presetId }

    case SAVE_PRESET: {
      const { id, name } = action
      const currentPreset = state.presets[state.activePresetId]
      const newPreset = {
        ...currentPreset,
        id,
        name,
      }
      return {
        ...state,
        activePresetId: id,
        presets: { ...state.presets, [id]: newPreset },
      }
    }

    case DELETE_PRESET: {
      const { presetId } = action
      const remainingKeys = Object.keys(state.presets).filter((k) => k !== presetId)
      if (remainingKeys.length === 0) return state
      const newPresets = { ...state.presets }
      delete newPresets[presetId]
      let newActiveId = state.activePresetId
      if (newActiveId === presetId) {
        newActiveId = remainingKeys[0]
      }
      return { activePresetId: newActiveId, presets: newPresets }
    }

    case RENAME_PRESET: {
      const { presetId, name } = action
      const preset = state.presets[presetId]
      if (!preset) return state
      return {
        ...state,
        presets: { ...state.presets, [presetId]: { ...preset, name } },
      }
    }

    case SET_SQUADRON_MODE:
    case SET_SLOT_AIRCRAFT:
    case SET_SLOT_PROFICIENCY:
    case SET_SLOT_STARS:
    case SET_SLOT_COUNT:
    case CLEAR_SLOT: {
      const { presetId, squadronIndex } = action
      const preset = state.presets[presetId]
      if (!preset) return state
      const newSquadrons = [...preset.squadrons]
      newSquadrons[squadronIndex] = squadronReducer(preset.squadrons[squadronIndex], action)
      return {
        ...state,
        presets: { ...state.presets, [presetId]: { ...preset, squadrons: newSquadrons } },
      }
    }

    default:
      return state
  }
}