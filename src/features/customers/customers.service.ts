import { ID, Query } from 'appwrite'
import { tablesDB } from '@/lib/appwrite'
import type { CreateCustomerInput, Customer, UpdateCustomerInput } from '@/features/customers/customers.types'

const DATABASE_ID = 'billkerfy'
const CUSTOMERS_TABLE_ID = 'customers'

function mapCustomerRow(row: Record<string, unknown> & { $id: string }): Customer {
  return {
    $id: row.$id,
    organizationId: String(row.organizationId ?? ''),
    companyName: String(row.companyName ?? ''),
    taxId: row.taxId ? String(row.taxId) : null,
    address: String(row.address ?? ''),
    email: row.email ? String(row.email) : null,
    phone: row.phone ? String(row.phone) : null,
  }
}

export async function fetchCustomersByOrganization(organizationId: string): Promise<Customer[]> {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: CUSTOMERS_TABLE_ID,
    queries: [Query.equal('organizationId', [organizationId]), Query.limit(100)],
  })

  return response.rows.map((row) => mapCustomerRow(row as Record<string, unknown> & { $id: string }))
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const code = Date.now().toString().slice(-6)
  const response = await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: CUSTOMERS_TABLE_ID,
    rowId: ID.unique(),
    data: {
      organizationId: input.organizationId,
      companyName: input.companyName,
      taxId: `AUTO-${code}`,
      address: 'Pending address',
    },
  })

  return mapCustomerRow(response as unknown as Record<string, unknown> & { $id: string })
}

export async function updateCustomer(input: UpdateCustomerInput): Promise<Customer> {
  const response = await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: CUSTOMERS_TABLE_ID,
    rowId: input.customerId,
    data: {
      taxId: input.taxId,
      address: input.address,
    },
  })

  return mapCustomerRow(response as unknown as Record<string, unknown> & { $id: string })
}
