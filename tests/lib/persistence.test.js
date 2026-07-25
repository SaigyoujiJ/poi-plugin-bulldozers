import { loadState } from '../../lib/persistence'

const STORAGE_KEY = 'poi-plugin-bulldozers.state'

function persistedWith(slots) {
  return {
    activePresetId: 'default',
    presets: {
      default: {
        id: 'default',
        name: 'p',
        squadrons: [
          { id: 1, name: 's', mode: 'sortie', slots },
        ],
      },
    },
  }
}

describe('loadState sanitization', () => {
  beforeEach(() => {
    global.localStorage = { getItem: jest.fn(), setItem: jest.fn() }
  })

  afterEach(() => {
    delete global.localStorage
  })

  test('resets counts exceeding the category max to default (null), keeps valid ones', () => {
    const persisted = persistedWith([
      { aircraftId: 311, proficiency: 0, stars: 0, count: 18, equipId: null }, // 陆侦，上限 4 → null
      { aircraftId: 138, proficiency: 0, stars: 0, count: 18, equipId: null }, // 大艇，上限 4 → null
      { aircraftId: 175, proficiency: 0, stars: 0, count: 18, equipId: null }, // 战斗机，18 合法 → 保留
      { aircraftId: 175, proficiency: 0, stars: 0, count: 14, equipId: null }, // 手动调低 → 保留
    ])
    global.localStorage.getItem.mockReturnValue(JSON.stringify(persisted))

    const state = loadState()
    const slots = state.presets.default.squadrons[0].slots
    expect(slots[0].count).toBe(null)
    expect(slots[1].count).toBe(null)
    expect(slots[2].count).toBe(18)
    expect(slots[3].count).toBe(14)
  })

  test('leaves null counts and unconfigured slots alone', () => {
    const persisted = persistedWith([
      { aircraftId: 311, proficiency: 0, stars: 0, count: null, equipId: null },
      { aircraftId: null, proficiency: 0, stars: 0, count: 18, equipId: null },
      { aircraftId: 999999, proficiency: 0, stars: 0, count: 99, equipId: null }, // 查不到的飞机不处理
      { aircraftId: null, proficiency: 0, stars: 0, count: 0, equipId: null },
    ])
    global.localStorage.getItem.mockReturnValue(JSON.stringify(persisted))

    const state = loadState()
    const slots = state.presets.default.squadrons[0].slots
    expect(slots[0].count).toBe(null)
    expect(slots[1].count).toBe(18)
    expect(slots[2].count).toBe(99)
    expect(slots[3].count).toBe(0)
  })

  test('returns undefined when storage is empty or broken', () => {
    global.localStorage.getItem.mockReturnValue(null)
    expect(loadState()).toBeUndefined()

    global.localStorage.getItem.mockReturnValue('{broken json')
    expect(loadState()).toBeUndefined()
  })
})
