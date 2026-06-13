import React, { Component } from 'react'
import { selectSquadronResults } from '../redux/selectors'

class ResultPanel extends Component {
  render() {
    const { squadron } = this.props
    const results = selectSquadronResults(squadron)
    return (
      <div style={{ marginTop: 12, padding: 12, border: '1px solid var(--bulldozer-accent, #2d72d2)', borderRadius: 4, background: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>出击</div>
            <div>制空値: {results.sortie}</div>
            <div>行动半径: {results.radius}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>防空</div>
            <div>防空値: {results.defense}</div>
            <div>陆攻开幕威力: {results.landAttackerStrike}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResultPanel