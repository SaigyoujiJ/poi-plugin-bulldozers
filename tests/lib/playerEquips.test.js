import { aggregatePlayerEquips } from '../../lib/playerEquips'

describe('aggregatePlayerEquips', () => {
  test('returns empty array when equips is falsy', () => {
    expect(aggregatePlayerEquips(null)).toEqual([])
    expect(aggregatePlayerEquips(undefined)).toEqual([])
  })

  test('returns empty array when equips is empty object', () => {
    expect(aggregatePlayerEquips({})).toEqual([])
  })

  test('skips equips with unknown api_slotitem_id', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 999999, api_level: 0, api_alv: 0, api_locked: 0 },
    }
    expect(aggregatePlayerEquips(equips)).toEqual([])
  })

  test('lists a single known aircraft with stars and proficiency', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 2, api_alv: 3, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result).toEqual([
      {
        categoryKey: 'land_attackers',
        display: 'AircraftCategory.LandAttackers',
        aircraft: [
          { aircraftId: 168, name: '九六式陸攻', stars: 2, proficiency: 3 },
        ],
      },
    ])
  })

  test('lists each equip instance separately (no aggregation)', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
      2: { api_id: 2, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 1 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result[0].aircraft).toHaveLength(2)
    expect(result[0].aircraft[0]).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 0 })
    expect(result[0].aircraft[1]).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 0 })
  })

  test('keeps different stars/proficiency versions as separate entries', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
      2: { api_id: 2, api_slotitem_id: 168, api_level: 3, api_alv: 0, api_locked: 0 },
      3: { api_id: 3, api_slotitem_id: 168, api_level: 0, api_alv: 2, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result[0].aircraft).toHaveLength(3)
    expect(result[0].aircraft[0]).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 0 })
    expect(result[0].aircraft[1]).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 2 })
    expect(result[0].aircraft[2]).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 3, proficiency: 0 })
  })

  test('sorts aircraft in a category by id then stars then proficiency', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 3, api_alv: 0, api_locked: 0 },
      2: { api_id: 2, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
      3: { api_id: 3, api_slotitem_id: 168, api_level: 0, api_alv: 2, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    const [a, b, c] = result[0].aircraft
    expect(a).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 0 })
    expect(b).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 2 })
    expect(c).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 3, proficiency: 0 })
  })

  test('skips equip with null/missing api_slotitem_id', () => {
    const equips = {
      1: { api_id: 1, api_level: 0, api_alv: 0, api_locked: 0 },
      2: null,
      3: { api_id: 3, api_slotitem_id: 168, api_level: 2, api_alv: 0, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result[0].aircraft).toHaveLength(1)
  })

  test('defaults missing stars and proficiency to 0', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result[0].aircraft[0].stars).toBe(0)
    expect(result[0].aircraft[0].proficiency).toBe(0)
  })

  test('only includes categories with matching aircraft', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result.length).toBe(1)
    expect(result[0].display).toBe('AircraftCategory.LandAttackers')
    expect(result.find((c) => c.categoryKey === 'carrier_fighters')).toBeUndefined()
  })
})
