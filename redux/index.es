import presetsReducer, { DEFAULT_PRESET_ID, createDefaultPreset } from './presetsReducer'
import { loadState, saveState } from '../lib/persistence'

const persistedState = loadState()

function createInitialState() {
  if (persistedState && persistedState.presets) {
    return persistedState
  }
  return undefined
}

const initialState = createInitialState()

export const reducer = (state = initialState, action) => {
  return presetsReducer(state, action)
}

export { loadState }