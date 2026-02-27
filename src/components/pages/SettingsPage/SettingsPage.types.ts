export type SettingsSectionKey = 'company' | 'billing' | 'account'

export type CompanySettingsForm = {
  legalName: string
  taxId: string
  addressLine1: string
  city: string
  country: string
  phone: string
}

export type BillingSettingsForm = {
  currencyCode: string
  defaultVatRate: string
  invoicePrefix: string
  dueDays: string
  legalTerms: string
}
