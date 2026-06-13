import React, { Component } from 'react'
import { getCategoryList } from '../../lib/calc/aircraftData'

const { __ } = window.i18n['poi-plugin-bulldozers']

class CategoryTabs extends Component {
  render() {
    const { activeCategoryKey, onCategoryChange } = this.props
    const categories = getCategoryList()
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
                : 'var(--poi-background-color)',
              color: cat.key === activeCategoryKey
                ? 'var(--bulldozer-accent-text, #ffffff)'
                : 'var(--bulldozer-text-primary, #1c2127)',
              border: '1px solid var(--bulldozer-border, #d3d8de)',
              cursor: 'pointer',
              fontSize: 12,
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