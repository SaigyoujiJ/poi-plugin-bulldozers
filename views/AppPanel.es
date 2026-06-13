import React, { Component } from 'react'
import { connect } from 'react-redux'
import { extensionSelectorFactory } from 'views/utils/selectors'
import PresetBar from './PresetBar'
import SquadronTabs from './SquadronTabs'
import SquadronEditor from './SquadronEditor'
import ResultPanel from './ResultPanel'
import { selectActivePreset, selectSquadrons } from '../redux/selectors'
import { setSlotAircraft } from '../redux/actions'
import { themeCss } from './themeStyle'

const selector = extensionSelectorFactory('poi-plugin-bulldozers')

class AppPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSquadronIndex: 0,
      selectedSlotIndex: null,
      activeCategoryKey: 'land_attackers',
      isDark: false,
    }
    this.rootRef = React.createRef()
    this.styleEl = null
    this.observer = null
  }

  updateDarkMode = () => {
    const node = this.rootRef.current
    if (!node) return
    const doc = node.ownerDocument
    const body = doc.body
    const isDark = body ? body.classList.contains('bp6-dark') : false
    this.setState({ isDark })
  }

  componentDidMount() {
    const node = this.rootRef.current
    if (!node) return
    const doc = node.ownerDocument
    if (!doc || !doc.head) return
    const style = doc.createElement('style')
    style.textContent = themeCss
    doc.head.appendChild(style)
    this.styleEl = style

    this.updateDarkMode()

    const body = doc.body
    if (body && typeof window.MutationObserver !== 'undefined') {
      this.observer = new window.MutationObserver(this.updateDarkMode)
      this.observer.observe(body, { attributes: true, attributeFilter: ['class'] })
    }
  }

  componentWillUnmount() {
    if (this.styleEl && this.styleEl.parentNode) {
      this.styleEl.parentNode.removeChild(this.styleEl)
    }
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }

  render() {
    const { activeSquadronIndex, selectedSlotIndex, activeCategoryKey, isDark } = this.state
    const { pluginState, dispatch } = this.props
    if (!pluginState || !pluginState.presets) return null

    const activePresetId = pluginState.activePresetId
    const activePreset = selectActivePreset(pluginState)
    const squadrons = selectSquadrons(pluginState)
    const squadron = squadrons[activeSquadronIndex]

    if (!activePreset) return null

    return (
      <div
        ref={this.rootRef}
        className={'bulldozers-app' + (isDark ? ' bp6-dark' : '')}
        style={{
          padding: 12,
          color: 'var(--bulldozer-text-primary, #1c2127)',
          minHeight: '100%',
        }}
      >
        <PresetBar />
        <SquadronTabs
          activeIndex={activeSquadronIndex}
          squadrons={squadrons}
          onTabChange={(i) => this.setState({ activeSquadronIndex: i, selectedSlotIndex: null })}
        />
        <SquadronEditor
          squadron={squadron}
          presetId={activePresetId}
          squadronIndex={activeSquadronIndex}
          selectedSlotIndex={selectedSlotIndex}
          activeCategoryKey={activeCategoryKey}
          onSlotSelect={(i) => this.setState({ selectedSlotIndex: i })}
          onPlaneSelect={(aircraftId) => {
            if (selectedSlotIndex != null) {
              dispatch(setSlotAircraft(activePresetId, activeSquadronIndex, selectedSlotIndex, aircraftId))
            }
          }}
          onCategoryChange={(key) => this.setState({ activeCategoryKey: key })}
          dispatch={dispatch}
        />
        <ResultPanel squadron={squadron} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const pluginState = selector(state)
  return { pluginState: pluginState || {} }
}

export default connect(mapStateToProps)(AppPanel)
