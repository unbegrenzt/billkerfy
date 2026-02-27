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
import { AppBrand } from '@/components/atoms/AppBrand'
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

type UpsertMode = 'create' | 'edit'

type CustomerFormState = {
  companyName: string
  taxId: string
  address: string
  email: string
  phone: string
}

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

function emptyCustomerForm(): CustomerFormState {
  return {
    companyName: '',
    taxId: '',
    address: '',
    email: '',
    phone: '',
  }
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
  const saveCustomerProfile = useCustomersStore((state) => state.saveCustomerProfile)
  const removeCustomer = useCustomersStore((state) => state.removeCustomer)
  const invoices = useInvoicesStore((state) => state.invoices)
  const invoicesLoading = useInvoicesStore((state) => state.isLoading)
  const invoicesError = useInvoicesStore((state) => state.error)
  const loadInvoicesByOrganization = useInvoicesStore((state) => state.loadInvoicesByOrganization)
  const [search, setSearch] = useState('')
  const [upsertMode, setUpsertMode] = useState<UpsertMode>('create')
  const [upsertModalOpen, setUpsertModalOpen] = useState(false)
  const [upsertCustomerId, setUpsertCustomerId] = useState<string | null>(null)
  const [upsertForm, setUpsertForm] = useState<CustomerFormState>(emptyCustomerForm())
  const [isSubmittingUpsert, setIsSubmittingUpsert] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null)
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false)

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
      return
    }

    if (key === 'settings') {
      navigate('/settings')
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

  const selectedDeleteCustomerName = useMemo(() => {
    if (!deleteCustomerId) {
      return ''
    }

    return customers.find((item) => item.$id === deleteCustomerId)?.companyName ?? ''
  }, [customers, deleteCustomerId])

  const openCreateCustomerModal = () => {
    setUpsertMode('create')
    setUpsertCustomerId(null)
    setUpsertForm(emptyCustomerForm())
    setUpsertModalOpen(true)
  }

  const openEditCustomerModal = (customerId: string) => {
    const customer = customers.find((item) => item.$id === customerId)
    if (!customer) {
      return
    }

    setUpsertMode('edit')
    setUpsertCustomerId(customerId)
    setUpsertForm({
      companyName: customer.companyName,
      taxId: customer.taxId ?? '',
      address: customer.address ?? '',
      email: customer.email ?? '',
      phone: customer.phone ?? '',
    })
    setUpsertModalOpen(true)
  }

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
            onClick={() => openEditCustomerModal(row.key)}
          />
          <Button
            type="text"
            danger
            icon={<i className="mgc_delete_2_line" style={{ fontSize: 18 }} />}
            onClick={() => {
              setDeleteCustomerId(row.key)
              setDeleteConfirmOpen(true)
            }}
          />
        </Space>
      ),
    },
  ]

  const handleSubmitUpsert = async () => {
    const companyName = upsertForm.companyName.trim()
    if (!companyName) {
      message.error('El nombre fiscal es obligatorio')
      return
    }

    setIsSubmittingUpsert(true)

    if (upsertMode === 'create') {
      if (!organization?.$id) {
        setIsSubmittingUpsert(false)
        return
      }

      const createdCustomer = await addCustomer(organization.$id, companyName, {
        taxId: upsertForm.taxId,
        address: upsertForm.address,
        email: upsertForm.email,
        phone: upsertForm.phone,
      })
      setIsSubmittingUpsert(false)

      if (!createdCustomer) {
        return
      }

      message.success('Cliente creado')
      setUpsertModalOpen(false)
      setUpsertForm(emptyCustomerForm())
      return
    }

    if (!upsertCustomerId) {
      setIsSubmittingUpsert(false)
      return
    }

    const updatedCustomer = await saveCustomerProfile(upsertCustomerId, {
      companyName,
      taxId: upsertForm.taxId,
      address: upsertForm.address,
      email: upsertForm.email,
      phone: upsertForm.phone,
    })
    setIsSubmittingUpsert(false)

    if (!updatedCustomer) {
      return
    }

    message.success('Cliente actualizado')
    setUpsertModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!deleteCustomerId) {
      return
    }

    setIsDeletingCustomer(true)
    const deleted = await removeCustomer(deleteCustomerId)
    setIsDeletingCustomer(false)

    if (!deleted) {
      return
    }

    message.success('Cliente eliminado')
    setDeleteConfirmOpen(false)
    setDeleteCustomerId(null)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider theme="light" width={250} breakpoint="lg" collapsedWidth={0}>
        <Flex vertical style={{ height: '100%', padding: 16 }}>
          <AppBrand />
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
                <Button type="primary" onClick={openCreateCustomerModal}>
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
        open={upsertModalOpen}
        width={920}
        onCancel={() => setUpsertModalOpen(false)}
        title={
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {upsertMode === 'create' ? 'Añadir Nuevo Cliente' : 'Actualizar Cliente'}
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Introduce la información corporativa y de contacto del cliente.
            </Typography.Text>
          </div>
        }
        footer={
          <Flex justify="end" gap={8}>
            <Button onClick={() => setUpsertModalOpen(false)}>Cancelar</Button>
            <Button type="primary" loading={isSubmittingUpsert} onClick={() => void handleSubmitUpsert()}>
              {upsertMode === 'create' ? 'Guardar Cliente' : 'Actualizar Cliente'}
            </Button>
          </Flex>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            columnGap: 20,
            rowGap: 16,
            marginTop: 8,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Flex align="center" gap={8}>
              <i className="mgc_building_4_line" style={{ fontSize: 20, color: '#038c8c' }} />
              <Typography.Text strong>Datos de Empresa</Typography.Text>
            </Flex>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Nombre Fiscal
              </Typography.Text>
              <Input
                placeholder="Ej. Tech Solutions SL"
                value={upsertForm.companyName}
                onChange={(event) =>
                  setUpsertForm((current) => ({ ...current, companyName: event.target.value }))
                }
              />
            </div>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                NIF / CIF
              </Typography.Text>
              <Input
                placeholder="B12345678"
                value={upsertForm.taxId}
                onChange={(event) => setUpsertForm((current) => ({ ...current, taxId: event.target.value }))}
              />
            </div>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Dirección
              </Typography.Text>
              <Input.TextArea
                rows={4}
                placeholder="Calle Principal, 123"
                value={upsertForm.address}
                onChange={(event) => setUpsertForm((current) => ({ ...current, address: event.target.value }))}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Flex align="center" gap={8}>
              <i className="mgc_mail_open_line" style={{ fontSize: 20, color: '#038c8c' }} />
              <Typography.Text strong>Datos de Contacto</Typography.Text>
            </Flex>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Email
              </Typography.Text>
              <Input
                placeholder="carlos@empresa.com"
                value={upsertForm.email}
                onChange={(event) => setUpsertForm((current) => ({ ...current, email: event.target.value }))}
              />
            </div>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Teléfono
              </Typography.Text>
              <Input
                placeholder="+34 600 000 000"
                value={upsertForm.phone}
                onChange={(event) => setUpsertForm((current) => ({ ...current, phone: event.target.value }))}
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={deleteConfirmOpen}
        width={420}
        centered
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setDeleteCustomerId(null)
        }}
        footer={
          <Flex justify="end" gap={8}>
            <Button
              onClick={() => {
                setDeleteConfirmOpen(false)
                setDeleteCustomerId(null)
              }}
            >
              Cancelar
            </Button>
            <Button danger type="primary" loading={isDeletingCustomer} onClick={() => void handleConfirmDelete()}>
              Eliminar
            </Button>
          </Flex>
        }
      >
        <Space direction="vertical" size={8}>
          <Flex align="center" gap={8}>
            <i className="mgc_alert_fill" style={{ fontSize: 18, color: '#dc2626' }} />
            <Typography.Text strong>Confirmar eliminación</Typography.Text>
          </Flex>
          <Typography.Text type="secondary">
            ¿Seguro que quieres eliminar a <Typography.Text strong>{selectedDeleteCustomerName || 'este cliente'}</Typography.Text>? Esta acción no se puede deshacer.
          </Typography.Text>
        </Space>
      </Modal>
    </Layout>
  )
}
