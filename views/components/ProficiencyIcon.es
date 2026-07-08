import React, { Component } from 'react'
import path from 'path'

class ProficiencyIcon extends Component {
  render() {
    const { level, height = 14 } = this.props
    if (level == null || level < 1 || level > 7) {
      return null
    }
    const root = typeof window !== 'undefined' && window.ROOT ? window.ROOT : ''
    return (
      <img
        src={path.join(root, 'assets', 'img', 'airplane', `alv${level}.png`)}
        alt={`proficiency-${level}`}
        style={{ height, marginBottom: 2, verticalAlign: 'middle' }}
      />
    )
  }
}

export default ProficiencyIcon
