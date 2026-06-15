import React, { Component } from 'react'
import { CATEGORY_DATA } from '../../lib/calc/aircraftData'

class PlaneList extends Component {
  render() {
    const { categoryKey, onSelect } = this.props
    const aircraftList = CATEGORY_DATA[categoryKey] || []
    return (
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {aircraftList.map((ac) => (
          <div
            key={ac.id}
            className="bulldozer-plane-item"
            onClick={() => onSelect(ac.id)}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: 'var(--bulldozer-radius-sm, 4px)',
              marginBottom: 3,
              color: 'var(--bulldozer-text-primary, #1c2127)',
            }}
          >
            {ac.name}
          </div>
        ))}
      </div>
    )
  }
}

export default PlaneList