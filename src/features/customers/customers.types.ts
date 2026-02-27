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
  taxId?: string
  address?: string
  email?: string
  phone?: string
}

export type UpdateCustomerInput = {
  customerId: string
  companyName?: string
  taxId: string
  address: string
  email?: string
  phone?: string
}
