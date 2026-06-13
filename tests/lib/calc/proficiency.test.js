import { getProficiencyData, getInternalProficiencyBonus, getProficiencyAirBonus } from '../../../lib/calc/proficiency'

describe('proficiency', () => {
  test('max fighter display bonus is 22', () => {
    expect(getProficiencyAirBonus(7, true, false)).toBe(22)
  })

  test('max seaplane bomber display bonus is 6', () => {
    expect(getProficiencyAirBonus(7, false, true)).toBe(6)
  })

  test('internal bonus at max proficiency', () => {
    expect(getInternalProficiencyBonus(120)).toBe(3)
  })

  test('max proficiency data lookup', () => {
    expect(getProficiencyData(7)).toMatchObject({
      level: 7,
      internalMax: 120,
      aaBonus: 22,
      seaplaneBomberBonus: 6,
    })
  })
})
