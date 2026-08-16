import presetsReducer, { createDefaultPreset } from '../../redux/presetsReducer'
import { savePreset, setSlotAircraft, setSlotStars, clearSlot } from '../../redux/actions'

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

describe('slot equipId tracking', () => {
  const baseState = () => ({
    activePresetId: 'default',
    presets: { default: createDefaultPreset() },
  })

  test('inventory pick stores stars, proficiency and equipId in one action', () => {
    const state = presetsReducer(baseState(), setSlotAircraft('default', 0, 0, 175, { stars: 4, proficiency: 6, equipId: 123 }))
    expect(state.presets.default.squadrons[0].slots[0]).toEqual({
      aircraftId: 175, proficiency: 6, stars: 4, count: null, equipId: 123,
    })
  })

  test('catalog pick resets stars/proficiency and clears equipId', () => {
    let state = presetsReducer(baseState(), setSlotAircraft('default', 0, 0, 175, { stars: 4, proficiency: 6, equipId: 123 }))
    state = presetsReducer(state, setSlotAircraft('default', 0, 0, 176))
    expect(state.presets.default.squadrons[0].slots[0]).toEqual({
      aircraftId: 176, proficiency: 0, stars: 0, count: null, equipId: null,
    })
  })

  test('manual stars edit detaches the slot from its instance', () => {
    let state = presetsReducer(baseState(), setSlotAircraft('default', 0, 0, 175, { stars: 4, proficiency: 6, equipId: 123 }))
    state = presetsReducer(state, setSlotStars('default', 0, 0, 10))
    const slot = state.presets.default.squadrons[0].slots[0]
    expect(slot.stars).toBe(10)
    expect(slot.equipId).toBe(null)
  })

  test('clear slot resets equipId', () => {
    let state = presetsReducer(baseState(), setSlotAircraft('default', 0, 0, 175, { stars: 4, proficiency: 6, equipId: 123 }))
    state = presetsReducer(state, clearSlot('default', 0, 0))
    expect(state.presets.default.squadrons[0].slots[0]).toEqual({
      aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null,
    })
  })

  test('ignores invalid squadron and slot indexes', () => {
    const state = baseState()
    expect(presetsReducer(state, setSlotAircraft('default', 99, 0, 175))).toBe(state)
    expect(presetsReducer(state, setSlotAircraft('default', 0, 99, 175))).toBe(state)
    expect(presetsReducer(state, setSlotAircraft('default', -1, 0, 175))).toBe(state)
    expect(presetsReducer(state, setSlotAircraft('default', 0, -1, 175))).toBe(state)
  })
})
