export const themeCss = `
:root {
  --bulldozer-bg-page: var(--poi-background-color, #2f343c);
  --bulldozer-bg-input: var(--poi-background-color, #2f343c);
  --bulldozer-bg-hover: rgba(0, 0, 0, 0.05);
  --bulldozer-border: var(--bp-surface-border-color-default, #5f6b7c);
  --bulldozer-accent: var(--bp-intent-primary-rest, #2d72d2);
  --bulldozer-text-primary: var(--bp-typography-color-default-rest, #a5aab3);
  --bulldozer-accent-text: var(--bp-intent-primary-foreground, #ffffff);
  --bulldozer-bg-selected: #ffe082;
  --bulldozer-border-active: #ff9800;
  color-scheme: light;
}

.bp6-dark {
  --bulldozer-bg-page: var(--poi-background-color, #2f343c);
  --bulldozer-bg-input: var(--poi-background-color, #2f343c);
  --bulldozer-bg-hover: rgba(255, 255, 255, 0.08);
  --bulldozer-border: var(--bp-surface-border-color-default, #5f6b7c);
  --bulldozer-text-primary: var(--bp-typography-color-default-rest, #a5aab3);
  --bulldozer-bg-selected: #5c4b1e;
  --bulldozer-border-active: #ffb74d;
  color-scheme: dark;
}

html, body {
  background: var(--bulldozer-bg-page, #2f343c);
  color: var(--bulldozer-text-primary, #a5aab3);
}

.bulldozer-plane-item:hover {
  background: var(--bulldozer-bg-hover, rgba(0, 0, 0, 0.05));
}
`
