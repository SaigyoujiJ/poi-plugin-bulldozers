import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { extensionSelectorFactory } from 'views/utils/selectors'
import AppPanel from './views/AppPanel'
import { reducer, initializePersistence } from './redux'

const selector = extensionSelectorFactory('poi-plugin-bulldozers')

class PluginBulldozers extends Component {
  componentDidMount() {
    const { store } = this.context
    if (store) {
      initializePersistence(store)
    }
  }

  render() {
    return <AppPanel />
  }
}

PluginBulldozers.contextTypes = {
  store: PropTypes.object,
}

export const reactClass = connect(selector)(PluginBulldozers)
export { reducer }