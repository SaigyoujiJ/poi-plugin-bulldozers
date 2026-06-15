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
                gap: 6,
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
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2px solid ' + mColors.accent,
                  background: active ? mColors.accent : 'transparent',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
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
          {squadron.slots.map((slot, i) => {
            const active = selectedSlotIndex === i
            return (
              <React.Fragment key={i}>
                <SlotRow
                  slot={slot}
                  presetId={presetId}
                  squadronIndex={squadronIndex}
                  slotIndex={i}
                  selected={active}
                  mode={mode}
                  onSelect={() => onSlotSelect(i)}
                  dispatch={dispatch}
                />
                {<div
                  style={{
                    marginLeft: 12,
                    marginBottom: active ? 8 : 0,
                    border: active ? '1px solid ' + colors.accent : '1px solid transparent',
                    borderRadius: 'var(--bulldozer-radius-md, 8px)',
                    padding: active ? 10 : 0,
                    background: 'var(--bulldozer-bg-surface, transparent)',
                    maxHeight: active ? 320 : 0,
                    opacity: active ? 1 : 0,
                    overflow: 'hidden',
                    transform: active ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                    pointerEvents: active ? 'auto' : 'none',
                    transition: 'transform 0.5s ease, opacity 0.4s ease, padding 0.5s ease, margin-bottom 0.5s ease, border-color 0.3s ease, max-height 0.5s ease',
                  }}
                >
                  <PlanePicker
                    activeCategoryKey={activeCategoryKey}
                    onCategoryChange={onCategoryChange}
                    onPlaneSelect={onPlaneSelect}
                  />
                </div>
                }
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }
}

export default SquadronEditor
