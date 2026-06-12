const NAMESPACE = '@@poi-plugin-bulldozers/'

export const SWITCH_PRESET = `${NAMESPACE}SWITCH_PRESET`
export const SAVE_PRESET = `${NAMESPACE}SAVE_PRESET`
export const DELETE_PRESET = `${NAMESPACE}DELETE_PRESET`
export const RENAME_PRESET = `${NAMESPACE}RENAME_PRESET`
export const SET_SQUADRON_MODE = `${NAMESPACE}SET_SQUADRON_MODE`
export const SET_SLOT_AIRCRAFT = `${NAMESPACE}SET_SLOT_AIRCRAFT`
export const SET_SLOT_PROFICIENCY = `${NAMESPACE}SET_SLOT_PROFICIENCY`
export const SET_SLOT_STARS = `${NAMESPACE}SET_SLOT_STARS`
export const CLEAR_SLOT = `${NAMESPACE}CLEAR_SLOT`

export const switchPreset = (presetId) => ({
  type: SWITCH_PRESET,
  presetId,
})

export const savePreset = (id, name) => ({
  type: SAVE_PRESET,
  id,
  name,
})

export const deletePreset = (presetId) => ({
  type: DELETE_PRESET,
  presetId,
})

export const renamePreset = (presetId, name) => ({
  type: RENAME_PRESET,
  presetId,
  name,
})

export const setSquadronMode = (presetId, squadronIndex, mode) => ({
  type: SET_SQUADRON_MODE,
  presetId,
  squadronIndex,
  mode,
})

export const setSlotAircraft = (presetId, squadronIndex, slotIndex, aircraftId) => ({
  type: SET_SLOT_AIRCRAFT,
  presetId,
  squadronIndex,
  slotIndex,
  aircraftId,
})

export const setSlotProficiency = (presetId, squadronIndex, slotIndex, proficiency) => ({
  type: SET_SLOT_PROFICIENCY,
  presetId,
  squadronIndex,
  slotIndex,
  proficiency,
})

export const setSlotStars = (presetId, squadronIndex, slotIndex, stars) => ({
  type: SET_SLOT_STARS,
  presetId,
  squadronIndex,
  slotIndex,
  stars,
})

export const clearSlot = (presetId, squadronIndex, slotIndex) => ({
  type: CLEAR_SLOT,
  presetId,
  squadronIndex,
  slotIndex,
})