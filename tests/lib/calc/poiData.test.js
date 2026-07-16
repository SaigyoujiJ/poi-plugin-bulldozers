import { CATEGORY_ORDER, CATEGORY_GROUPS } from '../../../lib/calc/poiData'

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
