import {
  SWITCH_PRESET,
  SAVE_PRESET,
  DELETE_PRESET,
  RENAME_PRESET,
  SET_SQUADRON_MODE,
  SET_SLOT_AIRCRAFT,
  SET_SLOT_PROFICIENCY,
  SET_SLOT_STARS,
  CLEAR_SLOT,
} from './actions'

export const DEFAULT_PRESET_ID = 'default'

export function createDefaultPreset(id = DEFAULT_PRESET_ID, name = '预设 1') {
  return {
    id,
    name,
    squadrons: [
      {
        id: 1,
        name: '第一航空隊',
        mode: 'sortie',
        slots: [
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
        ],
      },
      {
        id: 2,
        name: '第二航空隊',
        mode: 'sortie',
        slots: [
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
        ],
      },
      {
        id: 3,
        name: '第三航空隊',
        mode: 'sortie',
        slots: [
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
          { aircraftId: null, proficiency: 0, stars: 0 },
        ],
      },
    ],
  }
}

function slotReducer(state, action) {
  switch (action.type) {
    case SET_SLOT_AIRCRAFT:
      return { ...state, aircraftId: action.aircraftId }
    case SET_SLOT_PROFICIENCY:
      return { ...state, proficiency: action.proficiency }
    case SET_SLOT_STARS:
      return { ...state, stars: action.stars }
    case CLEAR_SLOT:
      return { aircraftId: null, proficiency: 0, stars: 0 }
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
      const newPreset = createDefaultPreset(id, name)
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