import { combineReducers } from 'redux'
import presetsReducer from './presetsReducer'
import { loadState, saveState } from '../lib/persistence'

const rootReducer = combineReducers({
  presets: presetsReducer,
})

export const reducer = rootReducer

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