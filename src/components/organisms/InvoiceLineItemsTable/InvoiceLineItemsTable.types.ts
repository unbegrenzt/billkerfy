export type InvoiceLineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
}

export type InvoiceLineItemsTableProps = {
  items: InvoiceLineItem[]
  currencyCode: string
  onItemChange: <K extends keyof InvoiceLineItem>(
    id: string,
    field: K,
    value: InvoiceLineItem[K],
  ) => void
  onAddItem: () => void
  onRemoveItem: (id: string) => void
}
