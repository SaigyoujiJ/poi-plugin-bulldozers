import React, { Component } from 'react'
import { connect } from 'react-redux'
import { extensionSelectorFactory } from 'views/utils/selectors'
import PresetBar from './PresetBar'
import SquadronTabs from './SquadronTabs'
import SquadronEditor from './SquadronEditor'
import ResultPanel from './ResultPanel'
import { selectActivePreset, selectSquadrons, selectPlayerEquipCategories } from '../redux/selectors'
import { setSlotAircraft, setSlotStars, setSlotProficiency } from '../redux/actions'
import { themeCss } from './themeStyle'

const LIGHT_VARS = {
  '--bulldozer-text-primary': '#1c2127',
  '--bulldozer-text-secondary': '#5f6b7a',
  '--bulldozer-card-bg': '#f5f5f5',
  '--bulldozer-bg-input': 'var(--poi-background-color)',
  '--bulldozer-bg-surface': 'transparent',
}

const DARK_VARS = {
  '--bulldozer-text-primary': '#ffffff',
  '--bulldozer-text-secondary': '#b0b5bd',
  '--bulldozer-card-bg': 'rgba(255, 255, 255, 0.04)',
  '--bulldozer-bg-input': 'rgba(0, 0, 0, 0.2)',
  '--bulldozer-bg-surface': 'transparent',
}

const setThemeVars = (node, vars) => {
  Object.entries(vars).forEach(([key, value]) => {
    node.style.setProperty(key, value)
  })
}

const clearThemeVars = (node) => {
  Object.keys(DARK_VARS).forEach((key) => {
    node.style.removeProperty(key)
  })
}

const selector = extensionSelectorFactory('poi-plugin-bulldozers')

class AppPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSquadronIndex: 0,
      selectedSlotIndex: null,
      activeCategoryKey: 'land_attackers',
      pickerMode: 'catalog',
      isDark: false,
    }
    this.rootRef = React.createRef()
    this.styleEl = null
    this.observer = null
  }

  handleClickOutside = () => {
    if (this.rootRef.current) {
      this.rootRef.current.dispatchEvent(new CustomEvent('bulldozers-close-popups', { bubbles: true }))
    }
  }

  updateDarkMode = () => {
    const node = this.rootRef.current
    if (!node) return
    const doc = node.ownerDocument
    const body = doc.body
    const isDark = window.isDarkTheme || (body ? body.classList.contains('bp6-dark') : false)

    if (isDark) {
      setThemeVars(node, DARK_VARS)
    } else {
      setThemeVars(node, LIGHT_VARS)
    }

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
    const { activeSquadronIndex, selectedSlotIndex, activeCategoryKey, pickerMode, isDark } = this.state
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
        <PresetBar onClickOutside={this.handleClickOutside} />
        <ResultPanel squadron={squadron} onClickOutside={this.handleClickOutside} />
        <SquadronTabs
          activeIndex={activeSquadronIndex}
          squadrons={squadrons}
          onTabChange={(i) => this.setState({ activeSquadronIndex: i, selectedSlotIndex: null })}
          onClickOutside={this.handleClickOutside}
        />
        <SquadronEditor
          squadron={squadron}
          presetId={activePresetId}
          squadronIndex={activeSquadronIndex}
          selectedSlotIndex={selectedSlotIndex}
          activeCategoryKey={activeCategoryKey}
          pickerMode={pickerMode}
          playerEquips={this.props.playerEquips}
          onSlotSelect={(i) => this.setState({ selectedSlotIndex: selectedSlotIndex === i ? null : i })}
          onPlaneSelect={(arg) => {
            if (selectedSlotIndex != null) {
              if (typeof arg === 'object' && arg !== null) {
                dispatch(setSlotAircraft(activePresetId, activeSquadronIndex, selectedSlotIndex, arg.aircraftId))
                dispatch(setSlotStars(activePresetId, activeSquadronIndex, selectedSlotIndex, arg.stars ?? 0))
                dispatch(setSlotProficiency(activePresetId, activeSquadronIndex, selectedSlotIndex, arg.proficiency ?? 0))
              } else {
                dispatch(setSlotAircraft(activePresetId, activeSquadronIndex, selectedSlotIndex, arg))
              }
              this.setState({ selectedSlotIndex: null })
            }
          }}
          onCategoryChange={(key) => this.setState({ activeCategoryKey: key })}
          onPickerModeChange={(mode) => this.setState({ pickerMode: mode })}
          dispatch={dispatch}
          onClickOutside={this.handleClickOutside}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const pluginState = selector(state)
  return {
    pluginState: pluginState || {},
    playerEquips: selectPlayerEquipCategories(state),
  }
}

export default connect(mapStateToProps)(AppPanel)
