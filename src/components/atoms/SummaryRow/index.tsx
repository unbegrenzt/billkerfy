import { Typography } from 'antd'
import {
  emphasizedSummaryValueStyle,
  summaryRowStyle,
} from '@/components/atoms/SummaryRow/SummaryRow.styles'
import type { SummaryRowProps } from '@/components/atoms/SummaryRow/SummaryRow.types'

export function SummaryRow({ label, value, emphasized = false }: SummaryRowProps) {
  return (
    <div style={summaryRowStyle}>
      <Typography.Text type={emphasized ? undefined : 'secondary'}>{label}</Typography.Text>
      <Typography.Text style={emphasized ? emphasizedSummaryValueStyle : undefined}>
        {value}
      </Typography.Text>
    </div>
  )
}
