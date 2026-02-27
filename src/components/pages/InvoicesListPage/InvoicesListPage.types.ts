import type { Invoice } from '@/features/invoices/invoices.types'

export type InvoiceTableRow = {
  key: string
  invoiceNumber: string
  customerName: string
  issueDate: string
  dueDate: string
  status: Invoice['status']
  totalAmount: number
  currencyCode: string
}
