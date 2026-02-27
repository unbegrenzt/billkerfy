import type { DashboardActivityStatusTone } from '@/components/molecules/DashboardActivityItem/DashboardActivityItem.types'
import type { DashboardTrendDirection } from '@/components/atoms/DashboardTrendBadge/DashboardTrendBadge.types'
import type { DashboardStatCardTone } from '@/components/molecules/DashboardStatCard/DashboardStatCard.types'

export type DashboardMetricCard = {
  key: string
  title: string
  value: string
  iconClass: string
  trendValue: string
  trendDirection: DashboardTrendDirection
  tone: DashboardStatCardTone
}

export type DashboardActivityRow = {
  key: string
  customerName: string
  invoiceNumber: string
  amount: string
  statusLabel: string
  statusTone: DashboardActivityStatusTone
}
