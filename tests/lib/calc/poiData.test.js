import { CATEGORY_ORDER, CATEGORY_GROUPS, CATEGORY_STATS, buildAircraftData } from '../../../lib/calc/poiData'

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

  test('迎击和对爆只对局地战斗机保留和展示', () => {
    const equips = {
      1000: {
        api_id: 1000,
        api_name: 'local fighter',
        api_type: [0, 0, 48, 0],
        api_sortno: 1,
        api_tyku: 5,
        api_houk: 4,
        api_houm: 3,
      },
      1001: {
        api_id: 1001,
        api_name: 'carrier fighter',
        api_type: [0, 0, 6, 0],
        api_sortno: 2,
        api_tyku: 5,
        api_houk: 4,
        api_houm: 3,
      },
      1002: {
        api_id: 1002,
        api_name: 'seaplane fighter',
        api_type: [0, 0, 45, 0],
        api_sortno: 3,
        api_tyku: 5,
        api_houk: 4,
        api_houm: 3,
      },
    }
    const data = buildAircraftData(equips)
    const local = data.lookupMap.get(1000).aircraft
    const carrier = data.lookupMap.get(1001).aircraft
    const seaplane = data.lookupMap.get(1002).aircraft

    expect(local.interception).toBe(4)
    expect(local.anti_bomb).toBe(3)
    expect(carrier.interception).toBeNull()
    expect(carrier.anti_bomb).toBeNull()
    expect(seaplane.interception).toBeNull()
    expect(seaplane.anti_bomb).toBeNull()
    expect(CATEGORY_STATS.local_fighters).toEqual(['aa', 'interception', 'anti_bomb'])
    expect(CATEGORY_STATS.carrier_fighters).not.toContain('interception')
    expect(CATEGORY_STATS.carrier_fighters).not.toContain('anti_bomb')
    expect(CATEGORY_STATS.seaplane_fighters).not.toContain('interception')
    expect(CATEGORY_STATS.seaplane_fighters).not.toContain('anti_bomb')
  })
})
