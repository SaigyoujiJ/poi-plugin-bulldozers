import { selectSquadronResults, selectUsedEquipIds } from '../../redux/selectors'

const preset = {
  squadrons: [
    {
      slots: [
        { aircraftId: 175, equipId: 10 },
        { aircraftId: null, equipId: null },
        { aircraftId: 176, equipId: 11 },
        { aircraftId: 168, equipId: null }, // 图鉴选择的飞机没有实例 id
      ],
    },
    {
      slots: [
        { aircraftId: 25, equipId: 20 },
        { aircraftId: null },
        {},
        {},
      ],
    },
    { slots: [{}, {}, {}, {}] },
  ],
}

describe('selectUsedEquipIds', () => {
  test('collects equipIds across all squadrons of the preset', () => {
    expect([...selectUsedEquipIds(preset)].sort((a, b) => a - b)).toEqual([10, 11, 20])
  })

  test('excludes the slot being edited so its own instance stays selectable', () => {
    expect([...selectUsedEquipIds(preset, { squadronIndex: 0, slotIndex: 0 })].sort((a, b) => a - b)).toEqual([11, 20])
  })

  test('returns an empty set for missing preset', () => {
    expect(selectUsedEquipIds(null).size).toBe(0)
    expect(selectUsedEquipIds(undefined).size).toBe(0)
  })

  test('ignores missing or mismatched inventory instances', () => {
    const available = [
      {
        categoryKey: 'local_fighters',
        aircraft: [{ equipId: 10, aircraftId: 175 }],
      },
      {
        categoryKey: 'land_attackers',
        aircraft: [{ equipId: 11, aircraftId: 999 }],
      },
    ]
    expect([...selectUsedEquipIds(preset, null, available)].sort((a, b) => a - b)).toEqual([10])
  })
})

describe('selectSquadronResults', () => {
  test('重爆防空值合计当前预设中的防空航空队', () => {
    const slots = [
      { aircraftId: 175, proficiency: 7, count: 18 },
      { aircraftId: 352, proficiency: 0, count: 18 },
    ]
    const squadron = { mode: 'defense', slots }
    const results = selectSquadronResults(squadron, [
      { mode: 'sortie', slots },
      squadron,
      squadron,
      squadron,
    ])
    expect(results.defense).toBe(190)
    expect(results.heavyBomberDefense).toBe(684)
  })
})
