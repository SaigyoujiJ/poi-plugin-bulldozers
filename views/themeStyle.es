export const themeCss = `
:root {
  --bulldozer-bg-hover: rgba(0, 0, 0, 0.05);
  --bulldozer-border: var(--bp-surface-border-color-default, #d3d8de);
  --bulldozer-accent: var(--bp-intent-primary-rest, #2d72d2);
  --bulldozer-text-primary: var(--bp-typography-color-default-rest, #1c2127);
  --bulldozer-accent-text: var(--bp-intent-primary-foreground, #ffffff);
  --bulldozer-bg-selected: #ffe082;
  --bulldozer-border-active: #ff9800;
  color-scheme: light;
}

.bp6-dark {
  --bulldozer-bg-hover: rgba(255, 255, 255, 0.08);
  --bulldozer-border: var(--bp-surface-border-color-default, #ffffff33);
  --bulldozer-text-primary: var(--bp-typography-color-default-rest, #a5aab3);
  --bulldozer-bg-selected: #5c4b1e;
  --bulldozer-border-active: #ffb74d;
  color-scheme: dark;
}

.bulldozer-plane-item:hover {
  background: var(--bulldozer-bg-hover, rgba(0, 0, 0, 0.05));
}
`
