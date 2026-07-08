import React, { Component } from 'react'
import { getCategoryList } from '../../lib/calc/aircraftData'

const { __ } = window.i18n['poi-plugin-bulldozers']

class CategoryTabs extends Component {
  render() {
    const { activeCategoryKey, categoryKeys, onCategoryChange } = this.props
    let categories = getCategoryList()
    if (categoryKeys) {
      const keySet = new Set(categoryKeys)
      categories = categories.filter((cat) => keySet.has(cat.key))
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            style={{
              padding: '2px 8px',
              background: cat.key === activeCategoryKey
                ? 'var(--bulldozer-accent, #2d72d2)'
                : 'var(--bulldozer-bg-input, var(--poi-background-color))',
              color: cat.key === activeCategoryKey
                ? 'var(--bulldozer-accent-text, #ffffff)'
                : 'var(--bulldozer-text-primary, #1c2127)',
              border: '1px solid var(--bulldozer-border, #d3d8de)',
              borderRadius: 'var(--bulldozer-radius-sm, 4px)',
              cursor: 'pointer',
              fontSize: 11,
            }}
          >
            {__(cat.display)}
          </button>
        ))}
      </div>
    )
  }
}

export default CategoryTabs