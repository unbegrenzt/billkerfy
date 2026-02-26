import { Query } from 'appwrite'
import { tablesDB } from '@/lib/appwrite'
import type { Organization } from '@/features/organizations/organizations.types'

const DATABASE_ID = 'billkerfy'
const ORGANIZATIONS_TABLE_ID = 'organizations'

export async function fetchPrimaryOrganization(): Promise<Organization | null> {
  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: ORGANIZATIONS_TABLE_ID,
    queries: [Query.limit(1)],
  })

  const row = response.rows[0]
  if (!row) {
    return null
  }

  return {
    $id: row.$id,
    ownerUserId: String(row.ownerUserId ?? ''),
    legalName: String(row.legalName ?? ''),
    tradeName: row.tradeName ? String(row.tradeName) : null,
    taxId: String(row.taxId ?? ''),
    addressLine1: String(row.addressLine1 ?? ''),
    city: String(row.city ?? ''),
    country: String(row.country ?? ''),
    currencyCode: String(row.currencyCode ?? ''),
  }
}
