export type Organization = {
  $id: string
  ownerUserId: string
  legalName: string
  tradeName: string | null
  taxId: string
  addressLine1: string
  city: string
  country: string
  currencyCode: string
}
