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
    const { activeCategoryKey, onCategoryChange, onPlaneSelect, pickerMode, onPickerModeChange } = this.props
    const mode = pickerMode || 'catalog'

    return (
      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <button
            onClick={() => onPickerModeChange && onPickerModeChange('catalog')}
            style={{
              ...modeTabStyle,
              background: mode === 'catalog'
                ? 'var(--bulldozer-accent, #2d72d2)'
                : 'var(--bulldozer-bg-input, var(--poi-background-color))',
              color: mode === 'catalog'
                ? 'var(--bulldozer-accent-text, #ffffff)'
                : 'var(--bulldozer-text-primary, #1c2127)',
            }}
          >
            {__('PlanePicker.Catalog')}
          </button>
          <button
            onClick={() => onPickerModeChange && onPickerModeChange('inventory')}
            style={{
              ...modeTabStyle,
              background: mode === 'inventory'
                ? 'var(--bulldozer-accent, #2d72d2)'
                : 'var(--bulldozer-bg-input, var(--poi-background-color))',
              color: mode === 'inventory'
                ? 'var(--bulldozer-accent-text, #ffffff)'
                : 'var(--bulldozer-text-primary, #1c2127)',
            }}
          >
            {__('PlanePicker.Inventory')}
          </button>
        </div>
        {mode === 'catalog' ? (
          <React.Fragment>
            <CategoryTabs activeCategoryKey={activeCategoryKey} onCategoryChange={onCategoryChange} />
            <PlaneList categoryKey={activeCategoryKey} onSelect={onPlaneSelect} />
          </React.Fragment>
        ) : (
          this.renderInventory()
        )}
      </div>
    )
  }
}

const modeTabStyle = {
  padding: '2px 10px',
  border: '1px solid var(--bulldozer-border, #d3d8de)',
  borderRadius: 'var(--bulldozer-radius-sm, 4px)',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
}

export default PlanePicker
