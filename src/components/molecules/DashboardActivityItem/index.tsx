import { Typography } from 'antd'
import {
  dashboardActivityIconStyle,
  dashboardActivityItemStyle,
  dashboardActivityLeftStyle,
  dashboardActivityRightStyle,
  getDashboardActivityStatusStyle,
} from '@/components/molecules/DashboardActivityItem/DashboardActivityItem.styles'
import type { DashboardActivityItemProps } from '@/components/molecules/DashboardActivityItem/DashboardActivityItem.types'

export function DashboardActivityItem({
  customerName,
  invoiceNumber,
  amount,
  statusLabel,
  statusTone,
}: DashboardActivityItemProps) {
  return (
    <div style={dashboardActivityItemStyle}>
      <div style={dashboardActivityLeftStyle}>
        <div style={dashboardActivityIconStyle}>
          <i className="mgc_bill_line" style={{ fontSize: 18 }} />
        </div>
        <div>
          <Typography.Text strong style={{ display: 'block' }}>
            {customerName}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Factura {invoiceNumber}
          </Typography.Text>
        </div>
      </div>
      <div style={dashboardActivityRightStyle}>
        <Typography.Text strong>{amount}</Typography.Text>
        <span style={getDashboardActivityStatusStyle(statusTone)}>{statusLabel}</span>
      </div>
    </div>
  )
}
