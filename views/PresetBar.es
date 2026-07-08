import React, { Component } from 'react'
import { connect } from 'react-redux'
import { extensionSelectorFactory } from 'views/utils/selectors'
import { switchPreset, savePreset, deletePreset } from '../redux/actions'

const { __ } = window.i18n['poi-plugin-bulldozers']

const selector = extensionSelectorFactory('poi-plugin-bulldozers')

class PresetBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSaveDialog: false,
      newPresetName: '',
    }
  }

  handlePresetChange = (e) => {
    const { dispatch } = this.props
    dispatch(switchPreset(e.target.value))
  }

  handleSaveClick = () => {
    this.setState({ showSaveDialog: true, newPresetName: '' })
  }

  handleSaveConfirm = () => {
    const { dispatch } = this.props
    const { newPresetName } = this.state
    if (!newPresetName.trim()) return
    const id = 'preset_' + Date.now()
    dispatch(savePreset(id, newPresetName.trim()))
    this.setState({ showSaveDialog: false })
  }

  handleDeleteClick = () => {
    const { dispatch, activePresetId } = this.props
    dispatch(deletePreset(activePresetId))
  }

  handleNameChange = (e) => {
    this.setState({ newPresetName: e.target.value })
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') this.handleSaveConfirm()
    if (e.key === 'Escape') this.setState({ showSaveDialog: false })
  }

  render() {
    const { activePresetId, presets, onClickOutside } = this.props
    const { showSaveDialog, newPresetName } = this.state
    const presetIds = Object.keys(presets)

    return (
      <div onClick={onClickOutside} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 600, color: 'var(--bulldozer-text-primary, #1c2127)', fontSize: 16 }}>
          {presets[activePresetId] ? presets[activePresetId].name : '预设'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={activePresetId}
            onChange={this.handlePresetChange}
            style={selectStyle}
          >
            {presetIds.map((id) => (
              <option key={id} value={id}>{presets[id].name}</option>
            ))}
          </select>
          <button onClick={this.handleSaveClick} style={outlineButtonStyle}>{__('PresetBar.SaveAs')}</button>
          <button onClick={this.handleDeleteClick} style={outlineButtonStyle}>{__('PresetBar.Delete')}</button>
          {showSaveDialog && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input value={newPresetName} onChange={this.handleNameChange} onKeyDown={this.handleKeyDown} placeholder={__('PresetBar.NamePlaceholder')} autoFocus style={inputStyle} />
              <button onClick={this.handleSaveConfirm} style={outlineButtonStyle}>{__('PresetBar.Confirm')}</button>
              <button onClick={() => this.setState({ showSaveDialog: false })} style={outlineButtonStyle}>{__('PresetBar.Cancel')}</button>
            </span>
          )}
        </div>
      </div>
    )
  }
}

const outlineButtonStyle = {
  background: 'transparent',
  color: 'var(--bulldozer-text-primary, #1c2127)',
  border: '1px solid var(--bulldozer-border, #d3d8de)',
  borderRadius: 'var(--bulldozer-radius-sm, 4px)',
  padding: '4px 10px',
  cursor: 'pointer',
  fontSize: 14,
}

const selectStyle = {
  background: 'var(--bulldozer-bg-input, var(--poi-background-color))',
  color: 'var(--bulldozer-text-primary, #1c2127)',
  border: '1px solid var(--bulldozer-border, #d3d8de)',
  borderRadius: 'var(--bulldozer-radius-sm, 4px)',
  padding: '4px 8px',
  fontSize: 14,
}

const inputStyle = {
  background: 'var(--bulldozer-bg-input, var(--poi-background-color))',
  color: 'var(--bulldozer-text-primary, #1c2127)',
  border: '1px solid var(--bulldozer-border, #d3d8de)',
  borderRadius: 'var(--bulldozer-radius-sm, 4px)',
  padding: '4px 8px',
  fontSize: 14,
}

const mapStateToProps = (state) => {
  const pluginState = selector(state)
  if (!pluginState || !pluginState.presets) {
    return { activePresetId: 'default', presets: {} }
  }
  return {
    activePresetId: pluginState.activePresetId,
    presets: pluginState.presets,
  }
}

export default connect(mapStateToProps)(PresetBar)
