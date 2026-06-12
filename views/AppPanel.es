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
    }
    this.rootRef = React.createRef()
    this.styleEl = null
    this.themeObserver = null
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

    const pluginBody = doc.body
    const mainWindow = window.opener
    if (mainWindow && mainWindow.document && mainWindow.document.body) {
      // Only independent plugin windows need syncing; embedded panels share
      // the main document body, so observing it would cause a mutation loop.
      if (pluginBody === mainWindow.document.body) {
        return
      }
      const syncThemeClass = () => {
        try {
          const isDark = mainWindow.document.body.classList.contains('bp6-dark')
          if (isDark) {
            pluginBody.classList.add('bp6-dark')
          } else {
            pluginBody.classList.remove('bp6-dark')
          }
        } catch (e) {
          // Ignore cross-origin or missing main window
        }
      }
      syncThemeClass()
      try {
        this.themeObserver = new MutationObserver(syncThemeClass)
        this.themeObserver.observe(mainWindow.document.body, {
          attributes: true,
          attributeFilter: ['class'],
        })
      } catch (e) {
        // Ignore if observer cannot be attached
      }
    }
  }

  componentWillUnmount() {
    if (this.styleEl && this.styleEl.parentNode) {
      this.styleEl.parentNode.removeChild(this.styleEl)
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect()
    }
  }

  render() {
    const { activeSquadronIndex, selectedSlotIndex, activeCategoryKey } = this.state
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
        className="bulldozers-app"
        style={{
          padding: 16,
          background: 'var(--bulldozer-bg-page, #f6f7f9)',
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
