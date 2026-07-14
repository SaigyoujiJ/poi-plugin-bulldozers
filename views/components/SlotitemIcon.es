import React, { Component } from 'react'
import path from 'path'

class SlotitemIcon extends Component {
  handleError = (e) => {
    const root = typeof window !== 'undefined' && window.ROOT ? window.ROOT : ''
    const fallback = 'file://' + path.join(root, 'assets', 'img', 'slotitem', '-1.png')
    if (e.target.src !== fallback) {
      e.target.src = fallback
    }
  }

  render() {
    const { iconId, height = 18 } = this.props
    const root = typeof window !== 'undefined' && window.ROOT ? window.ROOT : ''
    const fileName = iconId != null ? `${iconId + 100}.png` : '-1.png'
    const src = 'file://' + path.join(root, 'assets', 'img', 'slotitem', fileName)
    return (
      <img
        src={src}
        onError={this.handleError}
        alt={`slotitem-${iconId ?? 'unknown'}`}
        style={{ height, width: 'auto', verticalAlign: 'middle' }}
      />
    )
  }
}

export default SlotitemIcon
