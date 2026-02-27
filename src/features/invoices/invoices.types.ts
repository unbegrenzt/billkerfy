export type Invoice = {
  $id: string
  organizationId: string
  customerId: string
  invoiceNumber: string
  status: 'draft' | 'issued' | 'paid' | 'void'
  issueDate: string
  dueDate: string
  totalAmount: number
  currencyCode: string
}
