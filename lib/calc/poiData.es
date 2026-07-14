// api_type[2] -> plugin categoryKey
const TYPE2_TO_CATEGORY = {
  47: 'land_attackers',
  53: 'land_attackers',
  48: 'local_fighters',
  49: 'land_recon',
  6: 'carrier_fighters',
  8: 'carrier_torpedo_bombers',
  7: 'carrier_dive_bombers',
  56: 'jet_aircraft',
  57: 'jet_aircraft',
  58: 'jet_aircraft',
  11: 'seaplanes',
  45: 'seaplanes',
  25: 'rotary_asw',
  26: 'rotary_asw',
  9: 'recon_flying_boats',
  10: 'recon_flying_boats',
  41: 'recon_flying_boats',
}

const CATEGORY_ORDER = [
  'land_attackers',
  'local_fighters',
  'land_recon',
  'carrier_fighters',
  'carrier_torpedo_bombers',
  'carrier_dive_bombers',
  'jet_aircraft',
  'seaplanes',
  'rotary_asw',
  'recon_flying_boats',
]

const CATEGORY_DISPLAY = {
  land_attackers: 'AircraftCategory.LandAttackers',
  local_fighters: 'AircraftCategory.LocalFighters',
  land_recon: 'AircraftCategory.LandRecon',
  carrier_fighters: 'AircraftCategory.CarrierFighters',
  carrier_torpedo_bombers: 'AircraftCategory.CarrierTorpedoBombers',
  carrier_dive_bombers: 'AircraftCategory.CarrierDiveBombers',
  jet_aircraft: 'AircraftCategory.JetAircraft',
  seaplanes: 'AircraftCategory.Seaplanes',
  rotary_asw: 'AircraftCategory.RotaryASW',
  recon_flying_boats: 'AircraftCategory.ReconFlyingBoats',
}

const LOCAL_FIGHTER_TYPE = 48

function numOrNil(v) {
  if (v == null) return null
  return v
}

function mapEquip(apiEquip) {
  const type2 = apiEquip.api_type[2]
  const isLocalFighter = type2 === LOCAL_FIGHTER_TYPE
  const tyku = apiEquip.api_tyku ?? 0
  const houk = apiEquip.api_houk ?? 0
  const houm = apiEquip.api_houm ?? 0

  const aaSortie = isLocalFighter ? tyku + 1.5 * houk : tyku
  const aaDefense = isLocalFighter ? tyku + houk + 2 * houm : tyku

  return {
    id: apiEquip.api_id,
    name: apiEquip.api_name,
    firepower: numOrNil(apiEquip.api_houg) || null,
    torpedo: numOrNil(apiEquip.api_raig) || null,
    bombing: numOrNil(apiEquip.api_baku) || null,
    aa: tyku,
    aa_sortie: aaSortie,
    aa_air_defense: aaDefense,
    asw: numOrNil(apiEquip.api_tais) || null,
    los: numOrNil(apiEquip.api_saku) || null,
    anti_bomb: houm || null,
    interception: houk || null,
    accuracy: null,
    evasion: null,
    range: numOrNil(apiEquip.api_leng) || null,
    radius: numOrNil(apiEquip.api_distance),
    deployment_cost: numOrNil(apiEquip.api_cost),
    bauxite_per_slot: apiEquip.api_cost != null ? apiEquip.api_cost * 18 : null,
    armor: numOrNil(apiEquip.api_souk) || null,
  }
}

export function buildAircraftData($equips) {
  const lookupMap = new Map()
  const categoryData = {}

  for (const cat of CATEGORY_ORDER) {
    categoryData[cat] = []
  }

  if (!$equips) {
    return { lookupMap, categoryData, categoryList: [] }
  }

  for (const apiEquip of Object.values($equips)) {
    if (!apiEquip || !apiEquip.api_type) continue
    if (!apiEquip.api_sortno) continue

    const type2 = apiEquip.api_type[2]
    const categoryKey = TYPE2_TO_CATEGORY[type2]
    if (!categoryKey) continue

    const aircraft = mapEquip(apiEquip)
    lookupMap.set(aircraft.id, { aircraft, categoryKey })
    categoryData[categoryKey].push(aircraft)
  }

  for (const cat of CATEGORY_ORDER) {
    categoryData[cat].sort((a, b) => a.id - b.id)
  }

  const categoryList = CATEGORY_ORDER.map((key) => ({
    key,
    display: CATEGORY_DISPLAY[key],
    aircraft: categoryData[key],
  }))

  return { lookupMap, categoryData, categoryList }
}

export { CATEGORY_ORDER, CATEGORY_DISPLAY }
