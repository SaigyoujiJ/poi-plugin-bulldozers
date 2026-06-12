import { combineReducers } from 'redux'
import presetsReducer, { DEFAULT_PRESET_ID, createDefaultPreset } from './presetsReducer'
import { loadState, saveState } from '../lib/persistence'

const persistedState = loadState()
const initialPresetsState = persistedState && persistedState.presets
  ? persistedState.presets
  : undefined

const rootReducer = combineReducers({
  presets: presetsReducer,
})

export const reducer = (state, action) => {
  if (state === undefined && initialPresetsState !== undefined) {
    state = { presets: initialPresetsState }
  }
  return rootReducer(state, action)
}

export function initializePersistence(store) {
  store.subscribe(() => {
    const state = store.getState()
    const pluginState = state.ext?.['poi-plugin-bulldozers']?._
    if (pluginState) {
      saveState(pluginState)
    }
  })
}

export { loadState }