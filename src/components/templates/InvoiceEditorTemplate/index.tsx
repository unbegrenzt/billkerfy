import { Breadcrumb, Card, Flex, Layout, Menu, Typography } from 'antd'
import {
  companyBlockStyle,
  invoiceEditorBodyStyle,
} from '@/components/templates/InvoiceEditorTemplate/InvoiceEditorTemplate.styles'
import type { InvoiceEditorTemplateProps } from '@/components/templates/InvoiceEditorTemplate/InvoiceEditorTemplate.types'

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

export function InvoiceEditorTemplate({
  pageTitle,
  metaFields,
  customerSection,
  lineItemsSection,
  notesAndSummarySection,
  actionsBar,
}: InvoiceEditorTemplateProps) {
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
          <div style={invoiceEditorBodyStyle}>
            <div>
              <Breadcrumb items={[{ title: 'Invoices' }, { title: 'Create Invoice' }]} />
              <Typography.Title level={2} style={{ marginTop: 12 }}>
                {pageTitle}
              </Typography.Title>
            </div>
            <Card>
              <Flex justify="space-between" gap={24} wrap style={{ marginBottom: 24 }}>
                <div style={companyBlockStyle}>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    Billkerfy
                  </Typography.Title>
                  <Typography.Text strong>Billkerfy LLC</Typography.Text>
                  <Typography.Text type="secondary">42 Innovation Avenue</Typography.Text>
                  <Typography.Text type="secondary">Madrid, Spain</Typography.Text>
                  <Typography.Text type="secondary">Tax ID: B12345678</Typography.Text>
                </div>
                <div style={{ flex: 1, minWidth: 320 }}>{metaFields}</div>
              </Flex>
              {customerSection}
              <div style={{ marginTop: 24 }}>{lineItemsSection}</div>
              <div style={{ marginTop: 24 }}>{notesAndSummarySection}</div>
            </Card>
          </div>
        </Layout.Content>
        {actionsBar}
      </Layout>
    </Layout>
  )
}
