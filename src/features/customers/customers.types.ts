export type Customer = {
  $id: string
  organizationId: string
  companyName: string
  taxId: string | null
  address: string
  email: string | null
  phone: string | null
}

export type CreateCustomerInput = {
  organizationId: string
  companyName: string
}
