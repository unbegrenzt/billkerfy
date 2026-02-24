import { useMemo, useState } from 'react'
import { Button, Card, Flex, Input, Space } from 'antd'
import { SectionLabel } from '@/components/atoms/SectionLabel'
import { SummaryRow } from '@/components/atoms/SummaryRow'
import { CustomerPreviewCard } from '@/components/molecules/CustomerPreviewCard'
import { InvoiceMetaFields } from '@/components/molecules/InvoiceMetaFields'
import { InvoiceActionsBar } from '@/components/organisms/InvoiceActionsBar'
import {
  InvoiceLineItemsTable,
} from '@/components/organisms/InvoiceLineItemsTable'
import type { InvoiceLineItem } from '@/components/organisms/InvoiceLineItemsTable/InvoiceLineItemsTable.types'
import {
  customerSectionStyle,
  notesAndSummaryGridStyle,
} from '@/components/pages/CreateInvoicePage/CreateInvoicePage.styles'
import type { CustomerData } from '@/components/pages/CreateInvoicePage/CreateInvoicePage.types'
import { InvoiceEditorTemplate } from '@/components/templates/InvoiceEditorTemplate'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value)
}

function createEmptyLineItem(id: number): InvoiceLineItem {
  return {
    id: `line-${id}`,
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: 21,
  }
}

export function CreateInvoicePage() {
  const [issueDate, setIssueDate] = useState('2026-02-24')
  const [dueDate, setDueDate] = useState('2026-03-24')
  const [customerSearch, setCustomerSearch] = useState('')
  const [notes, setNotes] = useState('')
  const [customer, setCustomer] = useState<CustomerData | null>({
    companyName: 'Tech Solutions LLC',
    taxId: 'B87654321',
    address: '123 Diagonal Avenue, Barcelona',
  })
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: 'line-1',
      description: 'Monthly Strategy Consulting',
      quantity: 1,
      unitPrice: 1200,
      taxRate: 21,
    },
  ])

  const subtotal = useMemo(
    () => lineItems.reduce((accumulator, item) => accumulator + item.quantity * item.unitPrice, 0),
    [lineItems],
  )

  const taxTotal = useMemo(
    () =>
      lineItems.reduce(
        (accumulator, item) => accumulator + item.quantity * item.unitPrice * (item.taxRate / 100),
        0,
      ),
    [lineItems],
  )

  const totalAmount = subtotal + taxTotal

  const handleLineItemChange = <K extends keyof InvoiceLineItem>(
    id: string,
    field: K,
    value: InvoiceLineItem[K],
  ) => {
    setLineItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  const handleAddLineItem = () => {
    setLineItems((currentItems) => [...currentItems, createEmptyLineItem(currentItems.length + 1)])
  }

  const handleRemoveLineItem = (id: string) => {
    setLineItems((currentItems) => {
      if (currentItems.length === 1) {
        return currentItems
      }

      return currentItems.filter((item) => item.id !== id)
    })
  }

  return (
    <InvoiceEditorTemplate
      pageTitle="Create New Invoice"
      metaFields={
        <InvoiceMetaFields
          invoiceNumber="#INV-2026-001"
          issueDate={issueDate}
          dueDate={dueDate}
          onIssueDateChange={setIssueDate}
          onDueDateChange={setDueDate}
        />
      }
      customerSection={
        <div style={customerSectionStyle}>
          <SectionLabel text="Customer Details" />
          <Flex gap={8}>
            <Input
              placeholder="Search customer..."
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
            />
            <Button>Add New</Button>
          </Flex>
          {customer ? (
            <CustomerPreviewCard
              companyName={customer.companyName}
              taxId={customer.taxId}
              address={customer.address}
              onClear={() => setCustomer(null)}
            />
          ) : null}
        </div>
      }
      lineItemsSection={
        <InvoiceLineItemsTable
          items={lineItems}
          onItemChange={handleLineItemChange}
          onAddItem={handleAddLineItem}
          onRemoveItem={handleRemoveLineItem}
        />
      }
      notesAndSummarySection={
        <div style={notesAndSummaryGridStyle}>
          <div>
            <SectionLabel text="Additional Notes" />
            <Input.TextArea
              rows={4}
              value={notes}
              placeholder="Add payment terms or extra details..."
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
          <Card size="small">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
              <SummaryRow label="Tax" value={formatCurrency(taxTotal)} />
              <SummaryRow label="Total" value={formatCurrency(totalAmount)} emphasized />
            </Space>
          </Card>
        </div>
      }
      actionsBar={
        <InvoiceActionsBar
          onCancel={() => undefined}
          onSaveDraft={() => undefined}
          onIssueInvoice={() => undefined}
          onIssueAndMarkPaid={() => undefined}
        />
      }
    />
  )
}
