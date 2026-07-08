import React, { Component } from 'react'
import { CATEGORY_DATA } from '../../lib/calc/aircraftData'

const { __ } = window.i18n['poi-plugin-bulldozers']

const PROFICIENCY_LABELS = [
  'Proficiency.None',
  'Proficiency.Level1',
  'Proficiency.Level2',
  'Proficiency.Level3',
  'Proficiency.Level4',
  'Proficiency.Level5',
  'Proficiency.Level6',
  'Proficiency.Level7',
]

class PlaneList extends Component {
  render() {
    const { categoryKey, aircraftList, onSelect } = this.props
    const list = aircraftList || CATEGORY_DATA[categoryKey] || []
    const isInventory = aircraftList && list.length > 0 && list[0].stars != null

    return (
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {list.map((ac) => {
          const key = isInventory
            ? `${ac.aircraftId}-${ac.stars}-${ac.proficiency}`
            : (ac.id ?? ac.aircraftId)
          return (
            <div
              key={key}
              className="bulldozer-plane-item"
              onClick={() => onSelect(
                isInventory
                  ? { aircraftId: ac.aircraftId, stars: ac.stars, proficiency: ac.proficiency }
                  : (ac.id ?? ac.aircraftId)
              )}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px',
                cursor: 'pointer',
                borderRadius: 'var(--bulldozer-radius-sm, 4px)',
                marginBottom: 3,
                color: 'var(--bulldozer-text-primary, #1c2127)',
              }}
            >
              <span style={{ flex: 1 }}>{ac.name}</span>
              {isInventory && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {ac.stars > 0 && (
                    <span style={{ color: '#f5a623' }}>★{ac.stars}</span>
                  )}
                  <span style={{ color: 'var(--bulldozer-text-secondary, #888)' }}>
                    {__(PROFICIENCY_LABELS[ac.proficiency ?? 0])}
                  </span>
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

export default PlaneList
