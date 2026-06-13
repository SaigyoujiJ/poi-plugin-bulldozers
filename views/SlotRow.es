import React, { Component } from 'react'
import { PROFICIENCY } from '../lib/calc/proficiency'
import { lookupAircraft } from '../lib/calc/aircraftData'
import { setSlotProficiency, setSlotStars, clearSlot } from '../redux/actions'

const { __ } = window.i18n['poi-plugin-bulldozers']

const PROFICIENCY_LABELS = [
  'Proficiency.None',
  'Proficiency.Level1',
  'Proficiency.Level2',
  'Proficiency.Level3',
  'Proficiency.Level4',
  'Proficiency.Level5',
  'Proficiency.Level6',
  'Proficiency.Level7',
]

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
              : 'var(--poi-background-color)',
            border: selected
              ? '2px solid var(--bulldozer-border-active, #ff9800)'
              : '1px solid var(--bulldozer-border, #d3d8de)',
            color: 'var(--bulldozer-text-primary, #1c2127)',
            padding: '2px 8px',
            cursor: 'pointer',
          }}
        >
          {planeName}
        </button>
        <select
          value={slot.proficiency}
          onChange={this.handleProficiencyChange}
          style={{
            background: 'var(--poi-background-color)',
            color: 'var(--bulldozer-text-primary, #1c2127)',
            border: '1px solid var(--bulldozer-border, #d3d8de)',
          }}
        >
          {PROFICIENCY.map((p) => (
            <option key={p.level} value={p.level}>{__(PROFICIENCY_LABELS[p.level])}</option>
          ))}
        </select>
        <select
          value={slot.stars}
          onChange={this.handleStarsChange}
          style={{
            background: 'var(--poi-background-color)',
            color: 'var(--bulldozer-text-primary, #1c2127)',
            border: '1px solid var(--bulldozer-border, #d3d8de)',
          }}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i}>★{i}</option>
          ))}
        </select>
        {slot.aircraftId && (
          <button
            onClick={this.handleClear}
            style={{
              background: 'var(--poi-background-color)',
              color: 'var(--bulldozer-text-primary, #1c2127)',
              border: '1px solid var(--bulldozer-border, #d3d8de)',
              cursor: 'pointer',
            }}
          >×</button>
        )}
      </div>
    )
  }
}

export default SlotRow