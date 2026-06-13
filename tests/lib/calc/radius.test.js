import { calcCombatRadius } from '../../../lib/calc/radius'
import { aircraftLookup } from '../../../lib/calc/aircraftData'

describe('radius', () => {
  test('radius without recon is minimum radius', () => {
    const slots = [
      { aircraftId: 168, proficiency: 0, stars: 0 }, // 九六式陸攻 radius 8
      { aircraftId: 175, proficiency: 0, stars: 0 }, // 雷電 radius 2
    ]
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(2)
  })

  test('radius extends with large flying boat', () => {
    const slots = [
      { aircraftId: 168, proficiency: 0, stars: 0 }, // radius 8
      { aircraftId: 138, proficiency: 0, stars: 0 }, // 二式大艇 radius 20
    ]
    // extension = round(sqrt(20 - 8)) = round(3.464) = 3, capped at +3
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(11)
  })

  test('radius extension capped at +3', () => {
    const slots = [
      { aircraftId: 168, proficiency: 0, stars: 0 }, // radius 8
      { aircraftId: 138, proficiency: 0, stars: 0 }, // radius 20
      { aircraftId: 178, proficiency: 0, stars: 0 }, // PBY-5A radius 10
    ]
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(11)
  })

  test('non-Hayabusa rotary disables extension', () => {
    const baseSlots = [
      { aircraftId: 175, proficiency: 0, stars: 0 }, // 雷電 radius 2
      { aircraftId: 138, proficiency: 0, stars: 0 }, // 二式大艇 radius 20
    ]
    // without rotary: min=2, extension=round(sqrt(18))=4 capped to 3 -> 5
    expect(calcCombatRadius(baseSlots, aircraftLookup)).toBe(5)

    const withRotary = [
      ...baseSlots,
      { aircraftId: 69, proficiency: 0, stars: 0 }, // カ号観測機 radius 1
    ]
    // with non-Hayabusa rotary: extension disabled, min becomes 1
    expect(calcCombatRadius(withRotary, aircraftLookup)).toBe(1)
  })

  test('radius extends with land recon', () => {
    const slots = [
      { aircraftId: 168, proficiency: 0, stars: 0 }, // 九六式陸攻 radius 8
      { aircraftId: 311, proficiency: 0, stars: 0 }, // 二式陸偵 radius 8
    ]
    // same radius, no extension
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(8)
  })

  test('radius extends when land recon has larger radius', () => {
    const slots = [
      { aircraftId: 175, proficiency: 0, stars: 0 }, // 雷電 radius 2
      { aircraftId: 311, proficiency: 0, stars: 0 }, // 二式陸偵 radius 8
    ]
    // extension = round(sqrt(8 - 2)) = round(2.449) = 2
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(4)
  })

  test('empty and all-null slots return 0', () => {
    expect(calcCombatRadius([], aircraftLookup)).toBe(0)
    expect(calcCombatRadius(
      [{ proficiency: 0, stars: 0 }, { aircraftId: null, proficiency: 0, stars: 0 }],
      aircraftLookup
    )).toBe(0)
  })

  test('Hayabusa rotary aircraft does not disable extension', () => {
    const slots = [
      { aircraftId: 175, proficiency: 0, stars: 0 }, // 雷電 radius 2
      { aircraftId: 138, proficiency: 0, stars: 0 }, // 二式大艇 radius 20
      { aircraftId: 489, proficiency: 0, stars: 0 }, // 一式戦 隼II型改(20戦隊)
    ]
    // extension = round(sqrt(20 - 2)) = round(4.243) = 4 capped to 3
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(5)
  })

  test('recon with radius equal to min radius does not extend', () => {
    const slots = [
      { aircraftId: 168, proficiency: 0, stars: 0 }, // 九六式陸攻 radius 8
      { aircraftId: 311, proficiency: 0, stars: 0 }, // 二式陸偵 radius 8
    ]
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(8)
  })

  test('carrier recon does not extend range', () => {
    const slots = [
      { aircraftId: 175, proficiency: 0, stars: 0 }, // 雷電 radius 2
      { aircraftId: 54, proficiency: 0, stars: 0 }, // 彩雲 radius 8
    ]
    expect(calcCombatRadius(slots, aircraftLookup)).toBe(2)
  })
})
