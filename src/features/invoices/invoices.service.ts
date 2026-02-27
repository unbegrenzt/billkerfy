import { ID, Query } from 'appwrite'
import { tablesDB } from '@/lib/appwrite'
import type { CreateInvoiceInput, Invoice } from '@/features/invoices/invoices.types'

const DATABASE_ID = 'billkerfy'
const INVOICES_TABLE_ID = 'invoices'
const INVOICE_LINE_ITEMS_TABLE_ID = 'invoiceLineItems'
const PAYMENTS_TABLE_ID = 'payments'

function mapInvoiceRow(row: Record<string, unknown> & { $id: string }): Invoice {
  return {
    $id: row.$id,
    organizationId: String(row.organizationId ?? ''),
    customerId: String(row.customerId ?? ''),
    invoiceNumber: String(row.invoiceNumber ?? ''),
    status: String(row.status ?? 'draft') as Invoice['status'],
    issueDate: String(row.issueDate ?? ''),
    dueDate: String(row.dueDate ?? ''),
    totalAmount: Number(row.totalAmount ?? 0),
    currencyCode: String(row.currencyCode ?? 'EUR'),
  }
}

export async function fetchInvoicesByOrganization(organizationId: string): Promise<Invoice[]> {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: INVOICES_TABLE_ID,
    queries: [Query.equal('organizationId', [organizationId]), Query.orderDesc('$createdAt'), Query.limit(100)],
  })

  return response.rows.map((row) => mapInvoiceRow(row as Record<string, unknown> & { $id: string }))
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  const invoiceRow = await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: INVOICES_TABLE_ID,
    rowId: ID.unique(),
    data: {
      organizationId: input.organizationId,
      customerId: input.customerId,
      invoiceNumber: input.invoiceNumber,
      status: input.status,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      notes: input.notes,
      subtotalAmount: input.subtotalAmount,
      taxAmount: input.taxAmount,
      totalAmount: input.totalAmount,
      amountPaid: input.amountPaid,
      currencyCode: input.currencyCode,
      issuedAt: input.issuedAt,
      paidAt: input.paidAt,
    },
  })

  await Promise.all(
    input.lineItems.map((lineItem, index) =>
      tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: INVOICE_LINE_ITEMS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          invoiceId: invoiceRow.$id,
          lineOrder: index + 1,
          description: lineItem.description,
          quantity: lineItem.quantity,
          unitPrice: lineItem.unitPrice,
          taxRate: lineItem.taxRate,
          lineSubtotal: lineItem.lineSubtotal,
          lineTaxAmount: lineItem.lineTaxAmount,
          lineTotal: lineItem.lineTotal,
        },
      }),
    ),
  )

  if (input.status === 'paid' && input.amountPaid > 0) {
    await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: PAYMENTS_TABLE_ID,
      rowId: ID.unique(),
      data: {
        invoiceId: invoiceRow.$id,
        amount: input.amountPaid,
        paymentDate: input.paidAt ?? new Date().toISOString(),
        method: 'other',
        reference: 'Auto from issue and mark paid',
        notes: '',
      },
    })
  }

  return mapInvoiceRow(invoiceRow as Record<string, unknown> & { $id: string })
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: Invoice['status'],
): Promise<Invoice> {
  const response = await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: INVOICES_TABLE_ID,
    rowId: invoiceId,
    data: {
      status,
    },
  })

  return mapInvoiceRow(response as Record<string, unknown> & { $id: string })
}
