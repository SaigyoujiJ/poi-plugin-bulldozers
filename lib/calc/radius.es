// 一式戦 隼 series (rotary ASW fighters) do not disable range extension
const HAYABUSA_ROTARY_IDS = new Set([489, 491])
// 大型飛行艇 IDs
const FLYING_BOAT_IDS = new Set([138, 178])

function isNonHayabusaRotary(aircraft, categoryKey) {
  if (categoryKey !== 'rotary_asw') return false
  return !HAYABUSA_ROTARY_IDS.has(aircraft.id)
}

// For LBAS, only 陸偵 (land_recon) and 大型飛行艇 (large flying boats)
// extend range. Carrier recon (艦偵) and seaplane recon (水偵) are stored in
// recon_flying_boats.json but are not equippable to LBAS for range extension.
function isRadiusExtendingRecon(aircraft, categoryKey) {
  if (categoryKey === 'land_recon') return true
  if (categoryKey === 'recon_flying_boats' && FLYING_BOAT_IDS.has(aircraft.id)) return true
  return false
}

export function calcCombatRadius(slots, aircraftData) {
  let minRadius = Infinity
  let maxReconRadius = -Infinity
  let extensionDisabled = false

  for (const slot of slots) {
    if (!slot.aircraftId) continue
    const { aircraft, categoryKey } = aircraftData.lookup(slot.aircraftId)
    if (aircraft.radius == null) continue

    if (aircraft.radius < minRadius) {
      minRadius = aircraft.radius
    }

    if (isRadiusExtendingRecon(aircraft, categoryKey) && aircraft.radius > maxReconRadius) {
      maxReconRadius = aircraft.radius
    }

    if (isNonHayabusaRotary(aircraft, categoryKey)) {
      extensionDisabled = true
    }
  }

  if (minRadius === Infinity) return 0
  if (extensionDisabled || maxReconRadius <= minRadius) return minRadius

  const extension = Math.min(3, Math.round(Math.sqrt(maxReconRadius - minRadius)))
  return minRadius + extension
}
