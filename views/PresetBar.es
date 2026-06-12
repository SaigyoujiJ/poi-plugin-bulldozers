import React, { Component } from 'react'
import { connect } from 'react-redux'
import { extensionSelectorFactory } from 'views/utils/selectors'
import { switchPreset, savePreset, deletePreset } from '../redux/actions'

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
    const { activePresetId, presets } = this.props
    const { showSaveDialog, newPresetName } = this.state
    const presetIds = Object.keys(presets)

    return (
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          value={activePresetId}
          onChange={this.handlePresetChange}
          style={{
            background: 'var(--poi-background-color)',
            color: 'var(--bulldozer-text-primary, #1c2127)',
            border: '1px solid var(--bulldozer-border, #d3d8de)',
          }}
        >
          {presetIds.map((id) => (
            <option key={id} value={id}>{presets[id].name}</option>
          ))}
        </select>
        <button
          onClick={this.handleSaveClick}
          style={{
            background: 'var(--poi-background-color)',
            color: 'var(--bulldozer-text-primary, #1c2127)',
            border: '1px solid var(--bulldozer-border, #d3d8de)',
            cursor: 'pointer',
          }}
        >另存</button>
        <button
          onClick={this.handleDeleteClick}
          style={{
            background: 'var(--poi-background-color)',
            color: 'var(--bulldozer-text-primary, #1c2127)',
            border: '1px solid var(--bulldozer-border, #d3d8de)',
            cursor: 'pointer',
          }}
        >删除</button>
        {showSaveDialog && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              value={newPresetName}
              onChange={this.handleNameChange}
              onKeyDown={this.handleKeyDown}
              placeholder="预设名称"
              autoFocus
              style={{
                background: 'var(--poi-background-color)',
                color: 'var(--bulldozer-text-primary, #1c2127)',
                border: '1px solid var(--bulldozer-border, #d3d8de)',
              }}
            />
            <button
              onClick={this.handleSaveConfirm}
              style={{
                background: 'var(--poi-background-color)',
                color: 'var(--bulldozer-text-primary, #1c2127)',
                border: '1px solid var(--bulldozer-border, #d3d8de)',
                cursor: 'pointer',
              }}
            >确定</button>
            <button
              onClick={() => this.setState({ showSaveDialog: false })}
              style={{
                background: 'var(--poi-background-color)',
                color: 'var(--bulldozer-text-primary, #1c2127)',
                border: '1px solid var(--bulldozer-border, #d3d8de)',
                cursor: 'pointer',
              }}
            >取消</button>
          </span>
        )}
      </div>
    )
  }
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