import { Input } from 'antd'
import { SectionLabel } from '@/components/atoms/SectionLabel'
import { invoiceMetaGridStyle } from '@/components/molecules/InvoiceMetaFields/InvoiceMetaFields.styles'
import type { InvoiceMetaFieldsProps } from '@/components/molecules/InvoiceMetaFields/InvoiceMetaFields.types'

export function InvoiceMetaFields({
  invoiceNumber,
  issueDate,
  dueDate,
  onIssueDateChange,
  onDueDateChange,
}: InvoiceMetaFieldsProps) {
  return (
    <div style={invoiceMetaGridStyle}>
      <div>
        <SectionLabel text="Invoice Number" />
        <Input value={invoiceNumber} readOnly />
      </div>
      <div>
        <SectionLabel text="Issue Date" />
        <Input
          type="date"
          value={issueDate}
          onChange={(event) => onIssueDateChange(event.target.value)}
        />
      </div>
      <div>
        <SectionLabel text="Due Date" />
        <Input type="date" value={dueDate} onChange={(event) => onDueDateChange(event.target.value)} />
      </div>
    </div>
  )
}
