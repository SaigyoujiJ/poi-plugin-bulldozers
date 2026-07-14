import React, { Component } from 'react'
import { selectSquadronResults } from '../redux/selectors'
import { getModeColor } from '../lib/ui/themeColors'

const MUTED_STYLE = { opacity: 'var(--bulldozer-muted-opacity, 0.35)' }

const { __ } = window.i18n['poi-plugin-bulldozers']

class ResultPanel extends Component {
  renderMetric(label, value, active, mode, onClick) {
    const color = active ? getModeColor(mode).accent : 'var(--bulldozer-text-primary, #1c2127)'
    return (
      <div onClick={onClick} style={{ ...metricCardStyle, ...(active ? {} : MUTED_STYLE) }}>
        <div style={{ fontSize: 12, color: 'var(--bulldozer-text-secondary, #888)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color, textShadow: '0 0 10px ' + color + '44' }}>{active ? value : '—'}</div>
      </div>
    )
  }

  render() {
    const { squadron, onClickOutside } = this.props
    const results = selectSquadronResults(squadron)
    const mode = squadron && squadron.mode ? squadron.mode : 'sortie'
    const isSortie = mode === 'sortie'

    return (
      <div style={gridStyle}>
        {isSortie ? (
          [
            this.renderMetric(__('ResultPanel.AirPower'), results.sortie, true, mode, onClickOutside),
            this.renderMetric(__('ResultPanel.Radius'), results.radius, true, mode, onClickOutside),
          ]
        ) : (
          [
            this.renderMetric(__('ResultPanel.HeavyBomberDefense'), results.heavyBomberDefense, true, mode, onClickOutside),
            this.renderMetric(__('ResultPanel.DefenseAirPower'), results.defense, true, mode, onClickOutside),
          ]
        )}
      </div>
    )
  }
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  marginBottom: 14,
}

const metricCardStyle = {
  background: 'var(--bulldozer-card-bg, #f5f5f5)',
  borderRadius: 'var(--bulldozer-radius-lg, 10px)',
  padding: 12,
  textAlign: 'center',
  transition: 'opacity 0.2s ease',
}

export default ResultPanel
