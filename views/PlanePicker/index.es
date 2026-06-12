import React, { Component } from 'react'
import CategoryTabs from './CategoryTabs'
import PlaneList from './PlaneList'

class PlanePicker extends Component {
  render() {
    const { activeCategoryKey, onCategoryChange, onPlaneSelect } = this.props
    return (
      <div style={{ marginTop: 8, border: '1px solid #ddd', padding: 8, borderRadius: 4 }}>
        <CategoryTabs
          activeCategoryKey={activeCategoryKey}
          onCategoryChange={onCategoryChange}
        />
        <PlaneList
          categoryKey={activeCategoryKey}
          onSelect={onPlaneSelect}
        />
      </div>
    )
  }
}

export default PlanePicker