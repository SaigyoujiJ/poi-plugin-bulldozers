import { calcSortieAirPower, calcDefenseAirPower } from '../../../lib/calc/airPower'
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

describe('defense air power', () => {
  test('雷電 18機 熟練度>> 防空制空 = 114', () => {
    // calcSlotDefenseBasePower floors (aa + intercept + 2*antiBomb) * sqrt(slotCount):
    //   floor((9 + 2 + 2*5) * sqrt(18)) = floor(89.09...) = 89
    // calcSlotDefensePower floors (base + internal) and adds display bonus:
    //   floor(89 + sqrt(120/10)) + 22 = floor(92.46...) + 22 = 114
    const slots = [{ aircraftId: 175, proficiency: 7, stars: 0 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(114)
  })

  test('三式戦 飛燕 18機 熟練度>> 防空制空 includes intercept + anti-bomb', () => {
    // calcSlotDefenseBasePower floors (aa + intercept + 2*antiBomb) * sqrt(slotCount):
    //   floor((12.5 + 3 + 2*1) * sqrt(18)) = floor(74.24...) = 74
    // calcSlotDefensePower floors (base + internal) and adds display bonus:
    //   floor(74 + sqrt(120/10)) + 22 = floor(77.46...) + 22 = 99
    const slots = [{ aircraftId: 176, proficiency: 7, stars: 0 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(99)
  })

  test('雷電 18機 熟練度>> ★10 防空制空 applies improvement bonus', () => {
    // improvement = 0.2 * 10 = 2
    // calcSlotDefenseBasePower: floor((9 + 2 + 2*5 + 2) * sqrt(18)) = floor(97.58...) = 97
    // calcSlotDefensePower: floor(97 + sqrt(120/10)) + 22 = floor(100.46...) + 22 = 122
    const slots = [{ aircraftId: 175, proficiency: 7, stars: 10 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(122)
  })

  test('空槽位 / 无 aircraftId 在防空计算中被跳过', () => {
    const slots = [
      {},
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: null },
    ]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(114)
  })

  test('九六式陸攻 18機 防空制空（非战斗机，intercept=0, anti_bomb=0）', () => {
    // calcSlotDefenseBasePower: floor((1 + 0 + 2*0) * sqrt(18)) = floor(4.24...) = 4
    // calcSlotDefensePower: floor(4 + sqrt(9/10)) + 0 = floor(4.94...) = 4
    const slots = [{ aircraftId: 168 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(4)
  })
})

describe('recon multipliers', () => {
  test('二式陸偵 gives sortie multiplier 1.15', () => {
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 }, // 雷電
      { aircraftId: 311, proficiency: 0, stars: 0 }, // 二式陸偵 LOS 8
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(Math.floor(75 * 1.15))
  })

  test('二式陸偵(熟練) gives sortie multiplier 1.18', () => {
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 312, proficiency: 0, stars: 0 }, // 二式陸偵(熟練) LOS 9
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(Math.floor(75 * 1.18))
  })

  test('大型飛行艇 gives defense multiplier 1.16 for LOS >= 9', () => {
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 138, proficiency: 0, stars: 0 }, // 二式大艇 LOS 12
    ]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(Math.floor(114 * 1.16))
  })
})
