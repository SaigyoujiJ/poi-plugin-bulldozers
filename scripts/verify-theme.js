const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf-8')

const requiredTokens = [
  '--bulldozer-bg-page: var(--poi-background-color',
  '--bulldozer-bg-input: var(--poi-background-color',
  '--bulldozer-bg-hover: rgba',
  '--bulldozer-border: var(--bp-surface-border-color-default',
  '--bulldozer-accent: var(--bp-intent-primary-rest',
  '--bulldozer-text-primary: var(--bp-typography-color-default-rest',
  '--bulldozer-accent-text: var(--bp-intent-primary-foreground',
]

const allowedHardcodedColors = [
  '#ffe082',
  '#ff9800',
  '#5c4b1e',
  '#ffb74d',
]

const filesToCheck = [
  'views/AppPanel.es',
  'views/PresetBar.es',
  'views/ResultPanel.es',
  'views/SquadronTabs.es',
  'views/PlanePicker/CategoryTabs.es',
  'views/SlotRow.es',
  'views/PlanePicker/PlaneList.es',
  'views/PlanePicker/index.es',
]

let errors = []

// 1. themeStyle.es must contain all required tokens.
const themeStyle = read('views/themeStyle.es')
for (const token of requiredTokens) {
  if (!themeStyle.includes(token)) {
    errors.push(`Missing token in views/themeStyle.es: ${token}`)
  }
}

// 2. themeStyle.es must not contain hardcoded old page/panel/input/border/text colors.
const forbiddenInTheme = [
  '--bulldozer-bg-page: #',
  '--bulldozer-bg-input: #',
  '--bulldozer-border: #',
  '--bulldozer-accent: #',
  '--bulldozer-text-primary: #',
]
for (const pattern of forbiddenInTheme) {
  if (themeStyle.includes(pattern)) {
    errors.push(`views/themeStyle.es still has hardcoded value: ${pattern}`)
  }
}

// 3. Modified view files must reference bulldozer tokens and not use old hardcoded colors.
const oldColorPattern = /#(?:4a90d9|f8fafd|f5f5f5|eee|ddd|999|ccc|333|666)\b/g
for (const file of filesToCheck) {
  const content = read(file)
  if (!content.includes('bulldozer-')) {
    errors.push(`${file} does not reference any --bulldozer-* token`)
  }
  const matches = content.match(oldColorPattern)
  if (matches) {
    errors.push(`${file} contains old hardcoded colors: ${[...new Set(matches)].join(', ')}`)
  }
}

// 4. View files must use Blueprint-aligned fallbacks.
const expectedFallbacks = {
  'views/AppPanel.es': [
    "var(--bulldozer-bg-page, #f6f7f9)",
    "var(--bulldozer-text-primary, #1c2127)",
  ],
  'views/PresetBar.es': [
    "var(--bulldozer-bg-input, #f6f7f9)",
    "var(--bulldozer-text-primary, #1c2127)",
    "var(--bulldozer-border, #d3d8de)",
  ],
  'views/ResultPanel.es': [
    "var(--bulldozer-accent, #2d72d2)",
    "background: 'transparent'",
  ],
  'views/SquadronTabs.es': [
    "var(--bulldozer-accent, #2d72d2)",
    "var(--bulldozer-bg-input, #f6f7f9)",
    "var(--bulldozer-text-primary, #1c2127)",
    "var(--bulldozer-border, #d3d8de)",
  ],
  'views/PlanePicker/CategoryTabs.es': [
    "var(--bulldozer-accent, #2d72d2)",
    "var(--bulldozer-bg-input, #f6f7f9)",
    "var(--bulldozer-text-primary, #1c2127)",
    "var(--bulldozer-border, #d3d8de)",
  ],
  'views/SlotRow.es': [
    "var(--bulldozer-bg-input, #f6f7f9)",
    "var(--bulldozer-border, #d3d8de)",
    "var(--bulldozer-text-primary, #1c2127)",
  ],
  'views/PlanePicker/PlaneList.es': [
    "var(--bulldozer-border, #d3d8de)",
  ],
  'views/PlanePicker/index.es': [
    "var(--bulldozer-border, #d3d8de)",
    "background: 'transparent'",
  ],
}
for (const [file, fallbacks] of Object.entries(expectedFallbacks)) {
  const content = read(file)
  for (const fallback of fallbacks) {
    if (!content.includes(fallback)) {
      errors.push(`${file} missing expected fallback: ${fallback}`)
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
