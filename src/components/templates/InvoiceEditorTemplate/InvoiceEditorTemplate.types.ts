import type { ReactNode } from 'react'

export type InvoiceEditorOrganization = {
  tradeName: string | null
  legalName: string
  addressLine1: string
  city: string
  country: string
  taxId: string
}

export type InvoiceEditorTemplateProps = {
  pageTitle: string
  organization: InvoiceEditorOrganization | null
  organizationLoading: boolean
  organizationError: string | null
  metaFields: ReactNode
  customerSection: ReactNode
  lineItemsSection: ReactNode
  notesAndSummarySection: ReactNode
  actionsBar: ReactNode
}
