export type InvoiceSavedModalData = {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  customerName: string
  totalAmount: number
  currencyCode: string
}

export type InvoiceSavedModalProps = {
  open: boolean
  data: InvoiceSavedModalData | null
  onClose: () => void
  onDownloadPdf: () => void
  onSendEmail: () => void
  onCreateAnother: () => void
  onBackToList: () => void
}
