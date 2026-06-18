import React, { Component } from 'react'
import { getModeColor } from '../lib/ui/themeColors'

class SquadronTabs extends Component {
  render() {
    const { activeIndex, squadrons, onTabChange, onClickOutside } = this.props

    return (
      <div style={{ marginBottom: 16 }} onClick={onClickOutside}>
        <div style={{ display: 'flex', position: 'relative' }}>
          {squadrons.map((sq, i) => {
            const isActive = i === activeIndex
            const modeColor = getModeColor(sq.mode).accent
            return (
              <button
                key={sq.id}
                onClick={(e) => { e.stopPropagation(); onTabChange(i) }}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid ' + modeColor : '2px solid transparent',
                  color: isActive ? 'var(--bulldozer-text-primary, #1c2127)' : 'var(--bulldozer-text-secondary, #888)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {sq.name}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', height: 2, marginTop: -2, background: 'var(--bulldozer-border, #d3d8de)', borderRadius: 1 }}>
          {squadrons.map((sq) => {
            const modeColor = getModeColor(sq.mode).accent
            return (
              <div
                key={sq.id}
                style={{
                  flex: 1,
                  height: '100%',
                  background: modeColor,
                  opacity: 0.8,
                }}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default SquadronTabs