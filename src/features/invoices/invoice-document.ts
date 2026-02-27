import type { InvoiceLineItem } from '@/components/organisms/InvoiceLineItemsTable/InvoiceLineItemsTable.types'
import { formatCurrencyAmount } from '@/lib/currency'

type InvoiceDocumentInput = {
  invoiceNumber: string
  customerName: string
  issueDate: string
  dueDate: string
  notes: string
  currencyCode: string
  subtotal: number
  taxTotal: number
  totalAmount: number
  lineItems: InvoiceLineItem[]
}

function buildInvoiceHtml(input: InvoiceDocumentInput): string {
  const rows = input.lineItems
    .map((item, index) => {
      const lineSubtotal = item.quantity * item.unitPrice
      const lineTaxAmount = lineSubtotal * (item.taxRate / 100)
      const lineTotal = lineSubtotal + lineTaxAmount
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.description || '-'}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrencyAmount(item.unitPrice, input.currencyCode)}</td>
          <td>${item.taxRate}%</td>
          <td>${formatCurrencyAmount(lineTotal, input.currencyCode)}</td>
        </tr>
      `
    })
    .join('')

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${input.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { margin: 0 0 8px; }
          .meta { margin-bottom: 20px; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 12px; }
          th { background: #f8fafc; text-align: left; }
          .summary { margin-top: 18px; width: 320px; margin-left: auto; }
          .summary-row { display: flex; justify-content: space-between; margin: 6px 0; }
          .total { font-weight: 700; font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>Invoice ${input.invoiceNumber}</h1>
        <div class="meta">
          Customer: ${input.customerName}<br/>
          Issue date: ${input.issueDate}<br/>
          Due date: ${input.dueDate}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Tax</th><th>Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="summary">
          <div class="summary-row"><span>Subtotal</span><span>${formatCurrencyAmount(input.subtotal, input.currencyCode)}</span></div>
          <div class="summary-row"><span>Tax</span><span>${formatCurrencyAmount(input.taxTotal, input.currencyCode)}</span></div>
          <div class="summary-row total"><span>Total</span><span>${formatCurrencyAmount(input.totalAmount, input.currencyCode)}</span></div>
        </div>
        <p style="margin-top: 20px; color: #475569;">${input.notes || ''}</p>
      </body>
    </html>
  `
}

export function downloadInvoicePdf(input: InvoiceDocumentInput): void {
  const printWindow = window.open('', '_blank', 'width=1024,height=768')
  if (!printWindow) {
    return
  }

  printWindow.document.open()
  printWindow.document.write(buildInvoiceHtml(input))
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}
