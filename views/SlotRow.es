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
  constructor(props) {
    super(props)
    this.state = {
      countPickerOpen: false,
    }
  }

  componentDidMount() {
    if (this.rootRef && this.rootRef.current) {
      this.rootRef.current.addEventListener('bulldozers-close-popups', this.closeCountPicker)
    }
  }

  componentWillUnmount() {
    if (this.rootRef && this.rootRef.current) {
      this.rootRef.current.removeEventListener('bulldozers-close-popups', this.closeCountPicker)
    }
  }

  toggleCountPicker = (e) => {
    e.stopPropagation()
    this.setState((prev) => ({ countPickerOpen: !prev.countPickerOpen }))
  }

  closeCountPicker = () => {
    this.setState({ countPickerOpen: false })
  }

  handleCountSliderChange = (e) => {
    const { dispatch, presetId, squadronIndex, slotIndex } = this.props
    dispatch(setSlotCount(presetId, squadronIndex, slotIndex, Number(e.target.value)))
  }

  handleCountWheel = (e) => {
    const { slot, dispatch, presetId, squadronIndex, slotIndex } = this.props
    const planeInfo = slot.aircraftId ? lookupAircraft(slot.aircraftId) : null
    if (!planeInfo) return
    const maxCount = getSlotCount(planeInfo.aircraft, planeInfo.categoryKey)
    const currentCount = slot.count != null ? slot.count : maxCount
    e.preventDefault()
    const delta = e.deltaY > 0 ? -1 : 1
    const next = Math.max(0, Math.min(maxCount, currentCount + delta))
    if (next !== currentCount) {
      dispatch(setSlotCount(presetId, squadronIndex, slotIndex, next))
    }
  }

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

  renderCountPicker(currentCount, maxCount, colors) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          background: '#2a2d34',
          border: '2px solid ' + colors.accent,
          borderRadius: 'var(--bulldozer-radius-sm, 4px)',
          padding: 12,
          minWidth: 180,
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          animation: 'bulldozer-popup-in 0.2s ease',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 10, fontWeight: 700, fontSize: 16, color: '#ffffff' }}>
          {currentCount}
        </div>
        <input
          type="range"
          min={0}
          max={maxCount}
          value={currentCount}
          onChange={this.handleCountSliderChange}
          onWheel={this.handleCountWheel}
          className="bulldozer-count-slider"
          style={{
            width: '100%',
            WebkitAppearance: 'none',
            appearance: 'none',
            height: 8,
            borderRadius: 4,
            background: '#5f6b7a',
            outline: 'none',
          }}
        />
        <style>{`
          .bulldozer-count-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: 3px solid ${colors.accent};
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            margin-top: -6px;
          }
          .bulldozer-count-slider::-webkit-slider-runnable-track {
            height: 8px;
            border-radius: 4px;
            background: #5f6b7a;
          }
          .bulldozer-count-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: 3px solid ${colors.accent};
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
          }
          .bulldozer-count-slider::-moz-range-track {
            height: 8px;
            border-radius: 4px;
            background: #5f6b7a;
          }
        `}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, fontWeight: 600, color: '#b0b5bd' }}>
          <span>0</span>
          <span>{maxCount}</span>
        </div>
      </div>
    )
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
        ref={(el) => { this.rootRef = el }}
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
          <React.Fragment>
            <div
              ref={(el) => { this.countBadgeRef = el }}
              onClick={this.toggleCountPicker}
              style={{
                position: 'relative',
                ...tagStyle,
                background: colors.badgeBg,
                color: colors.badgeText,
                borderColor: colors.accent,
                fontWeight: 600,
                minWidth: 32,
                textAlign: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {currentCount}
              {this.state.countPickerOpen && this.renderCountPicker(currentCount, maxCount, colors)}
            </div>
          </React.Fragment>
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
