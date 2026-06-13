import {
  getSlotCount,
  isFighterType,
  isSeaplaneBomber,
  isReconType,
  isFighterBomber,
  getImprovementBonus,
} from '../../../lib/calc/planeType'

describe('planeType', () => {
  test('seaplane bomber slot count is 18 in LBAS', () => {
    const aircraft = { id: 1, torpedo: 2, bombing: 3 }
    expect(getSlotCount(aircraft, 'seaplanes')).toBe(18)
  })

  test('seaplane fighter slot count is 18', () => {
    const aircraft = { id: 2, torpedo: null, bombing: null }
    expect(getSlotCount(aircraft, 'seaplanes')).toBe(18)
  })

  test('land recon slot count is 4', () => {
    const aircraft = { id: 311 }
    expect(getSlotCount(aircraft, 'land_recon')).toBe(4)
  })

  test('heavy land attacker slot count is 9', () => {
    const aircraft = { id: 395 }
    expect(getSlotCount(aircraft, 'land_attackers')).toBe(9)
  })

  test('normal land attacker slot count is 18', () => {
    const aircraft = { id: 168 }
    expect(getSlotCount(aircraft, 'land_attackers')).toBe(18)
  })

  test('jet fighter is fighter type', () => {
    const aircraft = { id: 548, aa: 17, bombing: null, torpedo: null }
    expect(isFighterType(aircraft, 'jet_aircraft')).toBe(true)
  })

  test('jet fighter-bomber is not fighter type but is fighter bomber', () => {
    const aircraft = { id: 199, aa: 6, bombing: 15, torpedo: null }
    expect(isFighterType(aircraft, 'jet_aircraft')).toBe(false)
    expect(isFighterBomber(aircraft, 'jet_aircraft')).toBe(true)
  })

  test('liaison fighter with bombing is fighter-bomber', () => {
    const aircraft = { id: 489, aa: 6, bombing: 4, torpedo: null }
    expect(isFighterType(aircraft, 'rotary_asw')).toBe(true)
    expect(isFighterBomber(aircraft, 'rotary_asw')).toBe(true)
  })

  test('pure ASW rotary is not fighter', () => {
    const aircraft = { id: 69, aa: null, bombing: null, torpedo: null }
    expect(isFighterType(aircraft, 'rotary_asw')).toBe(false)
    expect(isFighterBomber(aircraft, 'rotary_asw')).toBe(false)
  })

  test('improvement bonus for fighter is 0.2 * stars', () => {
    const aircraft = { id: 176, aa: 12.5, bombing: null, torpedo: null }
    expect(getImprovementBonus(aircraft, 'local_fighters', 10)).toBe(2)
  })

  test('improvement bonus for fighter-bomber is 0.25 * stars', () => {
    const aircraft = { id: 199, aa: 6, bombing: 15, torpedo: null }
    expect(getImprovementBonus(aircraft, 'jet_aircraft', 10)).toBe(2.5)
  })

  test('improvement bonus for land attacker is 0.5 * sqrt(stars)', () => {
    const aircraft = { id: 168, aa: 1, bombing: 10, torpedo: 8 }
    expect(getImprovementBonus(aircraft, 'land_attackers', 9)).toBe(1.5)
  })

  test('land recon is recon type', () => {
    expect(isReconType('land_recon')).toBe(true)
  })

  test('local fighters are not recon type', () => {
    expect(isReconType('local_fighters')).toBe(false)
  })

  test('improvement bonus is 0 for zero stars', () => {
    const aircraft = { id: 176, aa: 12, bombing: null, torpedo: null }
    expect(getImprovementBonus(aircraft, 'local_fighters', 0)).toBe(0)
  })

  test('improvement bonus is 0 for non-fighter non-land-attacker', () => {
    const aircraft = { id: 311 }
    expect(getImprovementBonus(aircraft, 'land_recon', 10)).toBe(0)
  })

  test('slot count defaults to 18 for unknown category', () => {
    const aircraft = { id: 1 }
    expect(getSlotCount(aircraft, 'unknown_category')).toBe(18)
  })

  test('jet aircraft with no anti-air is not fighter type', () => {
    const aircraft = { id: 561, aa: 0, bombing: null, torpedo: null }
    expect(isFighterType(aircraft, 'jet_aircraft')).toBe(false)
  })
})
