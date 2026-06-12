import React, { Component } from 'react'
import SlotRow from './SlotRow'
import PlanePicker from './PlanePicker'
import { setSquadronMode } from '../redux/actions'

class SquadronEditor extends Component {
  handleModeChange = (e) => {
    const { dispatch, presetId, squadronIndex } = this.props
    dispatch(setSquadronMode(presetId, squadronIndex, e.target.value))
  }

  render() {
    const { squadron, presetId, squadronIndex, selectedSlotIndex, activeCategoryKey, onSlotSelect, onPlaneSelect, onCategoryChange, dispatch } = this.props

    if (!squadron) return null

    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            <input
              type="radio"
              name={`mode-${squadronIndex}`}
              value="sortie"
              checked={squadron.mode === 'sortie'}
              onChange={this.handleModeChange}
            />
            出撃
          </label>
          <label style={{ marginLeft: 8 }}>
            <input
              type="radio"
              name={`mode-${squadronIndex}`}
              value="defense"
              checked={squadron.mode === 'defense'}
              onChange={this.handleModeChange}
            />
            防空
          </label>
        </div>
        {squadron.slots.map((slot, i) => (
          <SlotRow
            key={i}
            slot={slot}
            presetId={presetId}
            squadronIndex={squadronIndex}
            slotIndex={i}
            selected={selectedSlotIndex === i}
            onSelect={() => onSlotSelect(i)}
            dispatch={dispatch}
          />
        ))}
        {selectedSlotIndex != null && (
          <PlanePicker
            activeCategoryKey={activeCategoryKey}
            onCategoryChange={onCategoryChange}
            onPlaneSelect={onPlaneSelect}
          />
        )}
      </div>
    )
  }
}

export default SquadronEditor