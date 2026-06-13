import React, { Component } from 'react'
import { selectSquadronResults } from '../redux/selectors'

const { __ } = window.i18n['poi-plugin-bulldozers']

class ResultPanel extends Component {
  render() {
    const { squadron } = this.props
    const results = selectSquadronResults(squadron)
    return (
      <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--bulldozer-accent, #2d72d2)', borderRadius: 4, background: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{__('ResultPanel.Sortie')}</div>
            <div>{__('ResultPanel.AirPower')}: {results.sortie}</div>
            <div>{__('ResultPanel.Radius')}: {results.radius}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{__('ResultPanel.Defense')}</div>
            <div>{__('ResultPanel.DefenseAirPower')}: {results.defense}</div>
            <div>{__('ResultPanel.LandAttackerStrike')}: {results.landAttackerStrike}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResultPanel
