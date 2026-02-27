import { Line } from '@ant-design/charts'
import { formatCurrencyAmount } from '@/lib/currency'
import { dashboardRevenueChartContainerStyle } from '@/components/organisms/DashboardRevenueChart/DashboardRevenueChart.styles'
import type { DashboardRevenueChartProps } from '@/components/organisms/DashboardRevenueChart/DashboardRevenueChart.types'

export function DashboardRevenueChart({ points, currencyCode }: DashboardRevenueChartProps) {
  const chartData = points.map((point) => ({ month: point.label, amount: point.amount }))
  const config = {
    data: chartData,
    xField: 'month',
    yField: 'amount',
    smooth: true,
    color: '#038c8c',
    area: {
      style: {
        fill: 'l(270) 0:rgba(3,140,140,0.24) 1:rgba(3,140,140,0)',
      },
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#ffffff',
        stroke: '#038c8c',
        lineWidth: 2,
      },
    },
    xAxis: {
      labelAutoHide: false,
      labelAutoRotate: false,
    },
    yAxis: {
      gridLineDash: [4, 4],
      labelFormatter: (value: string) => {
        const amount = Number(value)
        if (!amount) {
          return '0'
        }
        return `${Math.round(amount / 1000)}k`
      },
    },
    tooltip: {
      title: (datum: { month: string }) => datum.month,
      items: [
        {
          channel: 'y',
          valueFormatter: (value: number) => formatCurrencyAmount(value, currencyCode),
        },
      ],
    },
    interaction: {
      tooltip: { marker: false },
    },
    height: 280,
  }

  return (
    <div style={dashboardRevenueChartContainerStyle}>
      <Line {...config} />
    </div>
  )
}
