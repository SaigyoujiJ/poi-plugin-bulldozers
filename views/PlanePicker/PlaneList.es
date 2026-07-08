import React, { Component } from 'react'
import { CATEGORY_DATA } from '../../lib/calc/aircraftData'

class PlaneList extends Component {
  render() {
    const { categoryKey, aircraftList, onSelect } = this.props
    const list = aircraftList || CATEGORY_DATA[categoryKey] || []
    const isInventory = aircraftList && list.length > 0 && list[0].stars != null

    return (
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {list.map((ac) => {
          const key = isInventory ? `${ac.aircraftId}-${ac.stars}-${ac.proficiency}` : (ac.id ?? ac.aircraftId)
          return (
            <div
              key={key}
              className="bulldozer-plane-item"
              onClick={() => onSelect(isInventory ? { aircraftId: ac.aircraftId, stars: ac.stars, proficiency: ac.proficiency } : (ac.id ?? ac.aircraftId))}
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
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {ac.name}
                {isInventory && ac.stars > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#f5a623' }}>★{ac.stars}</span>
                )}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--bulldozer-text-secondary, #5f6b7a)',
              }}>
                ×{ac.count}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
}

export default PlaneList
