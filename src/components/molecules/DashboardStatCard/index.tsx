import { Card, Typography } from 'antd'
import { DashboardTrendBadge } from '@/components/atoms/DashboardTrendBadge'
import {
  dashboardStatCardBodyStyle,
  dashboardStatCardStyle,
  dashboardStatHeaderStyle,
  getDashboardStatIconWrapperStyle,
} from '@/components/molecules/DashboardStatCard/DashboardStatCard.styles'
import type { DashboardStatCardProps } from '@/components/molecules/DashboardStatCard/DashboardStatCard.types'

export function DashboardStatCard({
  title,
  value,
  iconClass,
  trendValue,
  trendDirection,
  tone,
}: DashboardStatCardProps) {
  return (
    <Card style={dashboardStatCardStyle} styles={{ body: dashboardStatCardBodyStyle }}>
      <div style={dashboardStatHeaderStyle}>
        <div style={getDashboardStatIconWrapperStyle(tone)}>
          <i className={iconClass} style={{ fontSize: 20 }} />
        </div>
        <DashboardTrendBadge value={trendValue} direction={trendDirection} />
      </div>
      <Typography.Text type="secondary">{title}</Typography.Text>
      <Typography.Title level={3} style={{ margin: '4px 0 0 0' }}>
        {value}
      </Typography.Title>
    </Card>
  )
}
