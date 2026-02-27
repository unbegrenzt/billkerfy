import { create } from 'zustand'
import {
  createCustomer,
  fetchCustomersByOrganization,
  updateCustomer,
} from '@/features/customers/customers.service'
import type { Customer } from '@/features/customers/customers.types'

type CustomersState = {
  customers: Customer[]
  isLoading: boolean
  error: string | null
  loadCustomersByOrganization: (organizationId: string) => Promise<void>
  addCustomer: (organizationId: string, companyName: string) => Promise<Customer | null>
  saveCustomerDetails: (customerId: string, taxId: string, address: string) => Promise<Customer | null>
}

export const useCustomersStore = create<CustomersState>((set) => ({
  customers: [],
  isLoading: false,
  error: null,
  loadCustomersByOrganization: async (organizationId: string) => {
    set({ isLoading: true, error: null })

    try {
      const customers = await fetchCustomersByOrganization(organizationId)
      set({ customers, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load customers'
      set({ isLoading: false, error: errorMessage })
    }
  },
  addCustomer: async (organizationId: string, companyName: string) => {
    try {
      const customer = await createCustomer({ organizationId, companyName })
      set((state) => ({ customers: [customer, ...state.customers] }))
      return customer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create customer'
      set({ error: errorMessage })
      return null
    }
  },
  saveCustomerDetails: async (customerId: string, taxId: string, address: string) => {
    set({ error: null })

    try {
      const customer = await updateCustomer({ customerId, taxId, address })
      set((state) => ({
        customers: state.customers.map((item) => (item.$id === customer.$id ? customer : item)),
        error: null,
      }))
      return customer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save customer details'
      set({ error: errorMessage })
      return null
    }
  },
}))
