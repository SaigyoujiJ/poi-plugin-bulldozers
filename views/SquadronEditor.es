import React, { Component } from 'react'
import SlotRow from './SlotRow'
import PlanePicker from './PlanePicker'
import { setSquadronMode } from '../redux/actions'
import { getModeColor } from '../lib/ui/themeColors'

const { __ } = window.i18n['poi-plugin-bulldozers']

class SquadronEditor extends Component {
  handleModeChange = (e) => {
    const { dispatch, presetId, squadronIndex } = this.props
    dispatch(setSquadronMode(presetId, squadronIndex, e.target.value))
  }

  renderModeToggle(mode) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {['sortie', 'defense'].map((m) => {
          const active = mode === m
          const mColors = getModeColor(m)
          return (
            <label
              key={m}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
                opacity: active ? 1 : 0.75,
                color: active ? 'var(--bulldozer-text-primary, #1c2127)' : 'var(--bulldozer-text-secondary, #5f6b7a)',
              }}
            >
              <input
                type="radio"
                name={'mode-' + this.props.squadronIndex}
                value={m}
                checked={active}
                onChange={this.handleModeChange}
                style={{ accentColor: mColors.accent }}
              />
              {m === 'sortie' ? __('SquadronEditor.Sortie') : __('SquadronEditor.Defense')}
            </label>
          )
        })}
      </div>
    )
  }

  render() {
    const { squadron, presetId, squadronIndex, selectedSlotIndex, activeCategoryKey, onSlotSelect, onPlaneSelect, onCategoryChange, dispatch } = this.props

    if (!squadron) return null
    const mode = squadron.mode || 'sortie'
    const colors = getModeColor(mode)

    return (
      <div style={{ marginBottom: 12 }}>
        {this.renderModeToggle(mode)}
        <div>
          {squadron.slots.map((slot, i) => (
            <React.Fragment key={i}>
              <SlotRow
                slot={slot}
                presetId={presetId}
                squadronIndex={squadronIndex}
                slotIndex={i}
                selected={selectedSlotIndex === i}
                mode={mode}
                onSelect={() => onSlotSelect(i)}
                dispatch={dispatch}
              />
              {selectedSlotIndex === i && (
                <div style={{ marginLeft: 12, marginBottom: 8, border: '1px solid ' + colors.accent, borderRadius: 'var(--bulldozer-radius-md, 8px)', padding: 10, background: 'var(--bulldozer-bg-surface, transparent)' }}>
                  <PlanePicker
                    activeCategoryKey={activeCategoryKey}
                    onCategoryChange={onCategoryChange}
                    onPlaneSelect={onPlaneSelect}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }
}

export default SquadronEditor
