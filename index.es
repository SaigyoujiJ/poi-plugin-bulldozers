import React, { Component } from 'react'
import { connect } from 'react-redux'
import { extensionSelectorFactory } from 'views/utils/selectors'
import AppPanel from './views/AppPanel'
import { reducer } from './redux'
import { store } from 'views/create-store'
import { saveState } from './lib/persistence'
import './views/theme.css'

const selector = extensionSelectorFactory('poi-plugin-bulldozers')

store.subscribe(() => {
  const state = store.getState()
  const pluginState = state.ext?.['poi-plugin-bulldozers']?._
  if (pluginState) {
    saveState(pluginState)
  }
})

class PluginBulldozers extends Component {
  render() {
    return <AppPanel />
  }
}

export const reactClass = connect(selector)(PluginBulldozers)
export { reducer }