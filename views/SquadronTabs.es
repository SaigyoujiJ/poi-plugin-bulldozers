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
                ? 'var(--bulldozer-accent, #2d72d2)'
                : 'var(--bulldozer-bg-input, #ffffff)',
              color: i === activeIndex
                ? 'var(--bulldozer-accent-text, #ffffff)'
                : 'var(--bulldozer-text-primary, #1c2127)',
              border: '1px solid var(--bulldozer-border, #d3d8de)',
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