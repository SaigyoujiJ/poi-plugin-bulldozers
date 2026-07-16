import React, { Component } from 'react'
import { getCategoryData, getSlotitemIconId } from '../../lib/calc/aircraftData'
import ProficiencyIcon from '../components/ProficiencyIcon'
import SlotitemIcon from '../components/SlotitemIcon'

const { __ } = window.i18n['poi-plugin-bulldozers']

class PlaneList extends Component {
  render() {
    const { categoryKey, aircraftList, onSelect } = this.props
    const list = aircraftList || getCategoryData()[categoryKey] || []
    const isInventory = aircraftList && list.length > 0 && list[0].stars != null

    return (
      <div style={{ maxHeight: 200, overflowY: 'auto', cursor: 'default' }}>
        {list.map((ac) => {
          const key = isInventory
            ? `${ac.aircraftId}-${ac.stars}-${ac.proficiency}`
            : (ac.id ?? ac.aircraftId)
          return (
            <div
              key={key}
              className="bulldozer-plane-item"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(
                  isInventory
                    ? { aircraftId: ac.aircraftId, stars: ac.stars, proficiency: ac.proficiency }
                    : (ac.id ?? ac.aircraftId)
                )
              }}
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
              <SlotitemIcon iconId={getSlotitemIconId(ac.id ?? ac.aircraftId)} />
              <span style={{ flex: 1, cursor: 'pointer' }}>{ac.name}</span>
              {isInventory && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                  cursor: 'pointer',
                }}>
                  {ac.stars > 0 && (
                    <span style={{ color: '#f5a623' }}>★{ac.stars}</span>
                  )}
                  <ProficiencyIcon level={ac.proficiency} />
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
