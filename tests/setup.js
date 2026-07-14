const NAMESPACE = 'poi-plugin-bulldozers'

if (!global.window) {
  global.window = {}
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Mock poi's window.getStore with fixture api_start2 data
const start2 = require('./fixtures/api_start2.json')
const $equips = {}
for (const e of start2.api_mst_slotitem) {
  $equips[e.api_id] = e
}

window.getStore = (path) => {
  if (path === 'const.$equips') return $equips
  return undefined
}

window.i18n = {
  [NAMESPACE]: {
    __(key, vars = {}) {
      let text = String(key)
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp(escapeRegExp(`{{${k}}}`), 'g'), String(v))
      }
      return text
    },
  },
}
