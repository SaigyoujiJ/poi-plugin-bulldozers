import React, { Component } from 'react'
import CategoryTabs from './CategoryTabs'
import PlaneList from './PlaneList'
import { CATEGORY_DATA } from '../../lib/calc/aircraftData'

const { __ } = window.i18n['poi-plugin-bulldozers']

class PlanePicker extends Component {
  renderInventory() {
    const { playerEquips, activeCategoryKey, onCategoryChange, onPlaneSelect } = this.props
    const equips = playerEquips || []

    if (equips.length === 0) {
      return (
        <div style={{ color: 'var(--bulldozer-text-secondary, #5f6b7a)', fontSize: 12, padding: '8px 0' }}>
          {__('PlanePicker.InventoryEmpty')}
        </div>
      )
    }

    const ownedKeys = equips.map((c) => c.categoryKey)
    const activeCat = equips.find((c) => c.categoryKey === activeCategoryKey) || equips[0]

    return (
      <div>
        <CategoryTabs
          activeCategoryKey={activeCat.categoryKey}
          categoryKeys={ownedKeys}
          onCategoryChange={onCategoryChange}
        />
        <PlaneList aircraftList={activeCat.aircraft} onSelect={onPlaneSelect} />
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
