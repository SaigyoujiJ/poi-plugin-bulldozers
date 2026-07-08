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

  test('counts a single known aircraft with default stars/proficiency', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result.length).toBeGreaterThan(0)
    const cat = result.find((c) => c.categoryKey === 'land_attackers')
    expect(cat).toBeDefined()
    expect(cat.aircraft).toEqual([
      { aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 0, count: 1 },
    ])
  })

  test('counts identical aircraft with same stars together', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
      2: { api_id: 2, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 1 },
    }
    const result = aggregatePlayerEquips(equips)
    const cat = result.find((c) => c.categoryKey === 'land_attackers')
    expect(cat.aircraft).toEqual([
      { aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 0, count: 2 },
    ])
  })

  test('splits same aircraft with different stars into separate entries', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
      2: { api_id: 2, api_slotitem_id: 168, api_level: 3, api_alv: 0, api_locked: 0 },
      3: { api_id: 3, api_slotitem_id: 168, api_level: 3, api_alv: 0, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    const cat = result.find((c) => c.categoryKey === 'land_attackers')
    expect(cat.aircraft).toHaveLength(2)
    expect(cat.aircraft).toEqual([
      { aircraftId: 168, name: '九六式陸攻', stars: 0, proficiency: 0, count: 1 },
      { aircraftId: 168, name: '九六式陸攻', stars: 3, proficiency: 0, count: 2 },
    ])
  })

  test('splits same aircraft with different proficiency into separate entries', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 3, api_alv: 2, api_locked: 0 },
      2: { api_id: 2, api_slotitem_id: 168, api_level: 3, api_alv: 5, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    const cat = result.find((c) => c.categoryKey === 'land_attackers')
    expect(cat.aircraft).toHaveLength(2)
    expect(cat.aircraft[0]).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 3, proficiency: 2, count: 1 })
    expect(cat.aircraft[1]).toEqual({ aircraftId: 168, name: '九六式陸攻', stars: 3, proficiency: 5, count: 1 })
  })

  test('skips equip with null/missing api_slotitem_id', () => {
    const equips = {
      1: { api_id: 1, api_level: 0, api_alv: 0, api_locked: 0 },
      2: null,
      3: { api_id: 3, api_slotitem_id: 168, api_level: 2, api_alv: 0, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    const cat = result.find((c) => c.categoryKey === 'land_attackers')
    expect(cat.aircraft[0].stars).toBe(2)
    expect(cat.aircraft[0].count).toBe(1)
  })

  test('defaults missing stars and proficiency to 0', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    const cat = result.find((c) => c.categoryKey === 'land_attackers')
    expect(cat.aircraft[0].stars).toBe(0)
    expect(cat.aircraft[0].proficiency).toBe(0)
  })

  test('groups aircraft by categoryKey in correct order', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result.length).toBe(1)
    expect(result[0].display).toBe('AircraftCategory.LandAttackers')
  })

  test('only includes categories with matching aircraft', () => {
    const equips = {
      1: { api_id: 1, api_slotitem_id: 168, api_level: 0, api_alv: 0, api_locked: 0 },
    }
    const result = aggregatePlayerEquips(equips)
    expect(result.every((c) => c.aircraft.length > 0)).toBe(true)
    expect(result.find((c) => c.categoryKey === 'carrier_fighters')).toBeUndefined()
  })
})
