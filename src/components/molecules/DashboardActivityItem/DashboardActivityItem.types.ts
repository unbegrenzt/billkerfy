export type DashboardActivityStatusTone = 'paid' | 'pending' | 'overdue' | 'draft'

export type DashboardActivityItemProps = {
  customerName: string
  invoiceNumber: string
  amount: string
  statusLabel: string
  statusTone: DashboardActivityStatusTone
}
