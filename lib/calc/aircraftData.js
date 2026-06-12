import carrierDiveBombers from '../../assets/data/aircraft/carrier_dive_bombers.json'
import carrierFighters from '../../assets/data/aircraft/carrier_fighters.json'
import carrierTorpedoBombers from '../../assets/data/aircraft/carrier_torpedo_bombers.json'
import jetAircraft from '../../assets/data/aircraft/jet_aircraft.json'
import landAttackers from '../../assets/data/aircraft/land_attackers.json'
import landRecon from '../../assets/data/aircraft/land_recon.json'
import localFighters from '../../assets/data/aircraft/local_fighters.json'
import reconFlyingBoats from '../../assets/data/aircraft/recon_flying_boats.json'
import rotaryAsw from '../../assets/data/aircraft/rotary_asw.json'
import seaplanes from '../../assets/data/aircraft/seaplanes.json'
import indexData from '../../assets/data/aircraft/index.json'

const CATEGORY_DATA = {
  land_attackers: landAttackers,
  local_fighters: localFighters,
  land_recon: landRecon,
  carrier_fighters: carrierFighters,
  carrier_torpedo_bombers: carrierTorpedoBombers,
  carrier_dive_bombers: carrierDiveBombers,
  jet_aircraft: jetAircraft,
  seaplanes: seaplanes,
  rotary_asw: rotaryAsw,
  recon_flying_boats: reconFlyingBoats,
}

const lookupMap = new Map()
for (const [categoryKey, aircraftList] of Object.entries(CATEGORY_DATA)) {
  for (const aircraft of aircraftList) {
    lookupMap.set(aircraft.id, { aircraft, categoryKey })
  }
}

export function lookupAircraft(id) {
  return lookupMap.get(id) ?? null
}

export function getCategoryList() {
  return Object.entries(CATEGORY_DATA).map(([key, aircraft]) => ({
    key,
    display: indexData[key]?.display ?? key,
    aircraft,
  }))
}

export function getIndexData() {
  return indexData
}

export { CATEGORY_DATA }