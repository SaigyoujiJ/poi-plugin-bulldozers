import { CATEGORY_ORDER, CATEGORY_GROUPS, CATEGORY_STATS } from '../../../lib/calc/poiData'

const KNOWN_STAT_KEYS = new Set(['aa', 'interception', 'anti_bomb', 'torpedo', 'bombing', 'los', 'asw', 'radius'])

describe('category groups', () => {
  test('every category appears in exactly one group', () => {
    const grouped = CATEGORY_GROUPS.flatMap((g) => g.categories)
    expect([...grouped].sort()).toEqual([...CATEGORY_ORDER].sort())
  })

  test('jet group has a single category (no sub-row)', () => {
    const jet = CATEGORY_GROUPS.find((g) => g.key === 'jet')
    expect(jet.categories).toEqual(['jet_aircraft'])
  })
})

describe('category stats config', () => {
  test('every category has a stat display config with known keys', () => {
    for (const key of CATEGORY_ORDER) {
      expect(CATEGORY_STATS[key]).toBeDefined()
      for (const stat of CATEGORY_STATS[key]) {
        expect(KNOWN_STAT_KEYS.has(stat)).toBe(true)
      }
    }
  })
})
