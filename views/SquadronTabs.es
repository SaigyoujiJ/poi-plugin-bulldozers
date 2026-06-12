import React, { Component } from 'react'

class SquadronTabs extends Component {
  render() {
    const { activeIndex, squadrons, onTabChange } = this.props
    return (
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {squadrons.map((sq, i) => (
          <button
            key={sq.id}
            onClick={() => onTabChange(i)}
            style={{
              padding: '4px 12px',
              background: i === activeIndex
                ? 'var(--bulldozer-accent, #4a90d9)'
                : 'var(--bulldozer-bg-input, #ddd)',
              color: i === activeIndex
                ? 'var(--bulldozer-accent-text, #fff)'
                : 'var(--bulldozer-text-primary, #333)',
              border: '1px solid var(--bulldozer-border, #999)',
              cursor: 'pointer',
            }}
          >
            {sq.name}
          </button>
        ))}
      </div>
    )
  }
}

export default SquadronTabs