import React, { Component } from 'react'
import CategoryTabs from './CategoryTabs'
import PlaneList from './PlaneList'
import { CATEGORY_DATA } from '../../lib/calc/aircraftData'

const { __ } = window.i18n['poi-plugin-bulldozers']

class PlanePicker extends Component {
  renderInventory() {
    const { playerEquips, onPlaneSelect } = this.props
    const equips = playerEquips || []

    if (equips.length === 0) {
      return (
        <div style={{ color: 'var(--bulldozer-text-secondary, #5f6b7a)', fontSize: 12, padding: '8px 0' }}>
          {__('PlanePicker.InventoryEmpty')}
        </div>
      )
    }

    return (
      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
        {equips.map((cat) => (
          <React.Fragment key={cat.categoryKey}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--bulldozer-text-secondary, #5f6b7a)',
              padding: '4px 8px 2px',
              marginTop: 6,
            }}>
              {__(cat.display)} ({cat.aircraft.length})
            </div>
            <PlaneList aircraftList={cat.aircraft} onSelect={onPlaneSelect} />
          </React.Fragment>
        ))}
      </div>
    )
  }

  render() {
    const { activeCategoryKey, onCategoryChange, onPlaneSelect, pickerMode } = this.props
    const mode = pickerMode || 'catalog'

    if (mode === 'inventory') {
      return this.renderInventory()
    }

    return (
      <div>
        <CategoryTabs activeCategoryKey={activeCategoryKey} onCategoryChange={onCategoryChange} />
        <PlaneList categoryKey={activeCategoryKey} onSelect={onPlaneSelect} />
      </div>
    )
  }
}

export default PlanePicker
