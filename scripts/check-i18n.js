const fs = require('fs')
const path = require('path')

const LOCALES = ['zh-CN', 'zh-TW', 'ja-JP', 'en-US', 'ko-KR']
const I18N_DIR = path.join(__dirname, '..', 'i18n')

function collectKeys(obj, prefix = '') {
  const keys = new Set()
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      for (const child of collectKeys(value, fullKey)) {
        keys.add(child)
      }
    } else {
      keys.add(fullKey)
    }
  }
  return keys
}

function main() {
  const localeKeys = {}
  for (const locale of LOCALES) {
    const filePath = path.join(I18N_DIR, `${locale}.json`)
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    localeKeys[locale] = collectKeys(content)
  }

  const sourceKeys = localeKeys['zh-CN']
  let failed = false

  for (const locale of LOCALES.slice(1)) {
    const missing = [...sourceKeys].filter((k) => !localeKeys[locale].has(k))
    const extra = [...localeKeys[locale]].filter((k) => !sourceKeys.has(k))
    if (missing.length > 0) {
      console.error(`[${locale}] missing keys:`, missing)
      failed = true
    }
    if (extra.length > 0) {
      console.error(`[${locale}] extra keys:`, extra)
      failed = true
    }
  }

  if (failed) {
    process.exit(1)
  }
  console.log('All i18n files are consistent.')
}

main()
