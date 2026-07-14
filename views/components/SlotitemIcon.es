import React, { Component } from 'react'
import path from 'path'

class SlotitemIcon extends Component {
  render() {
    const { iconId, height = 18 } = this.props
    const root = typeof window !== 'undefined' && window.ROOT ? window.ROOT : ''
    const fileName = iconId != null ? `${iconId + 100}.png` : '-1.png'
    return (
      <img
        src={path.join(root, 'assets', 'img', 'slotitem', fileName)}
        alt={`slotitem-${iconId ?? 'unknown'}`}
        style={{ height, width: 'auto', verticalAlign: 'middle' }}
      />
    )
  }
}

export default SlotitemIcon
