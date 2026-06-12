export const PROFICIENCY = [
  { level: 0, label: '无', internalMax: 9,   aaBonus: 0,  seaplaneBomberBonus: 0 },
  { level: 1, label: '|',  internalMax: 24,  aaBonus: 0,  seaplaneBomberBonus: 0 },
  { level: 2, label: '||', internalMax: 39,  aaBonus: 2,  seaplaneBomberBonus: 1 },
  { level: 3, label: '|||', internalMax: 54,  aaBonus: 5,  seaplaneBomberBonus: 1 },
  { level: 4, label: '/',  internalMax: 69,  aaBonus: 9,  seaplaneBomberBonus: 1 },
  { level: 5, label: '//', internalMax: 84,  aaBonus: 14, seaplaneBomberBonus: 3 },
  { level: 6, label: '///', internalMax: 99,  aaBonus: 14, seaplaneBomberBonus: 3 },
  { level: 7, label: '>>', internalMax: 120, aaBonus: 22, seaplaneBomberBonus: 6 },
]

export function getProficiencyData(level) {
  return PROFICIENCY[level] ?? null
}

export function getInternalProficiencyBonus(internalMax) {
  return Math.floor(Math.sqrt(internalMax / 10))
}

export function getProficiencyAirBonus(level, isFighter, isSeaplaneBomber) {
  const data = PROFICIENCY[level]
  if (!data) return 0
  if (isFighter) return data.aaBonus
  if (isSeaplaneBomber) return data.seaplaneBomberBonus
  return 0
}