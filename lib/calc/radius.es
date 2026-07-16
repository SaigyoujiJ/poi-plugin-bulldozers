// 一式戦 隼 series (rotary ASW fighters) do not disable range extension
const HAYABUSA_ROTARY_IDS = new Set([489, 491])
function isNonHayabusaRotary(aircraft, categoryKey) {
  if (categoryKey !== 'rotary_asw') return false
  return !HAYABUSA_ROTARY_IDS.has(aircraft.id)
}

// For LBAS, all equippable recon types extend range: 陸偵 (land_recon),
// 艦偵 (carrier_recon), 水偵 (seaplane_recon), and 大型飛行艇 (flying_boats).
function isRadiusExtendingRecon(aircraft, categoryKey) {
  return categoryKey === 'land_recon' ||
         categoryKey === 'carrier_recon' ||
         categoryKey === 'seaplane_recon' ||
         categoryKey === 'flying_boats'
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
