import { useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Card, Flex, Grid, Input, Layout, Menu, Select, Space, Typography, message } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  settingsBodyGridStyle,
  settingsCardsStackStyle,
  settingsFormGridStyle,
  settingsFullColumnStyle,
  settingsHeaderStyle,
  settingsLogoBoxStyle,
  settingsMainStyle,
  settingsPageLayoutStyle,
  settingsSectionMenuStyle,
  settingsSiderStyle,
} from '@/components/pages/SettingsPage/SettingsPage.styles'
import type {
  BillingSettingsForm,
  CompanySettingsForm,
  SettingsSectionKey,
} from '@/components/pages/SettingsPage/SettingsPage.types'
import { useOrganizationsStore } from '@/features/organizations/organizations.store'
import { account } from '@/lib/appwrite'

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

const defaultBillingForm: BillingSettingsForm = {
  currencyCode: 'EUR',
  defaultVatRate: '21',
  invoicePrefix: 'INV-2026-',
  dueDays: '30',
  legalTerms:
    'El pago debe realizarse dentro de los 30 dias posteriores a la emision de la factura.',
}

export function SettingsPage() {
  const screens = Grid.useBreakpoint()
  const navigate = useNavigate()
  const organization = useOrganizationsStore((state) => state.organization)
  const organizationLoading = useOrganizationsStore((state) => state.isLoading)
  const organizationError = useOrganizationsStore((state) => state.error)
  const loadPrimaryOrganization = useOrganizationsStore((state) => state.loadPrimaryOrganization)

  const [activeSection, setActiveSection] = useState<SettingsSectionKey>('company')
  const [accountEmail, setAccountEmail] = useState('alex.morgan@empresa.com')
  const [companyForm, setCompanyForm] = useState<CompanySettingsForm>({
    legalName: '',
    taxId: '',
    addressLine1: '',
    city: '',
    country: '',
    phone: '',
  })
  const [billingForm, setBillingForm] = useState<BillingSettingsForm>(defaultBillingForm)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  useEffect(() => {
    void loadPrimaryOrganization()
  }, [loadPrimaryOrganization])

  useEffect(() => {
    void account
      .get()
      .then((response) => {
        if (response.email) {
          setAccountEmail(response.email)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!organization) {
      return
    }

    setCompanyForm({
      legalName: organization.legalName,
      taxId: organization.taxId,
      addressLine1: organization.addressLine1,
      city: organization.city,
      country: organization.country,
      phone: '',
    })
    setBillingForm((current) => ({
      ...current,
      currencyCode: organization.currencyCode || 'EUR',
    }))
  }, [organization])

  const organizationName = useMemo(() => {
    if (organization?.tradeName) {
      return organization.tradeName
    }
    return organization?.legalName ?? 'Billkerfy'
  }, [organization?.legalName, organization?.tradeName])

  const bodyGridStyle = useMemo(
    () => ({
      ...settingsBodyGridStyle,
      gridTemplateColumns: screens.lg ? '240px minmax(0, 1fr)' : '1fr',
    }),
    [screens.lg],
  )

  const formGridStyle = useMemo(
    () => ({
      ...settingsFormGridStyle,
      gridTemplateColumns: screens.md ? 'repeat(2, minmax(0, 1fr))' : '1fr',
    }),
    [screens.md],
  )

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

  const handleSave = () => {
    if (password && password !== passwordConfirm) {
      message.error('Las contrasenas no coinciden')
      return
    }
    message.warning('La persistencia de configuracion aun no esta conectada al backend')
  }

  return (
    <Layout style={settingsPageLayoutStyle}>
      <Layout.Sider theme="light" width={260} breakpoint="lg" collapsedWidth={0} style={settingsSiderStyle}>
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
          <Menu mode="inline" selectedKeys={['settings']} items={menuItems} onClick={handleMenuSelect} />
          <Card size="small" style={{ marginTop: 'auto' }}>
            <Flex align="center" gap={10}>
              <Avatar>{organizationName.charAt(0).toUpperCase()}</Avatar>
              <div>
                <Typography.Text strong>{organizationName}</Typography.Text>
                <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                  Professional Plan
                </Typography.Text>
              </div>
            </Flex>
          </Card>
        </Flex>
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <div style={settingsMainStyle}>
            <Flex justify="space-between" align="center" gap={16} style={settingsHeaderStyle}>
              <div>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  Configuracion
                </Typography.Title>
                <Typography.Text type="secondary">
                  Administra los detalles de tu empresa y preferencias de la cuenta.
                </Typography.Text>
              </div>
              <Button type="primary" icon={<i className="mgc_save_2_line" />} onClick={handleSave}>
                Guardar Cambios
              </Button>
            </Flex>
            <div style={{ marginTop: 24 }}>
              <div style={bodyGridStyle}>
                <div style={settingsSectionMenuStyle}>
                  <Button
                    type={activeSection === 'company' ? 'primary' : 'text'}
                    icon={<i className="mgc_store_2_line" />}
                    onClick={() => setActiveSection('company')}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    Perfil de Empresa
                  </Button>
                  <Button
                    type={activeSection === 'billing' ? 'primary' : 'text'}
                    icon={<i className="mgc_settings_7_line" />}
                    onClick={() => setActiveSection('billing')}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    Preferencias
                  </Button>
                  <Button
                    type={activeSection === 'account' ? 'primary' : 'text'}
                    icon={<i className="mgc_user_3_line" />}
                    onClick={() => setActiveSection('account')}
                    style={{ justifyContent: 'flex-start' }}
                  >
                    Cuenta
                  </Button>
                </div>
                <div style={settingsCardsStackStyle}>
                  {(activeSection === 'company' || activeSection === 'billing' || activeSection === 'account') && (
                    <Card
                      title="Perfil de Empresa"
                      extra={<Typography.Text type="secondary">Informacion visible en tus facturas</Typography.Text>}
                    >
                      <div style={formGridStyle}>
                        <div style={settingsFullColumnStyle}>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Logo de la Empresa
                          </Typography.Text>
                          <Flex align="center" gap={16}>
                            <div style={settingsLogoBoxStyle}>
                              <i className="mgc_pic_2_line" style={{ fontSize: 28 }} />
                            </div>
                            <Space>
                              <Button>Subir imagen</Button>
                              <Button danger>Eliminar</Button>
                            </Space>
                          </Flex>
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Nombre Fiscal
                          </Typography.Text>
                          <Input
                            value={companyForm.legalName}
                            onChange={(event) =>
                              setCompanyForm((current) => ({ ...current, legalName: event.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>CIF / NIF</Typography.Text>
                          <Input
                            value={companyForm.taxId}
                            onChange={(event) =>
                              setCompanyForm((current) => ({ ...current, taxId: event.target.value }))
                            }
                          />
                        </div>
                        <div style={settingsFullColumnStyle}>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Direccion Fiscal
                          </Typography.Text>
                          <Input
                            value={companyForm.addressLine1}
                            onChange={(event) =>
                              setCompanyForm((current) => ({ ...current, addressLine1: event.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>Ciudad</Typography.Text>
                          <Input
                            value={companyForm.city}
                            onChange={(event) =>
                              setCompanyForm((current) => ({ ...current, city: event.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>Telefono</Typography.Text>
                          <Input
                            value={companyForm.phone}
                            onChange={(event) =>
                              setCompanyForm((current) => ({ ...current, phone: event.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                  {(activeSection === 'billing' || activeSection === 'account') && (
                    <Card
                      title="Preferencias de Facturacion"
                      extra={<Typography.Text type="secondary">Valores por defecto</Typography.Text>}
                    >
                      <div style={formGridStyle}>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Moneda Principal
                          </Typography.Text>
                          <Select
                            style={{ width: '100%' }}
                            value={billingForm.currencyCode}
                            options={[
                              { value: 'EUR', label: 'Euro (EUR)' },
                              { value: 'USD', label: 'Dolar (USD)' },
                              { value: 'GBP', label: 'Libra (GBP)' },
                            ]}
                            onChange={(value) =>
                              setBillingForm((current) => ({ ...current, currencyCode: value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            IVA por Defecto (%)
                          </Typography.Text>
                          <Input
                            value={billingForm.defaultVatRate}
                            onChange={(event) =>
                              setBillingForm((current) => ({ ...current, defaultVatRate: event.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Prefijo de Facturas
                          </Typography.Text>
                          <Input
                            value={billingForm.invoicePrefix}
                            onChange={(event) =>
                              setBillingForm((current) => ({ ...current, invoicePrefix: event.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Vencimiento (Dias)
                          </Typography.Text>
                          <Input
                            value={billingForm.dueDays}
                            onChange={(event) =>
                              setBillingForm((current) => ({ ...current, dueDays: event.target.value }))
                            }
                          />
                        </div>
                        <div style={settingsFullColumnStyle}>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Terminos y Condiciones Legales
                          </Typography.Text>
                          <Input.TextArea
                            rows={4}
                            value={billingForm.legalTerms}
                            onChange={(event) =>
                              setBillingForm((current) => ({ ...current, legalTerms: event.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                  {activeSection === 'account' && (
                    <Card title="Cuenta" extra={<Typography.Text type="secondary">Credenciales de acceso</Typography.Text>}>
                      <div style={formGridStyle}>
                        <div style={settingsFullColumnStyle}>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Correo Electronico
                          </Typography.Text>
                          <Input disabled value={accountEmail} />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Nueva Contrasena
                          </Typography.Text>
                          <Input.Password
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Confirmar Contrasena
                          </Typography.Text>
                          <Input.Password
                            value={passwordConfirm}
                            onChange={(event) => setPasswordConfirm(event.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
            {organizationLoading ? (
              <Typography.Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                Loading organization data...
              </Typography.Text>
            ) : null}
            {organizationError ? (
              <Typography.Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                {organizationError}
              </Typography.Text>
            ) : null}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
