const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf-8')

const requiredTokens = [
  '--bulldozer-bg-hover: rgba',
  '--bulldozer-border: var(--bp-surface-border-color-default',
  '--bulldozer-accent: var(--bp-intent-primary-rest',
  '--bulldozer-text-primary: var(--bp-typography-color-default-rest',
  '--bulldozer-accent-text: var(--bp-intent-primary-foreground',
  '--bulldozer-defense-accent',
  '--bulldozer-text-secondary',
  '--bulldozer-card-bg',
  '--bulldozer-radius-sm',
  '--bulldozer-radius-md',
  '--bulldozer-radius-lg',
  '--bulldozer-muted-opacity',
]

const filesToCheck = [
  'views/AppPanel.es',
  'views/PresetBar.es',
  'views/ResultPanel.es',
  'views/SquadronTabs.es',
  'views/PlanePicker/CategoryTabs.es',
  'views/SlotRow.es',
  'views/PlanePicker/PlaneList.es',
]

let errors = []

// 1. themeStyle.es must contain all required tokens and no custom page/input bg tokens.
const themeStyle = read('views/themeStyle.es')
for (const token of requiredTokens) {
  if (!themeStyle.includes(token)) {
    errors.push(`Missing token in views/themeStyle.es: ${token}`)
  }
}
if (themeStyle.includes('--bulldozer-bg-page')) {
  errors.push('views/themeStyle.es still defines custom --bulldozer-bg-page')
}

// 2. themeStyle.es must not set html/body background itself.
if (/html\s*,\s*body\s*\{[^}]*background/i.test(themeStyle)) {
  errors.push('views/themeStyle.es should not set html/body background')
}

// 3. Modified view files must reference bulldozer tokens and not use old hardcoded colors.
const oldColorPattern = /#(?:4a90d9|f8fafd|eee|ddd|999|ccc|333|666)\b/g
for (const file of filesToCheck) {
  const content = read(file)
  if (!content.includes('bulldozer-') && !content.includes('--poi-background-color')) {
    errors.push(`${file} does not reference any --bulldozer-* token or --poi-background-color`)
  }
  const matches = content.match(oldColorPattern)
  if (matches) {
    errors.push(`${file} contains old hardcoded colors: ${[...new Set(matches)].join(', ')}`)
  }
}

// 4. AppPanel root container must not set its own background.
const appPanel = read('views/AppPanel.es')
const rootStyleMatch = appPanel.match(/style=\{\{([\s\S]*?)\}\}/)
if (rootStyleMatch && /background\s*:/i.test(rootStyleMatch[1])) {
  errors.push('views/AppPanel.es root style should not set a background')
}

// 5. View files must use Blueprint-aligned fallbacks.
const expectedFallbacks = {
  'views/AppPanel.es': [
    "var(--bulldozer-text-primary, #1c2127)",
  ],
  'views/PresetBar.es': [
    "var(--bulldozer-text-primary, #1c2127)",
    "var(--bulldozer-border, #d3d8de)",
  ],
  'views/ResultPanel.es': [
    "var(--bulldozer-text-secondary, #888)",
    "var(--bulldozer-card-bg, #f5f5f5)",
  ],
  'views/SquadronTabs.es': [
    "var(--bulldozer-text-primary, #1c2127)",
    "var(--bulldozer-text-secondary, #888)",
  ],
  'views/PlanePicker/CategoryTabs.es': [
    "var(--bulldozer-accent, #2d72d2)",
    "var(--bulldozer-accent-text, #ffffff)",
    "var(--bulldozer-text-primary, #1c2127)",
    "var(--bulldozer-border, #d3d8de)",
  ],
  'views/SlotRow.es': [
    "var(--bulldozer-card-bg, #f5f5f5)",
    "var(--bulldozer-text-primary, #1c2127)",
  ],
  'views/PlanePicker/PlaneList.es': [
    "var(--bulldozer-radius-sm, 4px)",
  ],
}
for (const [file, fallbacks] of Object.entries(expectedFallbacks)) {
  const content = read(file)
  for (const fallback of fallbacks) {
    if (!content.includes(fallback)) {
      errors.push(`${file} missing expected token: ${fallback}`)
    }
  }
}

if (errors.length > 0) {
  console.error('Theme verification failed:')
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
}

console.log('Theme verification passed.')
