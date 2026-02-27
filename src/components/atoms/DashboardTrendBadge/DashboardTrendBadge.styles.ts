import type { CSSProperties } from 'react'
import type { DashboardTrendDirection } from '@/components/atoms/DashboardTrendBadge/DashboardTrendBadge.types'

const paletteByDirection: Record<DashboardTrendDirection, { background: string; color: string }> = {
  up: {
    background: '#ecfdf3',
    color: '#027a48',
  },
  down: {
    background: '#fef3f2',
    color: '#b42318',
  },
}

export function getDashboardTrendBadgeStyle(direction: DashboardTrendDirection): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: paletteByDirection[direction].background,
    color: paletteByDirection[direction].color,
  }
}
