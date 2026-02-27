import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Flex,
  Input,
  Layout,
  Menu,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import {
  invoicesFiltersBarStyle,
  invoicesPageBodyStyle,
  invoicesSearchStyle,
  invoicesToolbarStyle,
} from '@/components/pages/InvoicesListPage/InvoicesListPage.styles'
import type { InvoiceTableRow } from '@/components/pages/InvoicesListPage/InvoicesListPage.types'
import { useCustomersStore } from '@/features/customers/customers.store'
import { useInvoicesStore } from '@/features/invoices/invoices.store'
import { useOrganizationsStore } from '@/features/organizations/organizations.store'
import { formatCurrencyAmount } from '@/lib/currency'

const statusColorByValue: Record<string, string> = {
  draft: 'default',
  issued: 'processing',
  paid: 'success',
  void: 'error',
}

const statusLabelByValue: Record<string, string> = {
  draft: 'Draft',
  issued: 'Issued',
  paid: 'Paid',
  void: 'Void',
}

const menuItems = [
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

function formatDate(value: string) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: '2-digit' })
}

export function InvoicesListPage() {
  const navigate = useNavigate()
  const organization = useOrganizationsStore((state) => state.organization)
  const organizationLoading = useOrganizationsStore((state) => state.isLoading)
  const organizationError = useOrganizationsStore((state) => state.error)
  const loadPrimaryOrganization = useOrganizationsStore((state) => state.loadPrimaryOrganization)
  const invoices = useInvoicesStore((state) => state.invoices)
  const invoicesLoading = useInvoicesStore((state) => state.isLoading)
  const invoicesError = useInvoicesStore((state) => state.error)
  const loadInvoicesByOrganization = useInvoicesStore((state) => state.loadInvoicesByOrganization)
  const customers = useCustomersStore((state) => state.customers)
  const loadCustomersByOrganization = useCustomersStore((state) => state.loadCustomersByOrganization)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all')
  const [dateFilter, setDateFilter] = useState<'30d' | '90d' | 'year' | 'all'>('30d')

  useEffect(() => {
    void loadPrimaryOrganization()
  }, [loadPrimaryOrganization])

  useEffect(() => {
    if (!organization?.$id) {
      return
    }

    void loadInvoicesByOrganization(organization.$id)
    void loadCustomersByOrganization(organization.$id)
  }, [organization?.$id, loadCustomersByOrganization, loadInvoicesByOrganization])

  const customerNameById = useMemo(() => {
    return new Map(customers.map((customer) => [customer.$id, customer.companyName]))
  }, [customers])

  const rows = useMemo<InvoiceTableRow[]>(() => {
    return invoices.map((invoice) => ({
      key: invoice.$id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: customerNameById.get(invoice.customerId) ?? 'Unknown customer',
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      totalAmount: invoice.totalAmount,
      currencyCode: invoice.currencyCode,
    }))
  }, [customerNameById, invoices])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    const now = new Date()
    let startDate: Date | null = null

    if (dateFilter === '30d') {
      startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 30)
    } else if (dateFilter === '90d') {
      startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 90)
    } else if (dateFilter === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1)
    }

    const withStatus = rows.filter((row) => {
      const dueDate = new Date(row.dueDate)
      const isOverdue = row.status === 'issued' && !Number.isNaN(dueDate.getTime()) && dueDate < now
      const isPending = row.status === 'issued' && !isOverdue

      if (statusFilter === 'paid') {
        return row.status === 'paid'
      }
      if (statusFilter === 'pending') {
        return isPending
      }
      if (statusFilter === 'overdue') {
        return isOverdue
      }

      return true
    })

    const withDate = withStatus.filter((row) => {
      if (!startDate) {
        return true
      }
      const issueDate = new Date(row.issueDate)
      if (Number.isNaN(issueDate.getTime())) {
        return false
      }
      return issueDate >= startDate
    })

    if (!query) {
      return withDate
    }

    return withDate.filter(
      (row) =>
        row.invoiceNumber.toLowerCase().includes(query) || row.customerName.toLowerCase().includes(query),
    )
  }, [dateFilter, rows, search, statusFilter])

  const columns: ColumnsType<InvoiceTableRow> = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => <Tag color={statusColorByValue[value]}>{statusLabelByValue[value] ?? value}</Tag>,
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
      render: (_, row) => formatCurrencyAmount(row.totalAmount, row.currencyCode),
    },
  ]

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
          <Menu mode="inline" defaultSelectedKeys={['invoices']} items={menuItems} />
        </Flex>
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <div style={invoicesPageBodyStyle}>
            <div style={invoicesToolbarStyle}>
              <div>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  Listado de Facturas
                </Typography.Title>
                <Typography.Text type="secondary">
                  Gestiona y consulta el historial completo de tu facturación.
                </Typography.Text>
              </div>
              <Space>
                <Input
                  placeholder="Buscar factura, cliente..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={invoicesSearchStyle}
                />
                <Button type="primary" onClick={() => navigate('/invoices/new')}>
                  Nueva Factura
                </Button>
              </Space>
            </div>
            <div style={invoicesFiltersBarStyle}>
              <Segmented
                options={[
                  { label: 'Todas', value: 'all' },
                  { label: 'Pagadas', value: 'paid' },
                  { label: 'Pendientes', value: 'pending' },
                  { label: 'Vencidas', value: 'overdue' },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as 'all' | 'paid' | 'pending' | 'overdue')}
              />
              <Space>
                <Typography.Text type="secondary">Fecha:</Typography.Text>
                <Select
                  value={dateFilter}
                  onChange={(value) => setDateFilter(value)}
                  style={{ minWidth: 170 }}
                  options={[
                    { value: '30d', label: 'Últimos 30 días' },
                    { value: '90d', label: 'Últimos 90 días' },
                    { value: 'year', label: 'Este año' },
                    { value: 'all', label: 'Todo el tiempo' },
                  ]}
                />
              </Space>
            </div>

            {organizationLoading ? <Typography.Text type="secondary">Loading organization...</Typography.Text> : null}
            {organizationError ? <Typography.Text type="danger">{organizationError}</Typography.Text> : null}
            {invoicesError ? <Typography.Text type="danger">{invoicesError}</Typography.Text> : null}

            <Card>
              <Table<InvoiceTableRow>
                columns={columns}
                dataSource={filteredRows}
                rowKey="key"
                loading={invoicesLoading}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No invoices found yet.' }}
              />
            </Card>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
