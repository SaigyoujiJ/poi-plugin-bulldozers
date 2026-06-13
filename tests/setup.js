const NAMESPACE = 'poi-plugin-bulldozers'

if (!global.window) {
  global.window = {}
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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
