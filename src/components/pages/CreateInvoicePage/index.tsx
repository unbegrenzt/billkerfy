import { useEffect, useMemo, useState } from 'react'
import { AutoComplete, Button, Card, Flex, Input, Space, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { SectionLabel } from '@/components/atoms/SectionLabel'
import { SummaryRow } from '@/components/atoms/SummaryRow'
import { CustomerPreviewCard } from '@/components/molecules/CustomerPreviewCard'
import { InvoiceMetaFields } from '@/components/molecules/InvoiceMetaFields'
import { InvoiceActionsBar } from '@/components/organisms/InvoiceActionsBar'
import { InvoiceSavedModal } from '@/components/organisms/InvoiceSavedModal'
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
import { downloadInvoicePdf } from '@/features/invoices/invoice-document'
import { useInvoicesStore } from '@/features/invoices/invoices.store'
import { useOrganizationsStore } from '@/features/organizations/organizations.store'
import type { Customer } from '@/features/customers/customers.types'
import { formatCurrencyAmount } from '@/lib/currency'
import type { InvoiceSavedModalData } from '@/components/organisms/InvoiceSavedModal/InvoiceSavedModal.types'

function mapCustomerData(customer: Customer): CustomerData {
  return {
    id: customer.$id,
    companyName: customer.companyName,
    taxId: customer.taxId ?? '',
    address: customer.address ?? '',
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

function createInvoiceNumber(): string {
  const code = Date.now().toString().slice(-6)
  return `#INV-${new Date().getFullYear()}-${code}`
}

export function CreateInvoicePage() {
  const navigate = useNavigate()
  const organization = useOrganizationsStore((state) => state.organization)
  const organizationLoading = useOrganizationsStore((state) => state.isLoading)
  const organizationError = useOrganizationsStore((state) => state.error)
  const loadPrimaryOrganization = useOrganizationsStore((state) => state.loadPrimaryOrganization)
  const customers = useCustomersStore((state) => state.customers)
  const customersLoading = useCustomersStore((state) => state.isLoading)
  const customersError = useCustomersStore((state) => state.error)
  const loadCustomersByOrganization = useCustomersStore((state) => state.loadCustomersByOrganization)
  const addCustomer = useCustomersStore((state) => state.addCustomer)
  const saveCustomerDetails = useCustomersStore((state) => state.saveCustomerDetails)
  const createInvoiceEntry = useInvoicesStore((state) => state.createInvoiceEntry)
  const [issueDate, setIssueDate] = useState('2026-02-24')
  const [dueDate, setDueDate] = useState('2026-03-24')
  const [invoiceNumber, setInvoiceNumber] = useState(createInvoiceNumber())
  const [customerSearch, setCustomerSearch] = useState('')
  const [notes, setNotes] = useState('')
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [isSavingCustomer, setIsSavingCustomer] = useState(false)
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([createEmptyLineItem(1)])
  const [savedInvoiceModalOpen, setSavedInvoiceModalOpen] = useState(false)
  const [savedInvoiceModalData, setSavedInvoiceModalData] = useState<InvoiceSavedModalData | null>(null)

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

  const exactCustomerMatch = useMemo(() => {
    const query = customerSearch.trim().toLowerCase()
    if (!query) {
      return null
    }

    return customers.find((item) => item.companyName.trim().toLowerCase() === query) ?? null
  }, [customerSearch, customers])

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
    setIsEditingCustomer(false)
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
    setIsEditingCustomer(true)
  }

  const handleClearCustomerSearch = () => {
    setCustomerSearch('')
  }

  const handleSaveCustomerDetails = async () => {
    if (!customer) {
      return
    }

    setIsSavingCustomer(true)
    const updatedCustomer = await saveCustomerDetails(
      customer.id,
      customer.taxId.trim(),
      customer.address.trim(),
    )
    setIsSavingCustomer(false)

    if (!updatedCustomer) {
      return
    }

    setCustomer(mapCustomerData(updatedCustomer))
    setIsEditingCustomer(false)
  }

  const resetInvoiceForm = () => {
    setIssueDate('2026-02-24')
    setDueDate('2026-03-24')
    setInvoiceNumber(createInvoiceNumber())
    setCustomerSearch('')
    setNotes('')
    setCustomer(null)
    setIsEditingCustomer(false)
    setLineItems([createEmptyLineItem(1)])
  }

  const buildLineItemsPayload = () => {
    return lineItems.map((item) => {
      const lineSubtotal = item.quantity * item.unitPrice
      const lineTaxAmount = lineSubtotal * (item.taxRate / 100)
      const lineTotal = lineSubtotal + lineTaxAmount
      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        lineSubtotal,
        lineTaxAmount,
        lineTotal,
      }
    })
  }

  const validateInvoiceBeforeSubmit = () => {
    if (!organization?.$id) {
      message.error('Organization is required')
      return false
    }
    if (!customer?.id) {
      message.error('Customer is required')
      return false
    }
    if (!lineItems.some((item) => item.description.trim().length > 0)) {
      message.error('Add at least one line item description')
      return false
    }
    return true
  }

  const handleIssueInvoice = async () => {
    if (!validateInvoiceBeforeSubmit() || !organization || !customer) {
      return
    }

    const now = new Date().toISOString()
    const createdInvoice = await createInvoiceEntry({
      organizationId: organization.$id,
      customerId: customer.id,
      invoiceNumber,
      status: 'issued',
      issueDate: new Date(`${issueDate}T00:00:00.000Z`).toISOString(),
      dueDate: new Date(`${dueDate}T00:00:00.000Z`).toISOString(),
      notes,
      subtotalAmount: subtotal,
      taxAmount: taxTotal,
      totalAmount,
      amountPaid: 0,
      currencyCode,
      issuedAt: now,
      paidAt: null,
      lineItems: buildLineItemsPayload(),
    })

    if (!createdInvoice) {
      message.error('Could not issue invoice')
      return
    }

    setSavedInvoiceModalData({
      invoiceNumber,
      issueDate,
      dueDate,
      customerName: customer.companyName,
      totalAmount,
      currencyCode,
    })
    setSavedInvoiceModalOpen(true)
  }

  const handleIssueAndMarkPaid = async () => {
    if (!validateInvoiceBeforeSubmit() || !organization || !customer) {
      return
    }

    const now = new Date().toISOString()
    const createdInvoice = await createInvoiceEntry({
      organizationId: organization.$id,
      customerId: customer.id,
      invoiceNumber,
      status: 'paid',
      issueDate: new Date(`${issueDate}T00:00:00.000Z`).toISOString(),
      dueDate: new Date(`${dueDate}T00:00:00.000Z`).toISOString(),
      notes,
      subtotalAmount: subtotal,
      taxAmount: taxTotal,
      totalAmount,
      amountPaid: totalAmount,
      currencyCode,
      issuedAt: now,
      paidAt: now,
      lineItems: buildLineItemsPayload(),
    })

    if (!createdInvoice) {
      message.error('Could not issue paid invoice')
      return
    }

    message.success('Invoice issued as paid')
    navigate('/invoices')
  }

  const handleSaveDraft = async () => {
    if (!organization?.$id || !customer?.id) {
      message.error('Organization and customer are required')
      return
    }

    const createdInvoice = await createInvoiceEntry({
      organizationId: organization.$id,
      customerId: customer.id,
      invoiceNumber,
      status: 'draft',
      issueDate: new Date(`${issueDate}T00:00:00.000Z`).toISOString(),
      dueDate: new Date(`${dueDate}T00:00:00.000Z`).toISOString(),
      notes,
      subtotalAmount: subtotal,
      taxAmount: taxTotal,
      totalAmount,
      amountPaid: 0,
      currencyCode,
      issuedAt: null,
      paidAt: null,
      lineItems: buildLineItemsPayload(),
    })

    if (!createdInvoice) {
      message.error('Could not save draft')
      return
    }

    message.success('Draft saved')
  }

  const handleDownloadPdf = () => {
    if (!savedInvoiceModalData) {
      return
    }

    downloadInvoicePdf({
      invoiceNumber: savedInvoiceModalData.invoiceNumber,
      customerName: savedInvoiceModalData.customerName,
      issueDate: savedInvoiceModalData.issueDate,
      dueDate: savedInvoiceModalData.dueDate,
      notes,
      currencyCode: savedInvoiceModalData.currencyCode,
      subtotal,
      taxTotal,
      totalAmount,
      lineItems,
    })
  }

  const handleSendEmail = () => {
    if (!savedInvoiceModalData || !customer) {
      return
    }

    const subject = encodeURIComponent(`Invoice ${savedInvoiceModalData.invoiceNumber}`)
    const body = encodeURIComponent(
      `Hi,\n\nPlease find invoice ${savedInvoiceModalData.invoiceNumber} for ${savedInvoiceModalData.customerName}.\nAmount: ${formatCurrencyAmount(savedInvoiceModalData.totalAmount, savedInvoiceModalData.currencyCode)}\n\nAttach the downloaded PDF before sending.\n`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <>
      <InvoiceEditorTemplate
      pageTitle="Create New Invoice"
      organization={organization}
      organizationLoading={organizationLoading}
      organizationError={organizationError}
      metaFields={
        <InvoiceMetaFields
          invoiceNumber={invoiceNumber}
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
            <Button
              onClick={exactCustomerMatch ? handleClearCustomerSearch : handleAddCustomer}
              disabled={!customerSearch.trim()}
            >
              {exactCustomerMatch ? 'Clear' : 'Add New'}
            </Button>
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
              isEditing={isEditingCustomer}
              isSaving={isSavingCustomer}
              onStartEdit={() => setIsEditingCustomer(true)}
              onTaxIdChange={(value) =>
                setCustomer((currentCustomer) =>
                  currentCustomer ? { ...currentCustomer, taxId: value } : currentCustomer,
                )
              }
              onAddressChange={(value) =>
                setCustomer((currentCustomer) =>
                  currentCustomer ? { ...currentCustomer, address: value } : currentCustomer,
                )
              }
              onSave={handleSaveCustomerDetails}
              onClear={() => {
                setCustomer(null)
                setIsEditingCustomer(false)
              }}
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
          onCancel={() => navigate('/invoices')}
          onSaveDraft={handleSaveDraft}
          onIssueInvoice={handleIssueInvoice}
          onIssueAndMarkPaid={handleIssueAndMarkPaid}
        />
      }
      />
      <InvoiceSavedModal
        open={savedInvoiceModalOpen}
        data={savedInvoiceModalData}
        onClose={() => setSavedInvoiceModalOpen(false)}
        onDownloadPdf={handleDownloadPdf}
        onSendEmail={handleSendEmail}
        onCreateAnother={() => {
          resetInvoiceForm()
          setSavedInvoiceModalOpen(false)
        }}
        onBackToList={() => navigate('/invoices')}
      />
    </>
  )
}
