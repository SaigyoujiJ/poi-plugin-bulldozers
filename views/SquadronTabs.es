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
              background: i === activeIndex ? '#4a90d9' : '#ddd',
              color: i === activeIndex ? '#fff' : '#333',
              border: '1px solid #999',
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