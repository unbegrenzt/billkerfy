import { useEffect, useMemo } from 'react'
import { Button, Card, Flex, Layout, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { DashboardActivityItem } from '@/components/molecules/DashboardActivityItem'
import { DashboardRevenueChart } from '@/components/organisms/DashboardRevenueChart'
import { DashboardStatCard } from '@/components/molecules/DashboardStatCard'
import {
  dashboardHeaderStyle,
  dashboardLowerGridStyle,
  dashboardMainContentStyle,
  dashboardMetricsGridStyle,
  dashboardPageLayoutStyle,
  dashboardProfileCardStyle,
  dashboardRecentListStyle,
  dashboardSiderBodyStyle,
  dashboardSiderBrandStyle,
  dashboardSiderStyle,
} from '@/components/pages/DashboardPage/DashboardPage.styles'
import type { DashboardActivityRow, DashboardMetricCard } from '@/components/pages/DashboardPage/DashboardPage.types'
import { useCustomersStore } from '@/features/customers/customers.store'
import type { Invoice } from '@/features/invoices/invoices.types'
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

function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`
}

function toMonthLabel(date: Date) {
  return date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')
}

function isValidDate(value: string) {
  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime())
}

function sumInvoiceAmount(invoices: Invoice[]) {
  return invoices.reduce((accumulator, invoice) => accumulator + invoice.totalAmount, 0)
}

function calculateTrend(currentValue: number, previousValue: number) {
  if (previousValue === 0 && currentValue === 0) {
    return { value: '0%', direction: 'up' as const }
  }

  if (previousValue === 0) {
    return { value: '+100%', direction: 'up' as const }
  }

  const delta = ((currentValue - previousValue) / previousValue) * 100
  const rounded = Math.abs(Math.round(delta))

  if (delta >= 0) {
    return { value: `+${rounded}%`, direction: 'up' as const }
  }

  return { value: `-${rounded}%`, direction: 'down' as const }
}

function mapInvoiceStatusToActivity(invoice: Invoice, now: Date) {
  if (invoice.status === 'paid') {
    return { statusLabel: 'Pagada', statusTone: 'paid' as const }
  }
  if (invoice.status === 'draft') {
    return { statusLabel: 'Borrador', statusTone: 'draft' as const }
  }
  if (invoice.status === 'void') {
    return { statusLabel: 'Anulada', statusTone: 'draft' as const }
  }

  const dueDate = new Date(invoice.dueDate)
  const isOverdue = isValidDate(invoice.dueDate) && dueDate < now

  if (isOverdue) {
    return { statusLabel: 'Atrasada', statusTone: 'overdue' as const }
  }

  return { statusLabel: 'Pendiente', statusTone: 'pending' as const }
}

export function DashboardPage() {
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
  const customersLoading = useCustomersStore((state) => state.isLoading)
  const customersError = useCustomersStore((state) => state.error)
  const loadCustomersByOrganization = useCustomersStore((state) => state.loadCustomersByOrganization)

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

  const currencyCode = organization?.currencyCode ?? invoices[0]?.currencyCode ?? 'EUR'
  const now = new Date()
  const thirtyDaysAgo = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date
  }, [])
  const sixtyDaysAgo = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() - 60)
    return date
  }, [])

  const customerNameById = useMemo(() => {
    return new Map(customers.map((customer) => [customer.$id, customer.companyName]))
  }, [customers])

  const nonVoidInvoices = useMemo(() => invoices.filter((invoice) => invoice.status !== 'void'), [invoices])

  const totalBilled = useMemo(() => sumInvoiceAmount(nonVoidInvoices), [nonVoidInvoices])
  const pendingInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        if (invoice.status !== 'issued') {
          return false
        }
        if (!isValidDate(invoice.dueDate)) {
          return true
        }
        return new Date(invoice.dueDate) >= now
      }),
    [invoices, now],
  )
  const overdueInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        if (invoice.status !== 'issued') {
          return false
        }
        if (!isValidDate(invoice.dueDate)) {
          return false
        }
        return new Date(invoice.dueDate) < now
      }),
    [invoices, now],
  )

  const previousRangeInvoices = useMemo(
    () =>
      nonVoidInvoices.filter((invoice) => {
        if (!isValidDate(invoice.issueDate)) {
          return false
        }
        const issueDate = new Date(invoice.issueDate)
        return issueDate >= sixtyDaysAgo && issueDate < thirtyDaysAgo
      }),
    [nonVoidInvoices, sixtyDaysAgo, thirtyDaysAgo],
  )

  const currentRangeInvoices = useMemo(
    () =>
      nonVoidInvoices.filter((invoice) => {
        if (!isValidDate(invoice.issueDate)) {
          return false
        }
        const issueDate = new Date(invoice.issueDate)
        return issueDate >= thirtyDaysAgo
      }),
    [nonVoidInvoices, thirtyDaysAgo],
  )

  const totalTrend = calculateTrend(sumInvoiceAmount(currentRangeInvoices), sumInvoiceAmount(previousRangeInvoices))
  const pendingTrend = calculateTrend(pendingInvoices.length, previousRangeInvoices.length)
  const overdueTrend = calculateTrend(overdueInvoices.length, Math.max(previousRangeInvoices.length * 0.5, 1))
  const customersTrend = calculateTrend(customers.length, Math.max(customers.length - 1, 1))

  const metricCards: DashboardMetricCard[] = [
    {
      key: 'total',
      title: 'Total Facturado',
      value: formatCurrencyAmount(totalBilled, currencyCode),
      iconClass: 'mgc_coin_line',
      trendValue: totalTrend.value,
      trendDirection: totalTrend.direction,
      tone: 'teal',
    },
    {
      key: 'pending',
      title: 'Pendiente de Cobro',
      value: formatCurrencyAmount(sumInvoiceAmount(pendingInvoices), currencyCode),
      iconClass: 'mgc_time_line',
      trendValue: pendingTrend.value,
      trendDirection: pendingTrend.direction,
      tone: 'cyan',
    },
    {
      key: 'overdue',
      title: 'Facturas Vencidas',
      value: formatCurrencyAmount(sumInvoiceAmount(overdueInvoices), currencyCode),
      iconClass: 'mgc_warning_line',
      trendValue: overdueTrend.value,
      trendDirection: overdueTrend.direction,
      tone: 'rose',
    },
    {
      key: 'customers',
      title: 'Clientes Activos',
      value: String(customers.length),
      iconClass: 'mgc_group_2_line',
      trendValue: customersTrend.value,
      trendDirection: customersTrend.direction,
      tone: 'violet',
    },
  ]

  const revenuePoints = useMemo(() => {
    const points = []
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date()
      date.setMonth(date.getMonth() - offset)
      points.push({
        key: toMonthKey(date),
        label: toMonthLabel(date),
        amount: 0,
      })
    }

    const amountByMonthKey = new Map(points.map((point) => [point.key, 0]))
    nonVoidInvoices.forEach((invoice) => {
      if (!isValidDate(invoice.issueDate)) {
        return
      }
      const issueDate = new Date(invoice.issueDate)
      const key = toMonthKey(issueDate)
      if (!amountByMonthKey.has(key)) {
        return
      }
      amountByMonthKey.set(key, (amountByMonthKey.get(key) ?? 0) + invoice.totalAmount)
    })

    return points.map((point) => ({
      label: point.label.charAt(0).toUpperCase() + point.label.slice(1),
      amount: amountByMonthKey.get(point.key) ?? 0,
    }))
  }, [nonVoidInvoices])

  const recentActivity = useMemo<DashboardActivityRow[]>(() => {
    return [...invoices]
      .sort((left, right) => {
        const leftDate = new Date(left.issueDate).getTime()
        const rightDate = new Date(right.issueDate).getTime()
        return rightDate - leftDate
      })
      .slice(0, 6)
      .map((invoice) => {
        const activityStatus = mapInvoiceStatusToActivity(invoice, now)
        return {
          key: invoice.$id,
          customerName: customerNameById.get(invoice.customerId) ?? 'Cliente sin nombre',
          invoiceNumber: invoice.invoiceNumber,
          amount: formatCurrencyAmount(invoice.totalAmount, invoice.currencyCode),
          statusLabel: activityStatus.statusLabel,
          statusTone: activityStatus.statusTone,
        }
      })
  }, [customerNameById, invoices, now])

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

  return (
    <Layout style={dashboardPageLayoutStyle}>
      <Layout.Sider theme="light" width={260} breakpoint="lg" collapsedWidth={0} style={dashboardSiderStyle}>
        <Flex vertical justify="space-between" style={dashboardSiderBodyStyle}>
          <div>
            <Flex align="center" gap={10} style={dashboardSiderBrandStyle}>
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
            <Menu mode="inline" selectedKeys={['dashboard']} items={menuItems} onClick={handleMenuSelect} />
          </div>
          <div style={dashboardProfileCardStyle}>
            <Flex align="center" gap={10}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  background: '#d1e9ff',
                  color: '#175cd3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className="mgc_user_3_line" style={{ fontSize: 18 }} />
              </div>
              <div>
                <Typography.Text strong style={{ display: 'block' }}>
                  {organization?.tradeName ?? organization?.legalName ?? 'Billkerfy'}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Plan Profesional
                </Typography.Text>
              </div>
            </Flex>
          </div>
        </Flex>
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <div style={dashboardMainContentStyle}>
            <div style={dashboardHeaderStyle}>
              <div>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  Panel de Ingresos
                </Typography.Title>
                <Typography.Text type="secondary">
                  Bienvenido de nuevo, aquí tienes el resumen de tu facturación.
                </Typography.Text>
              </div>
              <Space>
                <Button icon={<i className="mgc_download_2_line" style={{ fontSize: 16 }} />}>Exportar</Button>
                <Button type="primary" onClick={() => navigate('/invoices/new')}>
                  Nueva Factura
                </Button>
              </Space>
            </div>

            {organizationLoading || invoicesLoading || customersLoading ? (
              <Typography.Text type="secondary">Loading dashboard data...</Typography.Text>
            ) : null}
            {organizationError ? <Typography.Text type="danger">{organizationError}</Typography.Text> : null}
            {invoicesError ? <Typography.Text type="danger">{invoicesError}</Typography.Text> : null}
            {customersError ? <Typography.Text type="danger">{customersError}</Typography.Text> : null}

            <div style={dashboardMetricsGridStyle}>
              {metricCards.map((card) => (
                <DashboardStatCard
                  key={card.key}
                  title={card.title}
                  value={card.value}
                  iconClass={card.iconClass}
                  trendValue={card.trendValue}
                  trendDirection={card.trendDirection}
                  tone={card.tone}
                />
              ))}
            </div>

            <div style={dashboardLowerGridStyle}>
              <Card style={{ borderRadius: 16 }}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={10}>
                  <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      Evolución de Ingresos
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      Comportamiento de facturación últimos 6 meses
                    </Typography.Text>
                  </div>
                </Flex>
                <DashboardRevenueChart points={revenuePoints} currencyCode={currencyCode} />
              </Card>
              <Card style={{ borderRadius: 16 }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 10 }}>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Actividad Reciente
                  </Typography.Title>
                </Flex>
                <div style={dashboardRecentListStyle}>
                  {recentActivity.length ? (
                    recentActivity.map((item) => (
                      <DashboardActivityItem
                        key={item.key}
                        customerName={item.customerName}
                        invoiceNumber={item.invoiceNumber}
                        amount={item.amount}
                        statusLabel={item.statusLabel}
                        statusTone={item.statusTone}
                      />
                    ))
                  ) : (
                    <Typography.Text type="secondary">No hay actividad reciente.</Typography.Text>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
