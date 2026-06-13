import presetsReducer, { createDefaultPreset } from '../../redux/presetsReducer'
import { savePreset } from '../../redux/actions'

describe('presetsReducer', () => {
  test('SAVE_PRESET copies the current active preset', () => {
    const state = {
      activePresetId: 'default',
      presets: {
        default: {
          ...createDefaultPreset(),
          squadrons: [
            {
              id: 1,
              name: 'Squadron.First',
              mode: 'sortie',
              slots: [
                { aircraftId: 175, proficiency: 7, stars: 0 },
                { aircraftId: null, proficiency: 0, stars: 0 },
                { aircraftId: null, proficiency: 0, stars: 0 },
                { aircraftId: null, proficiency: 0, stars: 0 },
              ],
            },
            { id: 2, name: 'Squadron.Second', mode: 'sortie', slots: [{ aircraftId: null, proficiency: 0, stars: 0 }, { aircraftId: null, proficiency: 0, stars: 0 }, { aircraftId: null, proficiency: 0, stars: 0 }, { aircraftId: null, proficiency: 0, stars: 0 }] },
            { id: 3, name: 'Squadron.Third', mode: 'sortie', slots: [{ aircraftId: null, proficiency: 0, stars: 0 }, { aircraftId: null, proficiency: 0, stars: 0 }, { aircraftId: null, proficiency: 0, stars: 0 }, { aircraftId: null, proficiency: 0, stars: 0 }] },
          ],
        },
      },
    }

    const newState = presetsReducer(state, savePreset('preset_copy', '副本'))
    expect(newState.activePresetId).toBe('preset_copy')
    expect(newState.presets.preset_copy.name).toBe('副本')
    expect(newState.presets.preset_copy.squadrons).toEqual(state.presets.default.squadrons)
    expect(newState.presets.default).toEqual(state.presets.default)
  })
})
