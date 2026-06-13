import { calcSortieAirPower } from '../../../lib/calc/airPower'
import { aircraftLookup } from '../../../lib/calc/aircraftData'

describe('sortie air power', () => {
  test('雷電 18機 熟練度>> 出击制空 = 75', () => {
    // base = floor((9 + 1.5*2) * sqrt(18)) = 50
    // floor(base + sqrt(120/10)) + 22(display) = floor(53.464...) + 22 = 75
    const slots = [{ aircraftId: 175, proficiency: 7, stars: 0 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(75)
  })

  test('三式戦 飛燕 18機 熟練度>> 出击制空 = 97', () => {
    // base = floor((12.5 + 1.5*3) * sqrt(18)) = 72
    // floor(base + sqrt(120/10)) + 22(display) = floor(75.464...) + 22 = 97
    const slots = [{ aircraftId: 176, proficiency: 7, stars: 0 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(97)
  })

  test('三式戦 飛燕 18機 熟練度>> ★10 出击制空', () => {
    // improvement = 0.2 * 10 = 2
    // base = floor((12.5 + 2 + 1.5*3) * sqrt(18)) = 80
    // floor(base + sqrt(120/10)) + 22(display) = floor(83.464...) + 22 = 105
    const slots = [{ aircraftId: 176, proficiency: 7, stars: 10 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(105)
  })

  test('九六式陸攻 18機 出击制空（intercept = 0）', () => {
    // base = floor(1 * sqrt(18)) = 4
    // floor(base + sqrt(9/10)) + 0(display) = floor(4.948...) = 4
    const slots = [{ aircraftId: 168 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(4)
  })

  test('多槽位求和', () => {
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 176, proficiency: 7, stars: 0 },
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(75 + 97)
  })

  test('空槽位 / 无 aircraftId 被跳过', () => {
    const slots = [
      {},
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: null },
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(75)
  })
})
