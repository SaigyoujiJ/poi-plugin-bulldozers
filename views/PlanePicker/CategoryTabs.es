import React, { Component } from 'react'
import { getCategoryList, getCategoryGroups } from '../../lib/calc/aircraftData'

const { __ } = window.i18n['poi-plugin-bulldozers']

const tabStyle = (active) => ({
  padding: '2px 8px',
  background: active
    ? 'var(--bulldozer-accent, #2d72d2)'
    : 'var(--bulldozer-bg-input, var(--poi-background-color))',
  color: active
    ? 'var(--bulldozer-accent-text, #ffffff)'
    : 'var(--bulldozer-text-primary, #1c2127)',
  border: '1px solid var(--bulldozer-border, #d3d8de)',
  borderRadius: 'var(--bulldozer-radius-sm, 4px)',
  cursor: 'pointer',
  fontSize: 13,
})

class CategoryTabs extends Component {
  render() {
    const { activeCategoryKey, categoryKeys, onCategoryChange } = this.props
    const keySet = categoryKeys ? new Set(categoryKeys) : null

    const displayByKey = new Map(getCategoryList().map((cat) => [cat.key, cat.display]))
    // 只保留有数据（且在 inventory 模式下被持有）的分类；空组整体隐藏
    const groups = getCategoryGroups()
      .map((group) => ({
        ...group,
        categories: group.categories.filter((key) => displayByKey.has(key) && (!keySet || keySet.has(key))),
      }))
      .filter((group) => group.categories.length > 0)

    const activeGroup = groups.find((g) => g.categories.includes(activeCategoryKey)) || groups[0]
    if (!activeGroup) return null

    const showSubRow = activeGroup.categories.length > 1

    return (
      <div style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: showSubRow ? 4 : 8 }}>
          {groups.map((group) => (
            <button
              key={group.key}
              onClick={() => {
                if (group.key !== activeGroup.key) {
                  onCategoryChange(group.categories[0])
                }
              }}
              style={tabStyle(group.key === activeGroup.key)}
            >
              {__(group.display)}
            </button>
          ))}
        </div>
        {showSubRow && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {activeGroup.categories.map((key) => (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                style={tabStyle(key === activeCategoryKey)}
              >
                {__(displayByKey.get(key))}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default CategoryTabs
