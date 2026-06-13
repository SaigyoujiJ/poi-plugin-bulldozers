export const MODE_COLORS = {
  sortie: {
    accent: 'var(--bulldozer-accent, #2d72d2)',
    badgeText: '#ffffff',
    badgeBg: 'var(--bulldozer-accent, #2d72d2)',
  },
  defense: {
    accent: 'var(--bulldozer-defense-accent, #ff9800)',
    badgeText: '#1c2127',
    badgeBg: 'var(--bulldozer-defense-accent, #ff9800)',
  },
}

export const getModeColor = (mode) => MODE_COLORS[mode] || MODE_COLORS.sortie