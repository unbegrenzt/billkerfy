import type { CSSProperties } from 'react'
import type { DashboardStatCardTone } from '@/components/molecules/DashboardStatCard/DashboardStatCard.types'

const iconPaletteByTone: Record<
  DashboardStatCardTone,
  { background: string; color: string }
> = {
  teal: { background: '#e6f4f4', color: '#038c8c' },
  cyan: { background: '#ecfdff', color: '#0e7490' },
  rose: { background: '#fff1f2', color: '#be123c' },
  violet: { background: '#f5f3ff', color: '#6d28d9' },
}

export const dashboardStatCardStyle: CSSProperties = {
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.04)',
}

export const dashboardStatCardBodyStyle: CSSProperties = {
  padding: 20,
}

export function getDashboardStatIconWrapperStyle(tone: DashboardStatCardTone): CSSProperties {
  return {
    width: 40,
    height: 40,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: iconPaletteByTone[tone].background,
    color: iconPaletteByTone[tone].color,
  }
}

export const dashboardStatHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
}
