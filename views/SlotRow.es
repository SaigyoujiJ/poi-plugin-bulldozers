import React, { Component } from 'react'
import { PROFICIENCY } from '../lib/calc/proficiency'
import { lookupAircraft, getSlotitemIconId } from '../lib/calc/aircraftData'
import { setSlotProficiency, setSlotStars, setSlotCount, clearSlot } from '../redux/actions'
import { getSlotCount } from '../lib/calc/planeType'
import { getModeColor } from '../lib/ui/themeColors'
import ProficiencyIcon from './components/ProficiencyIcon'
import SlotitemIcon from './components/SlotitemIcon'

const { __ } = window.i18n['poi-plugin-bulldozers']

class SlotRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countPickerOpen: false,
      proficiencyPickerOpen: false,
      proficiencyPickerUpward: false,
    }
  }

  componentDidMount() {
    document.addEventListener('bulldozers-close-popups', this.closeAllPickers)
    document.addEventListener('mousedown', this.handleDocumentClick)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected && !this.props.selected) {
      this.setState({ countPickerOpen: false, proficiencyPickerOpen: false })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('bulldozers-close-popups', this.closeAllPickers)
    document.removeEventListener('mousedown', this.handleDocumentClick)
  }

  isClickInsidePicker = (target) => {
    const countNode = this.countBadgeRef
    const profNode = this.proficiencyBadgeRef
    return (countNode && countNode.contains(target)) || (profNode && profNode.contains(target))
  }

  handleDocumentClick = (e) => {
    if (this.state.countPickerOpen || this.state.proficiencyPickerOpen) {
      if (!this.isClickInsidePicker(e.target)) {
        this.setState({ countPickerOpen: false, proficiencyPickerOpen: false })
      }
    }
  }

  toggleCountPicker = (e) => {
    e.stopPropagation()
    this.setState((prev) => ({ countPickerOpen: !prev.countPickerOpen, proficiencyPickerOpen: false }))
  }

  closeCountPicker = () => {
    this.setState({ countPickerOpen: false })
  }

  getPluginRootRect() {
    const root = this.rootRef?.current?.closest('.bulldozers-app')
    return root ? root.getBoundingClientRect() : null
  }

  toggleProficiencyPicker = (e) => {
    e.stopPropagation()
    const badge = this.proficiencyBadgeRef
    let upward = false
    if (badge) {
      const badgeRect = badge.getBoundingClientRect()
      const rootRect = this.getPluginRootRect()
      const pickerHeight = 8 * 28
      const bottomLimit = rootRect ? rootRect.bottom : window.innerHeight
      const topLimit = rootRect ? rootRect.top : 0
      const spaceBelow = bottomLimit - badgeRect.bottom
      const spaceAbove = badgeRect.top - topLimit
      upward = spaceBelow < pickerHeight && spaceAbove > spaceBelow
    }
    this.setState((prev) => ({
      proficiencyPickerOpen: !prev.proficiencyPickerOpen,
      countPickerOpen: false,
      proficiencyPickerUpward: upward,
    }))
  }

  closeProficiencyPicker = () => {
    this.setState({ proficiencyPickerOpen: false })
  }

  closeAllPickers = () => {
    this.setState({ countPickerOpen: false, proficiencyPickerOpen: false })
  }

  handleProficiencySelect = (level) => {
    const { dispatch, presetId, squadronIndex, slotIndex } = this.props
    dispatch(setSlotProficiency(presetId, squadronIndex, slotIndex, level))
    this.setState({ proficiencyPickerOpen: false })
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

  renderProficiencyPicker() {
    const { slot } = this.props
    const upward = this.state.proficiencyPickerUpward
    return (
      <div
        ref={(el) => { this.proficiencyPickerRef = el }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          [upward ? 'bottom' : 'top']: '100%',
          [upward ? 'marginBottom' : 'marginTop']: 4,
          left: 0,
          background: '#2a2d34',
          border: '2px solid var(--bulldozer-border, #d3d8de)',
          borderRadius: 'var(--bulldozer-radius-sm, 4px)',
          padding: 6,
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          animation: 'bulldozer-popup-in 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 36,
        }}
      >
        {PROFICIENCY.map((p) => (
          <button
            key={p.level}
            onClick={() => this.handleProficiencySelect(p.level)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 6px',
              background: slot.proficiency === p.level ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--bulldozer-radius-sm, 4px)',
              cursor: 'pointer',
            }}
          >
            {p.level === 0 ? (
              <span style={{ color: '#b0b5bd', fontSize: 13, fontWeight: 600 }}>-</span>
            ) : (
              <ProficiencyIcon level={p.level} height={16} />
            )}
          </button>
        ))}
      </div>
    )
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
        <div style={{ textAlign: 'center', marginBottom: 10, fontWeight: 700, fontSize: 18, color: '#ffffff' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 14, fontWeight: 600, color: '#b0b5bd' }}>
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
        {isConfigured && (
          <SlotitemIcon iconId={getSlotitemIconId(slot.aircraftId)} />
        )}
        <div style={{ flex: 1, fontWeight: isConfigured ? 500 : 400, color: isConfigured ? 'var(--bulldozer-text-primary, #1c2127)' : 'var(--bulldozer-text-secondary, #5f6b7a)' }}>
          {planeName}
        </div>
        <div
          ref={(el) => { this.proficiencyBadgeRef = el }}
          onClick={this.toggleProficiencyPicker}
          style={{ position: 'relative', ...tagStyle, cursor: 'pointer', flexShrink: 0 }}
        >
          {slot.proficiency === 0 ? (
            <span style={{ color: 'var(--bulldozer-text-secondary, #888)', fontSize: 13, fontWeight: 600 }}>-</span>
          ) : (
            <ProficiencyIcon level={slot.proficiency} height={14} />
          )}
          {this.state.proficiencyPickerOpen && this.renderProficiencyPicker()}
        </div>
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
              fontSize: 16,
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
  fontSize: 13,
  cursor: 'pointer',
}

export default SlotRow
