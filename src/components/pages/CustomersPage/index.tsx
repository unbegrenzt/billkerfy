import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Flex,
  Input,
  Layout,
  Menu,
  Modal,
  Space,
  Table,
  Typography,
  message,
} from 'antd'
import type { MenuProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import {
  customerAvatarStyle,
  customerCellStyle,
  customersPageBodyStyle,
  customersSearchStyle,
  customersStatsGridStyle,
  customersToolbarStyle,
} from '@/components/pages/CustomersPage/CustomersPage.styles'
import type { CustomerTableRow } from '@/components/pages/CustomersPage/CustomersPage.types'
import type { Invoice } from '@/features/invoices/invoices.types'
import { useCustomersStore } from '@/features/customers/customers.store'
import { useInvoicesStore } from '@/features/invoices/invoices.store'
import { useOrganizationsStore } from '@/features/organizations/organizations.store'
import { formatCurrencyAmount } from '@/lib/currency'

const menuItems: MenuProps['items'] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <i className="mgc_dashboard_3_line" style={{ fontSize: 18 }} />,
  },
  {
    key: 'invoices',
    label: 'Invoices',
    icon: <i className="mgc_bill_line" style={{ fontSize: 18 }} />,
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: <i className="mgc_group_line" style={{ fontSize: 18 }} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <i className="mgc_settings_3_line" style={{ fontSize: 18 }} />,
  },
]

const avatarPalette = [
  { background: '#fef3c7', color: '#b45309' },
  { background: '#dbeafe', color: '#1d4ed8' },
  { background: '#dcfce7', color: '#15803d' },
  { background: '#f3e8ff', color: '#7e22ce' },
  { background: '#ffe4e6', color: '#be123c' },
]

function isValidDate(value: string) {
  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime())
}

function getInitials(companyName: string) {
  const parts = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'NA'
}

function getCustomerSinceLabel(firstInvoiceDate: string | null) {
  if (!firstInvoiceDate || !isValidDate(firstInvoiceDate)) {
    return 'Sin facturas'
  }

  return `Cliente desde ${new Date(firstInvoiceDate).toLocaleDateString('es-ES', {
    month: 'short',
    year: '2-digit',
  })}`
}

function getAvatarTone(companyName: string) {
  const value = companyName
    .split('')
    .reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return avatarPalette[value % avatarPalette.length]
}

function groupInvoicesByCustomer(invoices: Invoice[]) {
  const totalsByCustomer = new Map<string, number>()
  const firstIssueDateByCustomer = new Map<string, string>()

  invoices
    .filter((invoice) => invoice.status !== 'void')
    .forEach((invoice) => {
      totalsByCustomer.set(invoice.customerId, (totalsByCustomer.get(invoice.customerId) ?? 0) + invoice.totalAmount)

      if (!isValidDate(invoice.issueDate)) {
        return
      }

      const currentFirstDate = firstIssueDateByCustomer.get(invoice.customerId)
      if (!currentFirstDate || new Date(invoice.issueDate) < new Date(currentFirstDate)) {
        firstIssueDateByCustomer.set(invoice.customerId, invoice.issueDate)
      }
    })

  return { totalsByCustomer, firstIssueDateByCustomer }
}

export function CustomersPage() {
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
  const invoices = useInvoicesStore((state) => state.invoices)
  const invoicesLoading = useInvoicesStore((state) => state.isLoading)
  const invoicesError = useInvoicesStore((state) => state.error)
  const loadInvoicesByOrganization = useInvoicesStore((state) => state.loadInvoicesByOrganization)
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [editTaxId, setEditTaxId] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  useEffect(() => {
    void loadPrimaryOrganization()
  }, [loadPrimaryOrganization])

  useEffect(() => {
    if (!organization?.$id) {
      return
    }

    void loadCustomersByOrganization(organization.$id)
    void loadInvoicesByOrganization(organization.$id)
  }, [organization?.$id, loadCustomersByOrganization, loadInvoicesByOrganization])

  const handleMenuSelect: MenuProps['onClick'] = ({ key }) => {
    if (key === 'dashboard') {
      navigate('/dashboard')
      return
    }

    if (key === 'invoices') {
      navigate('/invoices')
      return
    }

    if (key === 'customers') {
      navigate('/customers')
    }
  }

  const currencyCode = organization?.currencyCode ?? invoices[0]?.currencyCode ?? 'EUR'
  const { totalsByCustomer, firstIssueDateByCustomer } = useMemo(
    () => groupInvoicesByCustomer(invoices),
    [invoices],
  )

  const rows = useMemo<CustomerTableRow[]>(
    () =>
      customers.map((customer) => ({
        key: customer.$id,
        companyName: customer.companyName,
        taxId: customer.taxId ?? '-',
        contactName: customer.email ? customer.email.split('@')[0] : 'Sin contacto',
        contactEmail: customer.email ?? '-',
        phone: customer.phone ?? '-',
        billedTotal: totalsByCustomer.get(customer.$id) ?? 0,
        currencyCode,
        firstInvoiceDate: firstIssueDateByCustomer.get(customer.$id) ?? null,
      })),
    [currencyCode, customers, firstIssueDateByCustomer, totalsByCustomer],
  )

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return rows
    }

    return rows.filter((row) => {
      return (
        row.companyName.toLowerCase().includes(query) ||
        row.taxId.toLowerCase().includes(query) ||
        row.contactEmail.toLowerCase().includes(query) ||
        row.phone.toLowerCase().includes(query)
      )
    })
  }, [rows, search])

  const now = new Date()
  const monthStart = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1), [now])
  const newCustomersThisMonth = useMemo(
    () =>
      rows.filter((row) => {
        if (!row.firstInvoiceDate || !isValidDate(row.firstInvoiceDate)) {
          return false
        }
        return new Date(row.firstInvoiceDate) >= monthStart
      }).length,
    [monthStart, rows],
  )
  const totalBilled = useMemo(
    () => rows.reduce((accumulator, row) => accumulator + row.billedTotal, 0),
    [rows],
  )
  const activeCustomers = useMemo(() => rows.filter((row) => row.billedTotal > 0).length, [rows])
  const averageBilling = activeCustomers ? totalBilled / activeCustomers : 0

  const columns: ColumnsType<CustomerTableRow> = [
    {
      title: 'Cliente',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (_, row) => {
        const tone = getAvatarTone(row.companyName)
        return (
          <div style={customerCellStyle}>
            <div style={{ ...customerAvatarStyle, background: tone.background, color: tone.color }}>
              {getInitials(row.companyName)}
            </div>
            <div>
              <Typography.Text strong style={{ display: 'block' }}>
                {row.companyName}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {getCustomerSinceLabel(row.firstInvoiceDate)}
              </Typography.Text>
            </div>
          </div>
        )
      },
    },
    {
      title: 'ID Fiscal',
      dataIndex: 'taxId',
      key: 'taxId',
      render: (value: string) => (
        <Typography.Text code style={{ fontSize: 12 }}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: 'Contacto',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      render: (_, row) => (
        <div>
          <Typography.Text style={{ display: 'block' }}>{row.contactName}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {row.contactEmail}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {row.phone}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Facturado',
      dataIndex: 'billedTotal',
      key: 'billedTotal',
      align: 'right',
      render: (_, row) => (
        <Typography.Text strong>{formatCurrencyAmount(row.billedTotal, row.currencyCode)}</Typography.Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <Space size={8}>
          <Button
            type="text"
            icon={<i className="mgc_edit_3_line" style={{ fontSize: 18 }} />}
            onClick={() => {
              const customer = customers.find((item) => item.$id === row.key)
              if (!customer) {
                return
              }
              setEditingCustomerId(customer.$id)
              setEditTaxId(customer.taxId ?? '')
              setEditAddress(customer.address ?? '')
            }}
          />
          <Button
            type="text"
            danger
            icon={<i className="mgc_delete_2_line" style={{ fontSize: 18 }} />}
            onClick={() => {
              message.info('Delete customer is not available yet')
            }}
          />
        </Space>
      ),
    },
  ]

  const handleCreateCustomer = async () => {
    const companyName = newCustomerName.trim()
    if (!companyName || !organization?.$id) {
      return
    }

    setIsCreatingCustomer(true)
    const createdCustomer = await addCustomer(organization.$id, companyName)
    setIsCreatingCustomer(false)

    if (!createdCustomer) {
      return
    }

    message.success('Customer created')
    setCreateModalOpen(false)
    setNewCustomerName('')
  }

  const handleSaveCustomer = async () => {
    if (!editingCustomerId) {
      return
    }

    setIsSavingEdit(true)
    const updatedCustomer = await saveCustomerDetails(editingCustomerId, editTaxId.trim(), editAddress.trim())
    setIsSavingEdit(false)

    if (!updatedCustomer) {
      return
    }

    message.success('Customer updated')
    setEditingCustomerId(null)
    setEditTaxId('')
    setEditAddress('')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider theme="light" width={250} breakpoint="lg" collapsedWidth={0}>
        <Flex vertical style={{ height: '100%', padding: 16 }}>
          <Flex align="center" gap={10} style={{ marginBottom: 16 }}>
            <img
              src="/billkerfy-mark.svg"
              alt="Billkerfy brand mark"
              width={32}
              height={32}
              style={{ borderRadius: 8, flexShrink: 0 }}
            />
            <Typography.Title level={4} style={{ margin: 0 }}>
              Billkerfy
            </Typography.Title>
          </Flex>
          <Menu mode="inline" selectedKeys={['customers']} items={menuItems} onClick={handleMenuSelect} />
        </Flex>
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <div style={customersPageBodyStyle}>
            <div style={customersToolbarStyle}>
              <div>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  Gestión de Clientes
                </Typography.Title>
                <Typography.Text type="secondary">
                  Administra tu cartera y relaciones comerciales en Billkerfy.
                </Typography.Text>
              </div>
              <Space>
                <Input
                  placeholder="Buscar por nombre, ID..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={customersSearchStyle}
                  prefix={<i className="mgc_search_2_line" style={{ color: '#94a3b8' }} />}
                />
                <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                  Nuevo Cliente
                </Button>
              </Space>
            </div>

            {organizationLoading || customersLoading || invoicesLoading ? (
              <Typography.Text type="secondary">Loading customers data...</Typography.Text>
            ) : null}
            {organizationError ? <Typography.Text type="danger">{organizationError}</Typography.Text> : null}
            {customersError ? <Typography.Text type="danger">{customersError}</Typography.Text> : null}
            {invoicesError ? <Typography.Text type="danger">{invoicesError}</Typography.Text> : null}

            <Card>
              <Table<CustomerTableRow>
                columns={columns}
                dataSource={filteredRows}
                rowKey="key"
                pagination={{ pageSize: 8 }}
                locale={{ emptyText: 'No customers found yet.' }}
              />
            </Card>

            <div style={customersStatsGridStyle}>
              <Card size="small">
                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Typography.Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>
                    Nuevos (Mes)
                  </Typography.Text>
                  <i className="mgc_user_add_2_line" style={{ fontSize: 20, color: '#038c8c' }} />
                </Flex>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {newCustomersThisMonth}
                </Typography.Title>
              </Card>
              <Card size="small">
                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Typography.Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>
                    Facturación Media
                  </Typography.Text>
                  <i className="mgc_wallet_4_line" style={{ fontSize: 20, color: '#038c8c' }} />
                </Flex>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {formatCurrencyAmount(averageBilling, currencyCode)}
                </Typography.Title>
              </Card>
              <Card size="small">
                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Typography.Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>
                    Clientes Activos
                  </Typography.Text>
                  <i className="mgc_group_2_line" style={{ fontSize: 20, color: '#94a3b8' }} />
                </Flex>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {activeCustomers}
                </Typography.Title>
              </Card>
            </div>
          </div>
        </Layout.Content>
      </Layout>
      <Modal
        title="Nuevo Cliente"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => void handleCreateCustomer()}
        okButtonProps={{ loading: isCreatingCustomer, disabled: !newCustomerName.trim() }}
      >
        <Input
          placeholder="Nombre de empresa"
          value={newCustomerName}
          onChange={(event) => setNewCustomerName(event.target.value)}
        />
      </Modal>
      <Modal
        title="Editar Cliente"
        open={Boolean(editingCustomerId)}
        onCancel={() => setEditingCustomerId(null)}
        onOk={() => void handleSaveCustomer()}
        okButtonProps={{ loading: isSavingEdit }}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Input
            placeholder="ID Fiscal"
            value={editTaxId}
            onChange={(event) => setEditTaxId(event.target.value)}
          />
          <Input.TextArea
            rows={4}
            placeholder="Dirección"
            value={editAddress}
            onChange={(event) => setEditAddress(event.target.value)}
          />
        </Space>
      </Modal>
    </Layout>
  )
}
