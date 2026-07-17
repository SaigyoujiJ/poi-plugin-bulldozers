import React, { Component } from 'react'
import {
  getCategoryData,
  getSlotitemIconId,
  getCategoryStats,
  lookupAircraft,
  aircraftLookup,
} from '../../lib/calc/aircraftData'
import { calcSortieAirPower, calcDefenseAirPower } from '../../lib/calc/airPower'
import { isFighterType } from '../../lib/calc/planeType'
import { getModeColor } from '../../lib/ui/themeColors'
import ProficiencyIcon from '../components/ProficiencyIcon'
import SlotitemIcon from '../components/SlotitemIcon'

const { __ } = window.i18n['poi-plugin-bulldozers']

const STAT_LABEL_KEYS = {
  aa: 'Stat.AA',
  interception: 'Stat.Interception',
  anti_bomb: 'Stat.AntiBomb',
  torpedo: 'Stat.Torpedo',
  bombing: 'Stat.Bombing',
  los: 'Stat.LoS',
  asw: 'Stat.ASW',
  radius: 'Stat.Radius',
}

// 参数行文本：按分类配置取原始参数，null/0 不显示
function formatAircraftStats(aircraft, categoryKey) {
  return getCategoryStats(categoryKey)
    .map((key) => ({ key, value: aircraft[key] }))
    .filter(({ value }) => value != null && value > 0)
    .map(({ key, value }) => `${__(STAT_LABEL_KEYS[key])}${value}`)
    .join(' ')
}

class PlaneList extends Component {
  // 我的陆航：战斗机按当前航空队模式显示该机的等效制空（含 ★ 与熟练度）
  equivalentAirPowerNode(ac, planeInfo, mode) {
    if (!planeInfo || !isFighterType(planeInfo.aircraft, planeInfo.categoryKey)) return null
    const slots = [{ aircraftId: ac.aircraftId, stars: ac.stars ?? 0, proficiency: ac.proficiency ?? 0 }]
    const value = mode === 'defense'
      ? calcDefenseAirPower(slots, aircraftLookup)
      : calcSortieAirPower(slots, aircraftLookup)
    return (
      <span style={{ color: getModeColor(mode).accent, fontWeight: 600, marginLeft: 8 }}>
        {`${__('Stat.AirPower')}${value}`}
      </span>
    )
  }

  render() {
    const { categoryKey, aircraftList, onSelect, mode } = this.props
    const list = aircraftList || getCategoryData()[categoryKey] || []
    const isInventory = aircraftList && list.length > 0 && list[0].stars != null

    return (
      <div style={{ maxHeight: 200, overflowY: 'auto', cursor: 'default' }}>
        {list.map((ac) => {
          const key = isInventory
            ? `${ac.aircraftId}-${ac.stars}-${ac.proficiency}`
            : (ac.id ?? ac.aircraftId)
          const planeInfo = isInventory ? lookupAircraft(ac.aircraftId) : null
          const aircraft = isInventory ? planeInfo?.aircraft : ac
          const catKey = isInventory ? planeInfo?.categoryKey : categoryKey
          const statText = aircraft && catKey ? formatAircraftStats(aircraft, catKey) : ''
          const equivNode = isInventory ? this.equivalentAirPowerNode(ac, planeInfo, mode) : null

          return (
            <div
              key={key}
              className="bulldozer-plane-item"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(
                  isInventory
                    ? { aircraftId: ac.aircraftId, stars: ac.stars, proficiency: ac.proficiency }
                    : (ac.id ?? ac.aircraftId)
                )
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px',
                cursor: 'pointer',
                borderRadius: 'var(--bulldozer-radius-sm, 4px)',
                marginBottom: 3,
                color: 'var(--bulldozer-text-primary, #1c2127)',
              }}
            >
              <SlotitemIcon iconId={getSlotitemIconId(ac.id ?? ac.aircraftId)} />
              <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                <div>{ac.name}</div>
                {(statText || equivNode) && (
                  <div style={{ fontSize: 12, color: 'var(--bulldozer-text-secondary, #5f6b7a)' }}>
                    {statText}
                    {equivNode}
                  </div>
                )}
              </div>
              {isInventory && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                  cursor: 'pointer',
                }}>
                  {ac.stars > 0 && (
                    <span style={{ color: '#f5a623' }}>★{ac.stars}</span>
                  )}
                  <ProficiencyIcon level={ac.proficiency} />
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

export default PlaneList
