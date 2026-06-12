import React, { Component } from 'react'
import { connect } from 'react-redux'
import { extensionSelectorFactory } from 'views/utils/selectors'
import PresetBar from './PresetBar'
import SquadronTabs from './SquadronTabs'
import SquadronEditor from './SquadronEditor'
import ResultPanel from './ResultPanel'
import { selectActivePreset, selectSquadrons } from '../redux/selectors'
import { setSlotAircraft } from '../redux/actions'

const selector = extensionSelectorFactory('poi-plugin-bulldozers')

class AppPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSquadronIndex: 0,
      selectedSlotIndex: null,
      activeCategoryKey: 'land_attackers',
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
        className="bulldozers-app"
        style={{
          padding: 16,
          background: 'var(--bulldozer-bg-page, #fff)',
          color: 'var(--bulldozer-text-primary, #333)',
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