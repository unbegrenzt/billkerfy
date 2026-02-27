import type { CSSProperties } from 'react'
import type { DashboardActivityStatusTone } from '@/components/molecules/DashboardActivityItem/DashboardActivityItem.types'

const statusPaletteByTone: Record<DashboardActivityStatusTone, { background: string; color: string }> = {
  paid: { background: '#ecfdf3', color: '#027a48' },
  pending: { background: '#ecfdff', color: '#0e7490' },
  overdue: { background: '#fff1f2', color: '#b42318' },
  draft: { background: '#f8fafc', color: '#475467' },
}

export const dashboardActivityItemStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 12,
}

export const dashboardActivityLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

export const dashboardActivityIconStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8fafc',
  color: '#475467',
}

export const dashboardActivityRightStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 4,
}

export function getDashboardActivityStatusStyle(tone: DashboardActivityStatusTone): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    background: statusPaletteByTone[tone].background,
    color: statusPaletteByTone[tone].color,
  }
}
