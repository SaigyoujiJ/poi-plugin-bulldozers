export const MODE_COLORS = {
  sortie: {
    accent: '#2d72d2',
    badgeText: '#ffffff',
    badgeBg: '#2d72d2',
  },
  defense: {
    accent: '#ff9800',
    badgeText: '#1c2127',
    badgeBg: '#ff9800',
  },
}

export const getModeColor = (mode) => MODE_COLORS[mode] || MODE_COLORS.sortie