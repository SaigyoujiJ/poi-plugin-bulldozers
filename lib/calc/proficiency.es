export const PROFICIENCY = [
  { level: 0, internalMax: 9,   aaBonus: 0,  seaplaneBomberBonus: 0 },
  { level: 1, internalMax: 24,  aaBonus: 0,  seaplaneBomberBonus: 0 },
  { level: 2, internalMax: 39,  aaBonus: 2,  seaplaneBomberBonus: 1 },
  { level: 3, internalMax: 54,  aaBonus: 5,  seaplaneBomberBonus: 1 },
  { level: 4, internalMax: 69,  aaBonus: 9,  seaplaneBomberBonus: 1 },
  { level: 5, internalMax: 84,  aaBonus: 14, seaplaneBomberBonus: 3 },
  { level: 6, internalMax: 99,  aaBonus: 14, seaplaneBomberBonus: 3 },
  { level: 7, internalMax: 120, aaBonus: 22, seaplaneBomberBonus: 6 },
]

export function getProficiencyData(level) {
  return PROFICIENCY[level] ?? null
}

export function getInternalProficiencyBonus(internalMax) {
  return Math.sqrt(internalMax / 10)
}

export function getProficiencyAirBonus(level, isFighter, isSeaplaneBomber) {
  const data = PROFICIENCY[level]
  if (!data) return 0
  if (isFighter) return data.aaBonus
  if (isSeaplaneBomber) return data.seaplaneBomberBonus
  return 0
}