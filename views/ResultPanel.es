import React, { Component } from 'react'
import { selectSquadronResults } from '../redux/selectors'
import { getModeColor } from '../lib/ui/themeColors'

const MUTED_STYLE = { opacity: 'var(--bulldozer-muted-opacity, 0.35)' }

class ResultPanel extends Component {
  renderMetric(label, value, active, mode) {
    const color = active ? getModeColor(mode).accent : 'var(--bulldozer-text-primary, #1c2127)'
    return (
      <div style={{ ...metricCardStyle, ...(active ? {} : MUTED_STYLE) }}>
        <div style={{ fontSize: 10, color: 'var(--bulldozer-text-secondary, #888)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color }}>{active ? value : '—'}</div>
      </div>
    )
  }

  render() {
    const { squadron } = this.props
    const results = selectSquadronResults(squadron)
    const mode = squadron && squadron.mode ? squadron.mode : 'sortie'
    const isSortie = mode === 'sortie'

    return (
      <div style={gridStyle}>
        {isSortie ? (
          [
            this.renderMetric('制空値', results.sortie, true, mode),
            this.renderMetric('行动半径', results.radius, true, mode),
            this.renderMetric('重爆防空値', results.heavyBomberDefense, false, mode),
            this.renderMetric('防空値', results.defense, false, mode),
          ]
        ) : (
          [
            this.renderMetric('重爆防空値', results.heavyBomberDefense, true, mode),
            this.renderMetric('防空値', results.defense, true, mode),
            this.renderMetric('制空値', results.sortie, false, mode),
            this.renderMetric('行动半径', results.radius, false, mode),
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