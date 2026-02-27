import type { DashboardTrendDirection } from '@/components/atoms/DashboardTrendBadge/DashboardTrendBadge.types'

export type DashboardStatCardTone = 'teal' | 'cyan' | 'rose' | 'violet'

export type DashboardStatCardProps = {
  title: string
  value: string
  iconClass: string
  trendValue: string
  trendDirection: DashboardTrendDirection
  tone: DashboardStatCardTone
}
