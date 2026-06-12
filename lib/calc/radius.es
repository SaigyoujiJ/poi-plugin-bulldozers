export function calcCombatRadius(slots, aircraftData) {
  let minRadius = Infinity
  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft } = aircraftData.lookup(slot.aircraftId)
    if (aircraft.radius === null || aircraft.radius === undefined) continue
    if (aircraft.radius < minRadius) minRadius = aircraft.radius
  }
  return minRadius === Infinity ? 0 : minRadius
}