import { getDashboardTrendBadgeStyle } from '@/components/atoms/DashboardTrendBadge/DashboardTrendBadge.styles'
import type { DashboardTrendBadgeProps } from '@/components/atoms/DashboardTrendBadge/DashboardTrendBadge.types'

export function DashboardTrendBadge({ value, direction }: DashboardTrendBadgeProps) {
  const iconClass = direction === 'up' ? 'mgc_arrow_up_line' : 'mgc_arrow_down_line'

  return (
    <span style={getDashboardTrendBadgeStyle(direction)}>
      <i className={iconClass} style={{ fontSize: 14 }} />
      {value}
    </span>
  )
}
