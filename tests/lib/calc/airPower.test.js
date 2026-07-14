import { calcSortieAirPower, calcDefenseAirPower, calcLandAttackerStrikePower } from '../../../lib/calc/airPower'
import { aircraftLookup } from '../../../lib/calc/aircraftData'

describe('sortie air power', () => {
  test('雷電 18機 熟練度>> 出击制空 = 63', () => {
    // slot power = floor(aa_sortie * sqrt(18) + sqrt(120/10)) + 22(display)
    //            = floor(9 * sqrt(18) + sqrt(12)) + 22 = 63
    const slots = [{ aircraftId: 175, proficiency: 7, stars: 0 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(63)
  })

  test('三式戦 飛燕 18機 熟練度>> 出击制空 = 78', () => {
    // slot power = floor(12.5 * sqrt(18) + sqrt(12)) + 22 = 78
    const slots = [{ aircraftId: 176, proficiency: 7, stars: 0 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(78)
  })

  test('三式戦 飛燕 18機 熟練度>> ★10 出击制空 = 86', () => {
    // improvement = 0.2 * 10 = 2
    // slot power = floor((12.5 + 2) * sqrt(18) + sqrt(12)) + 22 = 86
    const slots = [{ aircraftId: 176, proficiency: 7, stars: 10 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(86)
  })

  test('九六式陸攻 18機 出击制空（aa_sortie = 1）', () => {
    // slot power = floor(1 * sqrt(18)) + floor(sqrt(9/10)) + 0(display) = 4
    const slots = [{ aircraftId: 168 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(4)
  })

  test('多槽位求和', () => {
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 176, proficiency: 7, stars: 0 },
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(63 + 78)
  })

  test('空槽位 / 无 aircraftId 被跳过', () => {
    const slots = [
      {},
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: null },
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(63)
  })
})

describe('defense air power', () => {
  test('雷電 18機 熟練度>> 防空制空 = 101', () => {
    // slot power = floor(aa_air_defense * sqrt(18) + sqrt(12)) + 22
    //            = floor(18 * sqrt(18) + sqrt(12)) + 22 = 101
    const slots = [{ aircraftId: 175, proficiency: 7, stars: 0 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(101)
  })

  test('三式戦 飛燕 18機 熟練度>> 防空制空 = 80', () => {
    // slot power = floor(13 * sqrt(18) + sqrt(12)) + 22 = 80
    const slots = [{ aircraftId: 176, proficiency: 7, stars: 0 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(80)
  })

  test('雷電 18機 熟練度>> ★10 防空制空 applies improvement bonus = 109', () => {
    // improvement = 0.2 * 10 = 2
    // slot power = floor((18 + 2) * sqrt(18)) + floor(sqrt(12)) + 22 = 109
    const slots = [{ aircraftId: 175, proficiency: 7, stars: 10 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(109)
  })

  test('空槽位 / 无 aircraftId 在防空计算中被跳过', () => {
    const slots = [
      {},
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: null },
    ]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(101)
  })

  test('九六式陸攻 18機 防空制空（aa_air_defense = 1）', () => {
    // slot power = floor(1 * sqrt(18)) + floor(sqrt(9/10)) + 0 = 4
    const slots = [{ aircraftId: 168 }]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(4)
  })
})

describe('recon multipliers', () => {
  test('二式陸偵 contributes its own AA and gives sortie multiplier 1.15', () => {
    // 二式陸偵 aa_sortie=3, slot=4, prof=0 => slot power = floor(3 * sqrt(4) + sqrt(9/10)) = 6
    // total = floor((63 + 6) * 1.15) = 79
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 }, // 雷電
      { aircraftId: 311, proficiency: 0, stars: 0 }, // 二式陸偵 LOS 8
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(79)
  })

  test('二式陸偵(熟練) contributes its own AA and gives sortie multiplier 1.18', () => {
    // total = floor((63 + 6) * 1.18) = 81
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 312, proficiency: 0, stars: 0 }, // 二式陸偵(熟練) LOS 9
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(81)
  })

  test('大型飛行艇 gives defense multiplier 1.16 for LOS >= 9', () => {
    // 二式大艇 aa_air_defense=null, slot=4 => contributes 0
    // total = floor((101 + 0) * 1.16) = 117
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 138, proficiency: 0, stars: 0 }, // 二式大艇 LOS 12
    ]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(117)
  })

  test('multiple recon planes use the highest multiplier', () => {
    // 二式陸偵 LOS 8 => 1.15, 二式陸偵(熟練) LOS 9 => 1.18, highest = 1.18
    // each contributes 6, total = floor((63 + 6 + 6) * 1.18) = 88
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 311, proficiency: 0, stars: 0 },
      { aircraftId: 312, proficiency: 0, stars: 0 },
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(88)
  })

  test('carrier recon LOS <= 7 gives defense multiplier 1.20', () => {
    // 二式艦上偵察機 id 61: aa_air_defense=1, los=7, slot=4, prof=0
    // slot power = floor(1 * sqrt(4) + sqrt(9/10)) = 2
    // total = floor((101 + 2) * 1.20) = 123
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 61, proficiency: 0, stars: 0 },
    ]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(123)
  })

  test('seaplane bomber from seaplanes category does not get defense recon multiplier', () => {
    // 瑞雲 id 26: aa_air_defense=2, los=6, category seaplanes, slot=18, prof=0
    // slot power = floor(2 * sqrt(18)) + floor(sqrt(9/10)) = 8
    // seaplanes are not recon, so multiplier stays 1
    // total = floor((101 + 8) * 1) = 109
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 26, proficiency: 0, stars: 0 },
    ]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(109)
  })

  test('seaplane recon from recon_flying_boats gets water recon defense multiplier 1.10', () => {
    // 零式水上偵察機 id 25: aa_air_defense=1, los=5, category recon_flying_boats, slot=4, prof=0
    // slot power = floor(1 * sqrt(4)) + floor(sqrt(9/10)) = 2
    // los <= 7 gives water recon multiplier 1.10
    // total = floor((101 + 2) * 1.10) = 113
    const slots = [
      { aircraftId: 175, proficiency: 7, stars: 0 },
      { aircraftId: 25, proficiency: 0, stars: 0 },
    ]
    expect(calcDefenseAirPower(slots, aircraftLookup)).toBe(113)
  })
})

describe('improvement bonus', () => {
  test('fighter improvement 0.2 per star is multiplied inside sqrt', () => {
    // 三式戦 飛燕 aa_sortie=12.5, stars=10 -> +2 fighter improvement
    // slot power = floor((12.5 + 2) * sqrt(18) + sqrt(12)) + 22 = 86
    const slots = [{ aircraftId: 176, proficiency: 7, stars: 10 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(86)
  })

  test('fighter-bomber improvement 0.25 per star', () => {
    // 橘花改 aa_sortie=12, stars=10 -> +2.5 fighter-bomber improvement
    // floor((12 + 2.5) * sqrt(18)) + floor(sqrt(9/10)) + 0 = 61
    const slots = [{ aircraftId: 200, proficiency: 0, stars: 10 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(61)
  })

  test('land attacker improvement 0.5 * sqrt(stars)', () => {
    // 九六式陸攻 aa_sortie=1, stars=9 -> +1.5 land attacker improvement
    // floor((1 + 1.5) * sqrt(18)) + floor(sqrt(9/10)) + 0 = 10
    const slots = [{ aircraftId: 168, proficiency: 0, stars: 9 }]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(10)
  })
})

describe('kc-web alignment', () => {
  test('一式戦 隼II型(64戦隊) + 3x 秋水 满熟练出击制空 = 214', () => {
    // kc-web: 103 | 37 | 37 | 37
    const slots = [
      { aircraftId: 225, proficiency: 7, stars: 0 },
      { aircraftId: 352, proficiency: 7, stars: 0 },
      { aircraftId: 352, proficiency: 7, stars: 0 },
      { aircraftId: 352, proficiency: 7, stars: 0 },
    ]
    expect(calcSortieAirPower(slots, aircraftLookup)).toBe(214)
  })
})

describe('land attacker strike power', () => {
  test('九六式陸攻 18機 熟練度0 陆攻开幕 = 43', () => {
    // floor(10 * sqrt(18) + sqrt(9/10)) = 43
    const slots = [{ aircraftId: 168, proficiency: 0 }]
    expect(calcLandAttackerStrikePower(slots, aircraftLookup)).toBe(43)
  })

  test('九六式陸攻 18機 熟練度>> 陆攻开幕 = 45', () => {
    // floor(10 * sqrt(18) + sqrt(120/10)) = 45
    const slots = [{ aircraftId: 168, proficiency: 7 }]
    expect(calcLandAttackerStrikePower(slots, aircraftLookup)).toBe(45)
  })

  test('九六式陸攻 with no bombing returns 0', () => {
    const noBombingLookup = {
      lookup: () => ({
        aircraft: { id: 168, name: '九六式陸攻', bombing: 0 },
        categoryKey: 'land_attackers',
      }),
    }
    const slots = [{ aircraftId: 168 }]
    expect(calcLandAttackerStrikePower(slots, noBombingLookup)).toBe(0)
  })

  test('Empty slot is skipped', () => {
    const slots = [
      {},
      { aircraftId: 168, proficiency: 0 },
      { aircraftId: null },
    ]
    expect(calcLandAttackerStrikePower(slots, aircraftLookup)).toBe(43)
  })
})
