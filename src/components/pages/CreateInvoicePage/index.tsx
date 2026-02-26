import { useEffect, useMemo, useState } from 'react'
import { AutoComplete, Button, Card, Flex, Input, Space, Typography } from 'antd'
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
import { useCustomersStore } from '@/features/customers/customers.store'
import { useOrganizationsStore } from '@/features/organizations/organizations.store'
import type { Customer } from '@/features/customers/customers.types'
import { formatCurrencyAmount } from '@/lib/currency'

function mapCustomerData(customer: Customer): CustomerData {
  return {
    id: customer.$id,
    companyName: customer.companyName,
    taxId: customer.taxId ?? '-',
    address: customer.address,
  }
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
  const organization = useOrganizationsStore((state) => state.organization)
  const organizationLoading = useOrganizationsStore((state) => state.isLoading)
  const organizationError = useOrganizationsStore((state) => state.error)
  const loadPrimaryOrganization = useOrganizationsStore((state) => state.loadPrimaryOrganization)
  const customers = useCustomersStore((state) => state.customers)
  const customersLoading = useCustomersStore((state) => state.isLoading)
  const customersError = useCustomersStore((state) => state.error)
  const loadCustomersByOrganization = useCustomersStore((state) => state.loadCustomersByOrganization)
  const addCustomer = useCustomersStore((state) => state.addCustomer)
  const [issueDate, setIssueDate] = useState('2026-02-24')
  const [dueDate, setDueDate] = useState('2026-03-24')
  const [customerSearch, setCustomerSearch] = useState('')
  const [notes, setNotes] = useState('')
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([createEmptyLineItem(1)])

  useEffect(() => {
    void loadPrimaryOrganization()
  }, [loadPrimaryOrganization])

  useEffect(() => {
    if (!organization?.$id) {
      return
    }

    void loadCustomersByOrganization(organization.$id)
  }, [organization?.$id, loadCustomersByOrganization])

  const currencyCode = organization?.currencyCode ?? 'EUR'

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLowerCase()
    if (!query) {
      return customers
    }

    return customers.filter((item) => item.companyName.toLowerCase().includes(query))
  }, [customerSearch, customers])

  const customerOptions = useMemo(
    () =>
      filteredCustomers.map((item) => ({
        value: item.companyName,
        label: `${item.companyName} (${item.taxId ?? '-'})`,
      })),
    [filteredCustomers],
  )

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

  const handleSelectCustomer = (customerId: string) => {
    const match = customers.find((item) => item.$id === customerId)
    if (!match) {
      return
    }

    setCustomer(mapCustomerData(match))
    setCustomerSearch(match.companyName)
  }

  const handleSelectCustomerByName = (companyName: string) => {
    const match = customers.find((item) => item.companyName === companyName)
    if (!match) {
      return
    }

    handleSelectCustomer(match.$id)
  }

  const handleAddCustomer = async () => {
    const companyName = customerSearch.trim()
    if (!companyName || !organization?.$id) {
      return
    }

    const customerRecord = await addCustomer(organization.$id, companyName)
    if (!customerRecord) {
      return
    }

    setCustomer(mapCustomerData(customerRecord))
  }

  return (
    <InvoiceEditorTemplate
      pageTitle="Create New Invoice"
      organization={organization}
      organizationLoading={organizationLoading}
      organizationError={organizationError}
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
            <AutoComplete
              style={{ width: '100%' }}
              options={customerOptions}
              value={customerSearch}
              onSelect={handleSelectCustomerByName}
              onChange={setCustomerSearch}
            >
              <Input placeholder="Search customer..." />
            </AutoComplete>
            <Button onClick={handleAddCustomer}>Add New</Button>
          </Flex>
          {customersLoading ? <Typography.Text type="secondary">Loading customers...</Typography.Text> : null}
          {customersError ? <Typography.Text type="danger">{customersError}</Typography.Text> : null}
          {!customer && customerSearch.trim() && filteredCustomers.length === 0 ? (
            <Typography.Text type="secondary">
              No matches found. Click Add New to create "{customerSearch.trim()}".
            </Typography.Text>
          ) : null}
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
          currencyCode={currencyCode}
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
              <SummaryRow label="Subtotal" value={formatCurrencyAmount(subtotal, currencyCode)} />
              <SummaryRow label="Tax" value={formatCurrencyAmount(taxTotal, currencyCode)} />
              <SummaryRow
                label="Total"
                value={formatCurrencyAmount(totalAmount, currencyCode)}
                emphasized
              />
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
