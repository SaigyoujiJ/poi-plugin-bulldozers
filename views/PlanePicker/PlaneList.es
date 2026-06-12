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
              borderBottom: '1px solid var(--bulldozer-border, #eee)',
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