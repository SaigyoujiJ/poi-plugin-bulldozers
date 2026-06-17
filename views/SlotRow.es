import React, { Component } from 'react'
import { PROFICIENCY } from '../lib/calc/proficiency'
import { lookupAircraft } from '../lib/calc/aircraftData'
import { setSlotProficiency, setSlotStars, setSlotCount, clearSlot } from '../redux/actions'
import { getSlotCount } from '../lib/calc/planeType'
import { getModeColor } from '../lib/ui/themeColors'

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

  handleCountChange = (nextCount) => {
    const { dispatch, presetId, squadronIndex, slotIndex } = this.props
    dispatch(setSlotCount(presetId, squadronIndex, slotIndex, nextCount))
  }

  handleCountDecrement = () => {
    const { slot } = this.props
    const next = Math.max(0, (slot.count ?? 0) - 1)
    this.handleCountChange(next)
  }

  handleCountIncrement = () => {
    const { slot } = this.props
    const planeInfo = slot.aircraftId ? lookupAircraft(slot.aircraftId) : null
    const maxCount = planeInfo ? getSlotCount(planeInfo.aircraft, planeInfo.categoryKey) : 0
    const next = Math.min(maxCount, (slot.count ?? 0) + 1)
    this.handleCountChange(next)
  }

  handleClear = () => {
    const { dispatch, presetId, squadronIndex, slotIndex } = this.props
    dispatch(clearSlot(presetId, squadronIndex, slotIndex))
  }

  render() {
    const { slot, selected, onSelect, mode } = this.props
    const planeInfo = slot.aircraftId ? lookupAircraft(slot.aircraftId) : null
    const planeName = planeInfo ? planeInfo.aircraft.name : __('SlotRow.Empty')
    const isConfigured = !!slot.aircraftId
    const colors = getModeColor(mode)
    const maxCount = planeInfo ? getSlotCount(planeInfo.aircraft, planeInfo.categoryKey) : 0
    const currentCount = isConfigured ? (slot.count != null ? slot.count : maxCount) : 0

    return (
      <div
        onClick={onSelect}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          background: 'var(--bulldozer-card-bg, #f5f5f5)',
          borderRadius: 'var(--bulldozer-radius-md, 8px)',
          borderLeft: isConfigured ? '3px solid ' + colors.accent : '3px solid transparent',
          opacity: 1,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          marginBottom: 6,
          boxShadow: selected ? '0 0 0 1px ' + colors.accent : 'none',
        }}
      >
        {isConfigured && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid ' + colors.accent,
              borderRadius: 'var(--bulldozer-radius-sm, 4px)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <button
              onClick={this.handleCountDecrement}
              style={{
                background: colors.badgeBg,
                color: colors.badgeText,
                border: 'none',
                borderRight: '1px solid ' + colors.accent,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >−</button>
            <div
              style={{
                background: colors.badgeBg,
                color: colors.badgeText,
                minWidth: 28,
                padding: '2px 4px',
                fontSize: 11,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {currentCount}
            </div>
            <button
              onClick={this.handleCountIncrement}
              style={{
                background: colors.badgeBg,
                color: colors.badgeText,
                border: 'none',
                borderLeft: '1px solid ' + colors.accent,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >+</button>
          </div>
        )}
        <div style={{ flex: 1, fontWeight: isConfigured ? 500 : 400, color: isConfigured ? 'var(--bulldozer-text-primary, #1c2127)' : 'var(--bulldozer-text-secondary, #5f6b7a)' }}>
          {planeName}
        </div>
        <select
          value={slot.proficiency}
          onChange={this.handleProficiencyChange}
          onClick={(e) => e.stopPropagation()}
          style={tagStyle}
        >
          {PROFICIENCY.map((p) => (
            <option key={p.level} value={p.level} style={{ color: 'var(--bulldozer-text-primary, #1c2127)' }}>{__(PROFICIENCY_LABELS[p.level])}</option>
          ))}
        </select>
        <select
          value={slot.stars}
          onChange={this.handleStarsChange}
          onClick={(e) => e.stopPropagation()}
          style={{
            ...tagStyle,
            background: isConfigured ? colors.badgeBg : 'var(--poi-background-color)',
            color: isConfigured ? colors.badgeText : 'var(--bulldozer-text-primary, #1c2127)',
            borderColor: isConfigured ? colors.accent : 'var(--bulldozer-border, #d3d8de)',
            fontWeight: 600,
          }}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i} style={{ color: 'var(--bulldozer-text-primary, #1c2127)' }}>★{i}</option>
          ))}
        </select>
        {isConfigured && (
          <button
            onClick={(e) => { e.stopPropagation(); this.handleClear() }}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.accent,
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: 14,
            }}
          >×</button>
        )}
      </div>
    )
  }
}

const tagStyle = {
  background: 'var(--poi-background-color)',
  color: 'var(--bulldozer-text-primary, #1c2127)',
  border: '1px solid var(--bulldozer-border, #d3d8de)',
  borderRadius: 'var(--bulldozer-radius-sm, 4px)',
  padding: '2px 6px',
  fontSize: 11,
  cursor: 'pointer',
}

export default SlotRow
