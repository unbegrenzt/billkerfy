import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Layout,
  Menu,
  Radio,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AppBrand } from '@/components/atoms/AppBrand'
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
  AccountProfileForm,
  AccountSecurityForm,
  BillingSettingsForm,
  CompanySettingsForm,
  ExportSettingsForm,
  LocalizationSettingsForm,
  NotificationSettingsForm,
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

const defaultLocalizationForm: LocalizationSettingsForm = {
  language: 'es-ES',
  timezone: 'Europe/Madrid',
  dateFormat: 'DD/MM/YYYY',
}

const defaultNotificationsForm: NotificationSettingsForm = {
  weeklySummary: true,
  overdueAlerts: true,
  productNews: false,
}

const defaultExportForm: ExportSettingsForm = {
  format: 'pdf',
}

export function SettingsPage() {
  const screens = Grid.useBreakpoint()
  const navigate = useNavigate()
  const organization = useOrganizationsStore((state) => state.organization)
  const organizationLoading = useOrganizationsStore((state) => state.isLoading)
  const organizationError = useOrganizationsStore((state) => state.error)
  const loadPrimaryOrganization = useOrganizationsStore((state) => state.loadPrimaryOrganization)

  const [activeSection, setActiveSection] = useState<SettingsSectionKey>('company')
  const [companyForm, setCompanyForm] = useState<CompanySettingsForm>({
    legalName: '',
    taxId: '',
    addressLine1: '',
    city: '',
    country: '',
    phone: '',
  })
  const [billingForm, setBillingForm] = useState<BillingSettingsForm>(defaultBillingForm)
  const [localizationForm, setLocalizationForm] = useState<LocalizationSettingsForm>(defaultLocalizationForm)
  const [notificationsForm, setNotificationsForm] = useState<NotificationSettingsForm>(defaultNotificationsForm)
  const [exportForm, setExportForm] = useState<ExportSettingsForm>(defaultExportForm)
  const [accountProfileForm, setAccountProfileForm] = useState<AccountProfileForm>({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@empresa.com',
  })
  const [accountSecurityForm, setAccountSecurityForm] = useState<AccountSecurityForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    void loadPrimaryOrganization()
  }, [loadPrimaryOrganization])

  useEffect(() => {
    void account
      .get()
      .then((response) => {
        const fullName = (response.name ?? '').trim()
        const [firstName = 'Alex', ...rest] = fullName.split(/\s+/).filter(Boolean)
        const lastName = rest.join(' ') || 'Morgan'
        setAccountProfileForm((current) => ({
          ...current,
          firstName,
          lastName,
          email: response.email ?? current.email,
        }))
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
    if (
      accountSecurityForm.newPassword &&
      accountSecurityForm.newPassword !== accountSecurityForm.confirmPassword
    ) {
      message.error('Las contrasenas no coinciden')
      return
    }
    if (accountSecurityForm.newPassword && !accountSecurityForm.currentPassword) {
      message.error('Introduce tu contrasena actual para actualizar la cuenta')
      return
    }
    message.warning('La persistencia de configuracion aun no esta conectada al backend')
  }

  const headerDescription =
    activeSection === 'billing'
      ? 'Administra tus preferencias personales y de la interfaz.'
      : activeSection === 'account'
        ? 'Gestiona la informacion de tu cuenta y seguridad.'
      : 'Administra los detalles de tu empresa y preferencias de la cuenta.'

  const saveButtonLabel =
    activeSection === 'billing'
      ? 'Guardar Preferencias'
      : activeSection === 'account'
        ? 'Guardar Cambios de Cuenta'
        : 'Guardar Cambios'

  return (
    <Layout style={settingsPageLayoutStyle}>
      <Layout.Sider theme="light" width={260} breakpoint="lg" collapsedWidth={0} style={settingsSiderStyle}>
        <Flex vertical style={{ height: '100%', padding: 16 }}>
          <AppBrand />
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
                <Typography.Text type="secondary">{headerDescription}</Typography.Text>
              </div>
              <Button type="primary" icon={<i className="mgc_save_2_line" />} onClick={handleSave}>
                {saveButtonLabel}
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
                  {activeSection === 'company' && (
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
                  {activeSection === 'billing' && (
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
                  {activeSection === 'billing' && (
                    <Card
                      title="Localizacion e Idioma"
                      extra={<Typography.Text type="secondary">Visualizacion del panel</Typography.Text>}
                    >
                      <div style={formGridStyle}>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Idioma de la Interfaz
                          </Typography.Text>
                          <Select
                            style={{ width: '100%' }}
                            value={localizationForm.language}
                            options={[
                              { value: 'es-ES', label: 'Espanol (Espana)' },
                              { value: 'en-GB', label: 'English (UK)' },
                              { value: 'en-US', label: 'English (US)' },
                              { value: 'fr-FR', label: 'Francais' },
                              { value: 'de-DE', label: 'Deutsch' },
                            ]}
                            onChange={(value) =>
                              setLocalizationForm((current) => ({ ...current, language: value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Zona Horaria
                          </Typography.Text>
                          <Select
                            style={{ width: '100%' }}
                            value={localizationForm.timezone}
                            options={[
                              { value: 'Europe/Madrid', label: '(GMT+01:00) Madrid, Paris, Roma' },
                              { value: 'Europe/London', label: '(GMT+00:00) Londres, Lisboa, Casablanca' },
                              { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
                              { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo, Seoul' },
                            ]}
                            onChange={(value) =>
                              setLocalizationForm((current) => ({ ...current, timezone: value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Formato de Fecha
                          </Typography.Text>
                          <Select
                            style={{ width: '100%' }}
                            value={localizationForm.dateFormat}
                            options={[
                              { value: 'DD/MM/YYYY', label: 'DD/MM/AAAA (31/12/2024)' },
                              { value: 'YYYY-MM-DD', label: 'AAAA-MM-DD (2024-12-31)' },
                              { value: 'MM/DD/YYYY', label: 'MM/DD/AAAA (12/31/2024)' },
                            ]}
                            onChange={(value) =>
                              setLocalizationForm((current) => ({ ...current, dateFormat: value }))
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                  {activeSection === 'billing' && (
                    <Card
                      title="Notificaciones por Correo"
                      extra={<Typography.Text type="secondary">Comunicaciones por email</Typography.Text>}
                    >
                      <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <Flex justify="space-between" align="center" gap={16}>
                          <div>
                            <Typography.Text strong>Resumen semanal de facturacion</Typography.Text>
                            <Typography.Text type="secondary" style={{ display: 'block' }}>
                              Recibe un reporte cada lunes con el estado de tus cobros.
                            </Typography.Text>
                          </div>
                          <Switch
                            checked={notificationsForm.weeklySummary}
                            onChange={(checked) =>
                              setNotificationsForm((current) => ({ ...current, weeklySummary: checked }))
                            }
                          />
                        </Flex>
                        <Flex justify="space-between" align="center" gap={16}>
                          <div>
                            <Typography.Text strong>Avisos de facturas vencidas</Typography.Text>
                            <Typography.Text type="secondary" style={{ display: 'block' }}>
                              Te avisaremos cuando un cliente supere la fecha de vencimiento.
                            </Typography.Text>
                          </div>
                          <Switch
                            checked={notificationsForm.overdueAlerts}
                            onChange={(checked) =>
                              setNotificationsForm((current) => ({ ...current, overdueAlerts: checked }))
                            }
                          />
                        </Flex>
                        <Flex justify="space-between" align="center" gap={16}>
                          <div>
                            <Typography.Text strong>Novedades de Billkerfy</Typography.Text>
                            <Typography.Text type="secondary" style={{ display: 'block' }}>
                              Nuevas funcionalidades y actualizaciones de la plataforma.
                            </Typography.Text>
                          </div>
                          <Switch
                            checked={notificationsForm.productNews}
                            onChange={(checked) =>
                              setNotificationsForm((current) => ({ ...current, productNews: checked }))
                            }
                          />
                        </Flex>
                      </Space>
                    </Card>
                  )}
                  {activeSection === 'billing' && (
                    <Card
                      title="Opciones de Exportacion"
                      extra={<Typography.Text type="secondary">Formato de descarga predeterminado</Typography.Text>}
                    >
                      <Radio.Group
                        value={exportForm.format}
                        onChange={(event) =>
                          setExportForm((current) => ({ ...current, format: event.target.value as 'pdf' | 'excel' }))
                        }
                        style={{ width: '100%' }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: screens.sm ? 'repeat(2, minmax(0, 1fr))' : '1fr',
                            gap: 12,
                          }}
                        >
                          <Card size="small">
                            <Radio value="pdf">
                              <Space size={10}>
                                <i className="mgc_file_pdf_line" style={{ fontSize: 18 }} />
                                <span>PDF Document</span>
                              </Space>
                            </Radio>
                          </Card>
                          <Card size="small">
                            <Radio value="excel">
                              <Space size={10}>
                                <i className="mgc_table_2_line" style={{ fontSize: 18 }} />
                                <span>Excel / CSV</span>
                              </Space>
                            </Radio>
                          </Card>
                        </div>
                      </Radio.Group>
                    </Card>
                  )}
                  {activeSection === 'account' && (
                    <Card
                      title="Informacion Personal"
                      extra={<Typography.Text type="secondary">Datos basicos de tu perfil</Typography.Text>}
                    >
                      <div style={formGridStyle}>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Nombre
                          </Typography.Text>
                          <Input
                            value={accountProfileForm.firstName}
                            onChange={(event) =>
                              setAccountProfileForm((current) => ({ ...current, firstName: event.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Apellidos
                          </Typography.Text>
                          <Input
                            value={accountProfileForm.lastName}
                            onChange={(event) =>
                              setAccountProfileForm((current) => ({ ...current, lastName: event.target.value }))
                            }
                          />
                        </div>
                        <div style={settingsFullColumnStyle}>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Correo Electronico
                          </Typography.Text>
                          <Input disabled suffix={<i className="mgc_lock_line" />} value={accountProfileForm.email} />
                        </div>
                      </div>
                    </Card>
                  )}
                  {activeSection === 'account' && (
                    <Card title="Seguridad" extra={<Typography.Text type="secondary">Actualiza tu contrasena</Typography.Text>}>
                      <div style={formGridStyle}>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Contrasena Actual
                          </Typography.Text>
                          <Input.Password
                            value={accountSecurityForm.currentPassword}
                            onChange={(event) =>
                              setAccountSecurityForm((current) => ({
                                ...current,
                                currentPassword: event.target.value,
                              }))
                            }
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Nueva Contrasena
                          </Typography.Text>
                          <Input.Password
                            value={accountSecurityForm.newPassword}
                            onChange={(event) =>
                              setAccountSecurityForm((current) => ({ ...current, newPassword: event.target.value }))
                            }
                            placeholder="Minimo 8 caracteres"
                          />
                        </div>
                        <div>
                          <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                            Confirmar Nueva Contrasena
                          </Typography.Text>
                          <Input.Password
                            value={accountSecurityForm.confirmPassword}
                            onChange={(event) =>
                              setAccountSecurityForm((current) => ({
                                ...current,
                                confirmPassword: event.target.value,
                              }))
                            }
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                  {activeSection === 'account' && (
                    <Card
                      title="Plan y Suscripcion"
                      extra={<Typography.Text type="secondary">Detalles de facturacion</Typography.Text>}
                    >
                      <Flex
                        justify="space-between"
                        align={screens.sm ? 'center' : 'flex-start'}
                        gap={16}
                        wrap
                        style={{
                          padding: 16,
                          border: '1px solid #99f6e4',
                          borderRadius: 12,
                          background: '#f0fdfa',
                        }}
                      >
                        <Flex align="center" gap={12}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 999,
                              display: 'grid',
                              placeItems: 'center',
                              color: '#134e4a',
                              background: '#99f6e4',
                            }}
                          >
                            <i className="mgc_wallet_4_line" style={{ fontSize: 20 }} />
                          </div>
                          <div>
                            <Typography.Text type="secondary" style={{ display: 'block' }}>
                              Tu Plan Actual
                            </Typography.Text>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                              Plan Profesional
                            </Typography.Title>
                          </div>
                        </Flex>
                        <Button icon={<i className="mgc_wallet_4_line" />} style={{ borderColor: '#14b8a6', color: '#0f766e' }}>
                          Gestionar Suscripcion
                        </Button>
                      </Flex>
                      <Space direction="vertical" size={10} style={{ marginTop: 16 }}>
                        <Typography.Text>
                          <i className="mgc_check_circle_fill" style={{ color: '#16a34a', marginRight: 8 }} />
                          Siguiente cobro: 15 de Octubre, 2024
                        </Typography.Text>
                        <Typography.Text>
                          <i className="mgc_check_circle_fill" style={{ color: '#16a34a', marginRight: 8 }} />
                          Metodo de pago: Tarjeta de Credito (•••• 4242)
                        </Typography.Text>
                      </Space>
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
