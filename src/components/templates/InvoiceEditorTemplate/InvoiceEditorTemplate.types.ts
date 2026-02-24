import type { ReactNode } from 'react'

export type InvoiceEditorTemplateProps = {
  pageTitle: string
  metaFields: ReactNode
  customerSection: ReactNode
  lineItemsSection: ReactNode
  notesAndSummarySection: ReactNode
  actionsBar: ReactNode
}
