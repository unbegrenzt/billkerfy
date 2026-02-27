import { Query } from 'appwrite'
import { tablesDB } from '@/lib/appwrite'
import type { Invoice } from '@/features/invoices/invoices.types'

const DATABASE_ID = 'billkerfy'
const INVOICES_TABLE_ID = 'invoices'

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
