export type InvoiceMetaFieldsProps = {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  onIssueDateChange: (value: string) => void
  onDueDateChange: (value: string) => void
}
