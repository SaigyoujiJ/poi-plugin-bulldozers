// api_type[2] -> plugin categoryKey
const TYPE2_TO_CATEGORY = {
  47: 'land_attackers',
  53: 'land_attackers',
  48: 'local_fighters',
  49: 'land_recon',
  6: 'carrier_fighters',
  8: 'carrier_torpedo_bombers',
  7: 'carrier_dive_bombers',
  9: 'carrier_recon',
  56: 'jet_aircraft',
  57: 'jet_aircraft',
  58: 'jet_aircraft',
  10: 'seaplane_recon',
  11: 'seaplane_bombers',
  45: 'seaplane_fighters',
  25: 'rotary_asw',
  26: 'rotary_asw',
  41: 'flying_boats',
}

const CATEGORY_ORDER = [
  'land_attackers',
  'local_fighters',
  'land_recon',
  'carrier_fighters',
  'carrier_torpedo_bombers',
  'carrier_dive_bombers',
  'carrier_recon',
  'jet_aircraft',
  'seaplane_recon',
  'seaplane_bombers',
  'seaplane_fighters',
  'rotary_asw',
  'flying_boats',
]

const CATEGORY_DISPLAY = {
  land_attackers: 'AircraftCategory.LandAttackers',
  local_fighters: 'AircraftCategory.LocalFighters',
  land_recon: 'AircraftCategory.LandRecon',
  carrier_fighters: 'AircraftCategory.CarrierFighters',
  carrier_torpedo_bombers: 'AircraftCategory.CarrierTorpedoBombers',
  carrier_dive_bombers: 'AircraftCategory.CarrierDiveBombers',
  carrier_recon: 'AircraftCategory.CarrierRecon',
  jet_aircraft: 'AircraftCategory.JetAircraft',
  seaplane_recon: 'AircraftCategory.SeaplaneRecon',
  seaplane_bombers: 'AircraftCategory.SeaplaneBombers',
  seaplane_fighters: 'AircraftCategory.SeaplaneFighters',
  rotary_asw: 'AircraftCategory.RotaryASW',
  flying_boats: 'AircraftCategory.FlyingBoats',
}

// 一级分组：组内分类按 tab 显示顺序排列；喷气式只有一类，不显示二级菜单
const CATEGORY_GROUPS = [
  { key: 'land', display: 'AircraftGroup.Land', categories: ['land_attackers', 'local_fighters', 'land_recon', 'rotary_asw', 'flying_boats'] },
  { key: 'carrier', display: 'AircraftGroup.Carrier', categories: ['carrier_fighters', 'carrier_torpedo_bombers', 'carrier_dive_bombers', 'carrier_recon'] },
  { key: 'seaplane', display: 'AircraftGroup.Seaplane', categories: ['seaplane_recon', 'seaplane_bombers', 'seaplane_fighters'] },
  { key: 'jet', display: 'AircraftGroup.Jet', categories: ['jet_aircraft'] },
]

// 选机列表参数行：每类展示的原始参数（值为 null/0 的不显示）
const CATEGORY_STATS = {
  land_attackers: ['aa', 'torpedo', 'bombing', 'radius'],
  local_fighters: ['aa', 'interception', 'anti_bomb'],
  land_recon: ['aa', 'los', 'radius'],
  carrier_fighters: ['aa', 'interception', 'anti_bomb'],
  carrier_torpedo_bombers: ['aa', 'torpedo', 'bombing', 'radius'],
  carrier_dive_bombers: ['aa', 'torpedo', 'bombing', 'radius'],
  carrier_recon: ['aa', 'los', 'radius'],
  jet_aircraft: ['aa', 'bombing', 'radius'],
  seaplane_recon: ['aa', 'los', 'radius'],
  seaplane_bombers: ['aa', 'torpedo', 'bombing', 'radius'],
  seaplane_fighters: ['aa', 'interception', 'anti_bomb'],
  rotary_asw: ['aa', 'asw', 'radius'],
  flying_boats: ['aa', 'los', 'asw', 'radius'],
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

export { CATEGORY_ORDER, CATEGORY_DISPLAY, CATEGORY_GROUPS, CATEGORY_STATS }
