export const themeCss = `
:root {
  --bulldozer-bg-page: var(--poi-background-color, #f6f7f9);
  --bulldozer-bg-input: var(--bp-surface-background-color-default-rest, #ffffff);
  --bulldozer-bg-hover: var(--bp-surface-background-color-default-hover, #f6f7f9);
  --bulldozer-border: var(--bp-surface-border-color-default, #d3d8de);
  --bulldozer-accent: var(--bp-intent-primary-rest, #2d72d2);
  --bulldozer-text-primary: var(--bp-typography-color-default-rest, #1c2127);
  --bulldozer-accent-text: var(--bp-intent-primary-foreground, #ffffff);
  --bulldozer-bg-selected: #ffe082;
  --bulldozer-border-active: #ff9800;
}

body.bp6-dark {
  --bulldozer-bg-selected: #5c4b1e;
  --bulldozer-border-active: #ffb74d;
}

.bulldozer-plane-item:hover {
  background: var(--bulldozer-bg-hover, #f6f7f9);
}
`
