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

export type CreateInvoiceInput = {
  organizationId: string
  customerId: string
  invoiceNumber: string
  status: 'draft' | 'issued' | 'paid' | 'void'
  issueDate: string
  dueDate: string
  notes: string
  subtotalAmount: number
  taxAmount: number
  totalAmount: number
  amountPaid: number
  currencyCode: string
  issuedAt: string | null
  paidAt: string | null
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    taxRate: number
    lineSubtotal: number
    lineTaxAmount: number
    lineTotal: number
  }>
}
