export type DashboardRevenuePoint = {
  label: string
  amount: number
}

export type DashboardRevenueChartProps = {
  points: DashboardRevenuePoint[]
  currencyCode: string
}
