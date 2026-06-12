import React, { Component } from 'react'
import { getCategoryList } from '../../lib/calc/aircraftData'

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
              background: cat.key === activeCategoryKey ? '#4a90d9' : '#eee',
              color: cat.key === activeCategoryKey ? '#fff' : '#333',
              border: '1px solid #999',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {cat.display}
          </button>
        ))}
      </div>
    )
  }
}

export default CategoryTabs