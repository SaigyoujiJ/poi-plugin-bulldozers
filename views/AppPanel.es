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
    this.themeListener = null
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
    const html = doc.documentElement

    const applyDark = (isDark) => {
      if (isDark) {
        pluginBody.classList.add('bp6-dark')
        html.classList.add('bp6-dark')
      } else {
        pluginBody.classList.remove('bp6-dark')
        html.classList.remove('bp6-dark')
      }
    }

    // 1. poi sets a global boolean in each window it styles.
    if (typeof window.isDarkTheme === 'boolean') {
      applyDark(window.isDarkTheme)
      // Still try to observe the main window for live theme switches.
      let mainWindow = null
      try {
        mainWindow = window.opener || window.parent
      } catch (e) {
        // Cross-origin; ignore.
      }
      if (mainWindow && mainWindow !== window && mainWindow.document && mainWindow.document.body &&
          pluginBody !== mainWindow.document.body) {
        const syncFromMainWindow = () => {
          try {
            applyDark(mainWindow.document.body.classList.contains('bp6-dark'))
          } catch (e) {
            // Ignore cross-origin or missing main window.
          }
        }
        try {
          this.themeObserver = new MutationObserver(syncFromMainWindow)
          this.themeObserver.observe(mainWindow.document.body, {
            attributes: true,
            attributeFilter: ['class'],
          })
        } catch (e) {
          // Ignore if observer cannot be attached.
        }
      }
      return
    }

    // 2. Try to mirror the main poi window body class (independent windows).
    let mainWindow = null
    try {
      mainWindow = window.opener || window.parent
    } catch (e) {
      // Cross-origin; ignore.
    }
    const isIndependentWindow =
      mainWindow && mainWindow !== window && mainWindow.document && mainWindow.document.body &&
      pluginBody !== mainWindow.document.body

    if (isIndependentWindow) {
      const syncFromMainWindow = () => {
        try {
          applyDark(mainWindow.document.body.classList.contains('bp6-dark'))
        } catch (e) {
          // Ignore cross-origin or missing main window.
        }
      }
      syncFromMainWindow()
      try {
        this.themeObserver = new MutationObserver(syncFromMainWindow)
        this.themeObserver.observe(mainWindow.document.body, {
          attributes: true,
          attributeFilter: ['class'],
        })
      } catch (e) {
        // Ignore if observer cannot be attached.
      }
      return
    }

    // 3. Fall back to detecting dark mode from the current document or OS preference.
    const detectTheme = () => {
      // If poi already set --poi-background-color, derive from it.
      try {
        const bg = window.getComputedStyle(doc.documentElement)
          .getPropertyValue('--poi-background-color')
          .trim()
        if (bg) {
          // RGB values for poi dark background: rgb(47 52 60) / rgb(47,52,60).
          const isDark = /47\s*[,\s]\s*52\s*[,\s]\s*60/.test(bg)
          if (isDark) return true
          const isLight = /246\s*[,\s]\s*247\s*[,\s]\s*249/.test(bg)
          if (isLight) return false
        }
      } catch (e) {
        // Ignore.
      }
      // Otherwise follow the OS setting.
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    applyDark(detectTheme())
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.themeListener = () => applyDark(detectTheme())
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', this.themeListener)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(this.themeListener)
      }
    } catch (e) {
      // Ignore.
    }
  }

  componentWillUnmount() {
    if (this.styleEl && this.styleEl.parentNode) {
      this.styleEl.parentNode.removeChild(this.styleEl)
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect()
    }
    if (this.themeListener) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', this.themeListener)
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(this.themeListener)
        }
      } catch (e) {
        // Ignore.
      }
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
