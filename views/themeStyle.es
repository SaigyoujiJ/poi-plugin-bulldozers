export const themeCss = `
.bulldozers-app {
  font-size: 14px;
}

:root {
  --bulldozer-bg-hover: rgba(0, 0, 0, 0.05);
  --bulldozer-border: var(--bp-surface-border-color-default, #d3d8de);
  --bulldozer-accent: var(--bp-intent-primary-rest, #2d72d2);
  --bulldozer-text-primary: var(--bp-typography-color-default-rest, #1c2127);
  --bulldozer-accent-text: var(--bp-intent-primary-foreground, #ffffff);
  --bulldozer-bg-selected: #ffe082;
  --bulldozer-border-active: #ff9800;
  --bulldozer-defense-accent: #ff9800;
  --bulldozer-text-secondary: #5f6b7a;
  --bulldozer-card-bg: #f5f5f5;
  --bulldozer-bg-surface: transparent;
  --bulldozer-bg-input: var(--poi-background-color);
  --bulldozer-muted-opacity: 0.55;
  --bulldozer-radius-sm: 4px;
  --bulldozer-radius-md: 8px;
  --bulldozer-radius-lg: 10px;
  color-scheme: light;
}

.bp6-dark {
  --bulldozer-bg-hover: rgba(255, 255, 255, 0.06);
  --bulldozer-border: var(--bp-surface-border-color-default, #ffffff33);
  --bulldozer-text-primary: #ffffff;
  --bulldozer-bg-selected: #5c4b1e;
  --bulldozer-border-active: #ffb74d;
  --bulldozer-defense-accent: #ffb74d;
  --bulldozer-text-secondary: #b0b5bd;
  --bulldozer-card-bg: rgba(255, 255, 255, 0.04);
  --bulldozer-bg-surface: transparent;
  --bulldozer-bg-input: rgba(0, 0, 0, 0.2);
  color-scheme: dark;
}

.bulldozer-plane-item:hover {
  background: var(--bulldozer-bg-hover, rgba(0, 0, 0, 0.05));
}

@keyframes bulldozer-popup-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`
