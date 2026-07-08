import React, { Component } from 'react'
import { CATEGORY_DATA } from '../../lib/calc/aircraftData'

class PlaneList extends Component {
  render() {
    const { categoryKey, aircraftList, onSelect } = this.props
    const list = aircraftList || CATEGORY_DATA[categoryKey] || []
    return (
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {list.map((ac) => (
          <div
            key={ac.id ?? ac.aircraftId}
            className="bulldozer-plane-item"
            onClick={() => onSelect(ac.id ?? ac.aircraftId)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: 'var(--bulldozer-radius-sm, 4px)',
              marginBottom: 3,
              color: 'var(--bulldozer-text-primary, #1c2127)',
            }}
          >
            <span>{ac.name}</span>
            {ac.count != null && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--bulldozer-text-secondary, #5f6b7a)',
              }}>
                ×{ac.count}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }
}

export default PlaneList