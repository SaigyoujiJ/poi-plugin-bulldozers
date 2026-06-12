import React, { Component } from 'react'
import { PROFICIENCY } from '../lib/calc/proficiency'
import { lookupAircraft } from '../lib/calc/aircraftData'
import { setSlotProficiency, setSlotStars, clearSlot } from '../redux/actions'

class SlotRow extends Component {
  handleProficiencyChange = (e) => {
    const { dispatch, presetId, squadronIndex, slotIndex } = this.props
    dispatch(setSlotProficiency(presetId, squadronIndex, slotIndex, Number(e.target.value)))
  }

  handleStarsChange = (e) => {
    const { dispatch, presetId, squadronIndex, slotIndex } = this.props
    dispatch(setSlotStars(presetId, squadronIndex, slotIndex, Number(e.target.value)))
  }

  handleClear = () => {
    const { dispatch, presetId, squadronIndex, slotIndex } = this.props
    dispatch(clearSlot(presetId, squadronIndex, slotIndex))
  }

  render() {
    const { slot, selected, onSelect, dispatch } = this.props
    const planeInfo = slot.aircraftId ? lookupAircraft(slot.aircraftId) : null
    const planeName = planeInfo ? planeInfo.aircraft.name : '未配置'

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <button
          onClick={onSelect}
          style={{
            background: selected
              ? 'var(--bulldozer-bg-selected, #ffe082)'
              : 'var(--bulldozer-bg-input, #f5f5f5)',
            border: selected
              ? '2px solid var(--bulldozer-border-active, #ff9800)'
              : '1px solid var(--bulldozer-border, #ccc)',
            color: 'var(--bulldozer-text-primary, #333)',
            padding: '2px 8px',
            cursor: 'pointer',
          }}
        >
          {planeName}
        </button>
        <select value={slot.proficiency} onChange={this.handleProficiencyChange}>
          {PROFICIENCY.map((p) => (
            <option key={p.level} value={p.level}>{p.label}</option>
          ))}
        </select>
        <select value={slot.stars} onChange={this.handleStarsChange}>
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i}>★{i}</option>
          ))}
        </select>
        {slot.aircraftId && (
          <button onClick={this.handleClear} style={{ cursor: 'pointer' }}>×</button>
        )}
      </div>
    )
  }
}

export default SlotRow